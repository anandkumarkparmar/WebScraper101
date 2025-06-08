import { fetchWithRetry } from './fetcher';
import { parseBooks } from './parser';
import { Book, ScrapeResult } from './types';
import * as fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://books.toscrape.com/';
const PAGE_URL = (page: number) =>
  page === 1 ? BASE_URL : `${BASE_URL}catalogue/page-${page}.html`;
const OUTPUT_PATH = path.join(__dirname, '../../data/books.json');
const DELAY_BETWEEN_REQUESTS = 1000; // ms
const RETRIES = 3;

async function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

async function crawlAllBooks() {
  let page = 1;
  let allBooks: Book[] = [];
  while (true) {
    const url = PAGE_URL(page);
    console.log(`[INFO] Fetching page ${page}: ${url}`);
    try {
      const html = await fetchWithRetry(url, RETRIES, DELAY_BETWEEN_REQUESTS);
      const books = parseBooks(html);
      if (books.length === 0) {
        console.log(`[INFO] No books found on page ${page}. Stopping.`);
        break;
      }
      allBooks = allBooks.concat(books);
      console.log(`[INFO] Page ${page} scraped. Books so far: ${allBooks.length}`);
      page++;
      await delay(DELAY_BETWEEN_REQUESTS);
    } catch (error) {
      console.error(`[ERROR] Failed to fetch page ${page}:`, error);
      break;
    }
  }
  return allBooks;
}

async function main() {
  try {
    const books = await crawlAllBooks();
    const result: ScrapeResult = {
      books,
      scrapedAt: new Date().toISOString(),
    };
    await fs.writeFile(OUTPUT_PATH, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`[SUCCESS] Scraped ${books.length} books. Results saved to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('[FATAL] Error during scraping:', error);
  }
}

main(); 