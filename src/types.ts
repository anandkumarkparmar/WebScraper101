export interface Book {
  title: string;
  price: string;
  link: string;
}

export interface ScrapeResult {
  books: Book[];
  scrapedAt: string;
} 