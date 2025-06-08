import * as cheerio from 'cheerio';
import { Book } from './types';

export function parseBooks(html: string): Book[] {
  const $ = cheerio.load(html);
  const books: Book[] = [];

  $('.product_pod').each((_, element) => {
    const title = $(element).find('h3 a').attr('title') || '';
    const price = $(element).find('.price_color').text();
    const link = $(element).find('h3 a').attr('href') || '';
    books.push({ title, price, link });
  });

  return books;
} 