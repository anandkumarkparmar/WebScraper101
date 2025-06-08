import { chromium, Page } from 'playwright';
import { delay, logStep } from './utils';
import { Quote } from './types';
import * as fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://quotes.toscrape.com/js/';
const OUTPUT_PATH = path.join(__dirname, '../../data/dynamic-quotes.json');
const SCREENSHOT_DIR = path.join(__dirname, '../../data/screenshots');
const DELAY_BETWEEN_PAGES = 1200; // ms

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
  logStep('Launching Chromium browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let allQuotes: Quote[] = [];
  let pageNum = 1;
  try {
    await page.goto(BASE_URL);
    logStep(`Navigated to ${BASE_URL}`);
    while (true) {
      logStep(`Waiting for quotes to load on page ${pageNum}...`);
      console.log('Loading...');
      await page.waitForSelector('.quote');
      logStep(`Extracting quotes from page ${pageNum}...`);
      const quotes = await extractQuotesFromPage(page);
      allQuotes = allQuotes.concat(quotes);
      logStep(`Saving screenshot for page ${pageNum}...`);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `page-${pageNum}.png`) });
      logStep(`Page ${pageNum} done. Quotes so far: ${allQuotes.length}`);
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
    await fs.writeFile(OUTPUT_PATH, JSON.stringify({ quotes: allQuotes, scrapedAt: new Date().toISOString() }, null, 2), 'utf-8');
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