import { fetchHTML } from './fetcher';
import { parseBooks } from './parser';
import { Book } from './types';

const BASE_URL = 'https://books.toscrape.com/';

async function main() {
  try {
    const html = await fetchHTML(BASE_URL);
    console.log(html);
    const books: Book[] = parseBooks(html);
    console.table(books);
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 