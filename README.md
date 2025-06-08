# WebScraper101

A clean, modular TypeScript project that scrapes book data (title, price, link) from the homepage of [books.toscrape.com](https://books.toscrape.com) using Cheerio for static HTML parsing.

## Features
- **TypeScript**: Type-safe, modern codebase
- **Modular Structure**: Separation of concerns (fetching, parsing, types)
- **Static HTML Scraping**: Uses Cheerio for fast, reliable parsing
- **Easy to Extend**: Add pagination, export, or more fields easily

## Tech Stack
- **Language**: TypeScript
- **Runtime**: Node.js
- **Packages**: [axios](https://www.npmjs.com/package/axios), [cheerio](https://www.npmjs.com/package/cheerio)
- **Dev Tools**: ts-node, typescript, @types/node

## Project Structure
```
/src
  ├── index.ts      # Entry point
  ├── fetcher.ts    # HTTP fetching logic
  ├── parser.ts     # HTML parsing logic
  └── types.ts      # TypeScript types
tsconfig.json
package.json
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

### 3. Run the scraper
```
npx ts-node src/index.ts
```

### 4. Build for production
```
npx tsc
```
Compiled files will be in the `dist/` directory.

## Output
The scraper logs an array of book objects (title, price, link) from the homepage to the console.

## Extending
- **Pagination**: Add logic to fetch and parse additional pages
- **Export**: Save results to CSV, JSON, or database
- **Testing**: Add unit tests for parser and fetcher modules

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License
MIT 