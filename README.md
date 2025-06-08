# WebScraper101

A clean, modular TypeScript project for both static and dynamic web scraping. Includes:
- Static scraper for books.toscrape.com (Cheerio + Axios)
- Dynamic scraper for quotes.toscrape.com/js/ (Playwright)

## Features
- **TypeScript**: Type-safe, modern codebase
- **Modular Structure**: Static and dynamic scrapers separated
- **Static HTML Scraping**: Uses Cheerio for fast, reliable parsing
- **Dynamic Scraping**: Uses Playwright for JavaScript-rendered sites, screenshots, and visual feedback
- **Progress Logging**: Logs progress and steps for both scrapers
- **Retry Logic**: Retries failed requests (static)
- **Delay Between Requests**: Configurable delay
- **Easy to Extend**: Add export, more fields, or concurrency easily

## Tech Stack
- **Language**: TypeScript
- **Runtime**: Node.js
- **Packages**: axios, cheerio, playwright
- **Dev Tools**: ts-node, typescript, @types/node

## Project Structure
```
/src
  ├── static/
  │     ├── index.ts         # Static scraper entry point
  │     ├── fetcher.ts       # HTTP fetching logic (with retry)
  │     ├── parser.ts        # HTML parsing logic
  │     └── types.ts         # Book types
  └── dynamic/
        ├── playwrightScraper.ts # Dynamic scraper entry point
        ├── utils.ts             # delay, logging helpers
        └── types.ts             # Quote types
tsconfig.json
package.json
/data/books.json           # Static scraper output (gitignored)
/data/dynamic-quotes.json  # Dynamic scraper output (gitignored)
/data/screenshots/         # Dynamic scraper screenshots (gitignored)
```

## Usage

### 1. Install dependencies
```
npm install
```

### 2. Run the static scraper (books)
```
npm run scrape:static
```
- Scrapes all books from https://books.toscrape.com
- Saves results to `/data/books.json`

### 3. Run the dynamic scraper (quotes)
```
npm run scrape:dynamic
```
- Scrapes all quotes from https://quotes.toscrape.com/js/
- Takes a screenshot per page in `/data/screenshots/`
- Saves results to `/data/dynamic-quotes.json`

### 4. Build for production
```
npx tsc
```
Compiled files will be in the `dist/` directory.

## Extending
- Add more scrapers in their own folders
- Add export to CSV, database, etc.
- Add tests for each module

## License
MIT 