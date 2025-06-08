# WebScraper101

A clean, modular TypeScript project that scrapes book data (title, price, link) from the homepage of [books.toscrape.com](https://books.toscrape.com) using Cheerio for static HTML parsing.

## Features
- **TypeScript**: Type-safe, modern codebase
- **Modular Structure**: Separation of concerns (fetching, parsing, types)
- **Static HTML Scraping**: Uses Cheerio for fast, reliable parsing
- **Full-Site Crawl**: Crawls all pages, not just the first
- **Progress Logging**: Logs progress page-by-page and total books scraped
- **Retry Logic**: Retries failed requests with delay
- **Delay Between Requests**: Configurable delay to avoid overloading the server
- **Easy to Extend**: Add export, more fields, or concurrency easily

## Tech Stack
- **Language**: TypeScript
- **Runtime**: Node.js
- **Packages**: [axios](https://www.npmjs.com/package/axios), [cheerio](https://www.npmjs.com/package/cheerio)
- **Dev Tools**: ts-node, typescript, @types/node

## Project Structure
```
/src
  ├── index.ts      # Entry point
  ├── fetcher.ts    # HTTP fetching logic (with retry)
  ├── parser.ts     # HTML parsing logic
  └── types.ts      # TypeScript types
tsconfig.json
package.json
/data/books.json   # Output file (gitignored)
```

## Getting Started

### 1. Clone the repository
```
git clone git@github.com:anandkumarkparmar/WebScraper101.git
cd WebScraper101
```

### 2. Install dependencies
```
npm install
```

### 3. Run the scraper (full-site crawl)
```
npx ts-node src/index.ts
```

### 4. Build for production
```
npx tsc
```
Compiled files will be in the `dist/` directory.

## Output
The scraper logs progress to the console and saves all books to `/data/books.json` in the following format:

```json
{
  "books": [
    { "title": "...", "price": "...", "link": "..." },
    ...
  ],
  "scrapedAt": "2024-06-07T12:34:56.789Z"
}
```

## Extending
- **Pagination**: Already implemented for all pages
- **Export**: Save results to CSV, JSON, or database
- **Testing**: Add unit tests for parser and fetcher modules
- **Concurrency**: Add parallel page fetching if needed

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## Branches
- `main`: Stable, production-ready code
- `step_02/static_website_pagination_crawl`: Full-site crawl and advanced features (merged to main)

## License
MIT 