import { chromium, Page, BrowserContextOptions, LaunchOptions } from 'playwright';
import { delay, logStep } from './utils';
import { Quote } from './types';
import { getRandomUserAgent } from './userAgents';
import * as fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://quotes.toscrape.com/js/';
const OUTPUT_PATH = path.join(__dirname, '../../data/dynamic-quotes.json');
const SCREENSHOT_DIR = path.join(__dirname, '../../data/screenshots');
const DELAY_BETWEEN_PAGES = 1200; // ms
const RETRIES_PER_PAGE = 3;

function getProxyFromEnvOrArg(): string | undefined {
  // Priority: CLI arg > ENV > undefined
  const cliProxy = process.argv.find(arg => arg.startsWith('--proxy='));
  if (cliProxy) return cliProxy.replace('--proxy=', '');
  return process.env.PROXY;
}

function getProxyName(proxy?: string): string {
  if (!proxy) return 'no-proxy';
  try {
    const url = new URL(proxy);
    return url.hostname.replace(/\W/g, '_');
  } catch {
    return 'proxy';
  }
}

async function setStealth(page: Page) {
  // Playwright stealth tweaks
  await page.addInitScript(() => {
    // navigator.webdriver
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    // Permissions
    // @ts-ignore
    window.navigator.permissions.query = (parameters: any) => (
      parameters.name === 'notifications'
        ? Promise.resolve({ state: Notification.permission })
        : Promise.resolve({ state: 'denied' })
    );
    // Plugins
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    // Languages
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
  });
}

async function extractQuotesFromPage(page: Page): Promise<Quote[]> {
  return await page.$$eval('.quote', (quoteEls) => {
    return quoteEls.map((el) => {
      const text = (el.querySelector('.text') as HTMLElement)?.innerText || '';
      const author = (el.querySelector('.author') as HTMLElement)?.innerText || '';
      const tags = Array.from(el.querySelectorAll('.tags .tag')).map(tag => (tag as HTMLElement).innerText);
      return { text, author, tags };
    });
  });
}

export async function scrapeQuotesDynamic() {
  const proxy = getProxyFromEnvOrArg();
  const proxyName = getProxyName(proxy);
  logStep(`Launching Chromium browser...${proxy ? ` Using proxy: ${proxy}` : ''}`);
  const launchOptions: LaunchOptions = { headless: true };
  if (proxy) {
    launchOptions.proxy = { server: proxy };
  }
  const browser = await chromium.launch(launchOptions);
  const contextOptions: BrowserContextOptions = {};
  const userAgent = getRandomUserAgent();
  contextOptions.userAgent = userAgent;
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  await setStealth(page);
  let allQuotes: Quote[] = [];
  let pageNum = 1;
  try {
    await page.goto(BASE_URL);
    logStep(`Navigated to ${BASE_URL}`);
    while (true) {
      let success = false;
      for (let attempt = 1; attempt <= RETRIES_PER_PAGE; attempt++) {
        try {
          logStep(`Waiting for quotes to load on page ${pageNum} (Attempt ${attempt})...`);
          console.log('Loading...');
          await page.waitForSelector('.quote', { timeout: 10000 });
          logStep(`Extracting quotes from page ${pageNum}...`);
          const quotes = await extractQuotesFromPage(page);
          allQuotes = allQuotes.concat(quotes);
          logStep(`Saving screenshot for page ${pageNum}...`);
          await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${proxyName}_page-${pageNum}.png`) });
          logStep(`Page ${pageNum} done. Quotes so far: ${allQuotes.length}`);
          success = true;
          break;
        } catch (err) {
          logStep(`[RETRY] Failed to scrape page ${pageNum} (Attempt ${attempt}): ${err}`);
          if (attempt < RETRIES_PER_PAGE) await delay(1500);
        }
      }
      if (!success) {
        logStep(`[ERROR] Giving up on page ${pageNum} after ${RETRIES_PER_PAGE} attempts.`);
        break;
      }
      // Check for next button
      const nextBtn = await page.$('li.next > a');
      if (nextBtn) {
        logStep('Clicking next page...');
        await nextBtn.click();
        pageNum++;
        await delay(DELAY_BETWEEN_PAGES);
      } else {
        logStep('No more pages. Scraping complete.');
        break;
      }
    }
    logStep('Saving all quotes to JSON...');
    await fs.writeFile(OUTPUT_PATH, JSON.stringify({ quotes: allQuotes, scrapedAt: new Date().toISOString(), proxy, userAgent }, null, 2), 'utf-8');
    logStep(`Scraping finished. Total quotes: ${allQuotes.length}. Results saved to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('[FATAL] Error during dynamic scraping:', error);
  } finally {
    await browser.close();
  }
}

// If run directly, execute the scraper
if (require.main === module) {
  scrapeQuotesDynamic();
} 