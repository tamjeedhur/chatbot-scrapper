const cheerio = require('cheerio');
const { NodeHtmlMarkdown } = require('node-html-markdown');
const fs = require('fs').promises;

class Crawl {
  constructor() {
    // this.maxDepth = maxDepth;
    // this.maxPages = maxPages;
    this.seen = new Set();
    // this.pages = [];
    this.queue = [];
  }

  async crawl(startUrl) {
    this.addToQueue(startUrl);

    // while (this.shouldContinueCrawling()) {
    const { url } = this.queue.shift();

    if (this.isAlreadySeen(url)) return;

    this.seen.add(url);

    const html = await this.fetchPage(startUrl);

    return { url: startUrl, content: this.parseHtml(html) };

    // this.addNewUrlsToQueue(this.extractUrls(html, url), depth);
  }

  addToQueue(url, depth = 0) {
    this.queue.push({ url, depth });
  }
  isAlreadySeen(url) {
    return this.seen.has(url);
  }
  async fetchPage(url) {
    try {
      const response = await fetch(url); 
      return await response.text();
    } catch (error) {
      console.error(`Failed to fetch ${url}: ${error}`);
      return '';
    }
  }

  parseHtml(html) {
    const $ = cheerio.load(html);
    $('header').remove();
    $('footer').remove();

    $('a').removeAttr('href');
    return NodeHtmlMarkdown.translate($.html());
  }
}

// class Crawl {
//   constructor(maxDepth = 2, maxPages = 1) {
//     this.maxDepth = maxDepth;
//     this.maxPages = maxPages;
//     this.seen = new Set();
//     this.pages = [];
//     this.queue = [];
//   }

// async function crawl(startUrl) {
//   this.addToQueue(startUrl);

//   // while (this.shouldContinueCrawling()) {
//   // const { url, depth } = this.queue.shift();

//   // if (this.isTooDeep(depth) || this.isAlreadySeen(url)) continue;

//   // this.seen.add(url);

//   const html = await fetchPage(startUrl);

//   return { url: startUrl, content: parseHtml(html) };

//   // this.addNewUrlsToQueue(this.extractUrls(html, url), depth);
// }

//   return this.pages;
// }

// function isTooDeep(depth) {
//   return depth > this.maxDepth;
// }

// function isAlreadySeen(url) {
//   return this.seen.has(url);
// }

// function shouldContinueCrawling() {
//   return this.queue.length > 0 && this.pages.length < this.maxPages;
// }

// function addToQueue(url, depth = 0) {
//   this.queue.push({ url, depth });
// }

// function addNewUrlsToQueue(urls, depth) {
//   this.queue.push(...urls.map((url) => ({ url, depth: depth + 1 })));
// }

// async function fetchPage(url) {
//   try {
//     const response = await fetch(url);
//     return await response.text();
//   } catch (error) {
//     console.error(`Failed to fetch ${url}: ${error}`);
//     return '';
//   }
// }

// function parseHtml(html) {
//   const $ = cheerio.load(html);

//   $('a').removeAttr('href');
//   return NodeHtmlMarkdown.translate($.html());
// }

// function extractUrls(html, baseUrl) {
//   const $ = cheerio.load(html);
//   const relativeUrls = $('a')
//     .map((_, link) => $(link).attr('href'))
//     .get();
//   return relativeUrls.map((relativeUrl) => new URL(relativeUrl, baseUrl).href);
// }

const crawl = new Crawl();

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function crawlWithDelay(url, index) {
  let page = await crawl.crawl(url);
  await delay(5000 * index);
  return page;
}

async function crawlUrlsFromFile() {
  try {
    const urlsJson = await fs.readFile('urls.json', 'utf8');
    const urls = JSON.parse(urlsJson);

    const promises = [];

    for (const urlObj of urls) {
      const sitemaps = urlObj.urls.slice(0, 2);
      for (const [index, sitemap] of sitemaps.entries()) {
        promises.push(crawlWithDelay(sitemap, index));
        // console.log('Index:', index);
      }
    }

    const pages = await Promise.all(promises);

    const outputFile = 'newCrawler.json';
    await fs.writeFile(outputFile, JSON.stringify(pages, null, 2));
    console.log('Scraped data saved to', outputFile);
  } catch (error) {
    console.error('Error reading URLs from file:', error);
  }
}

// Crawl the given URL and get the pages
// crawl.crawl('https://theparkprodigy.com/the-park-prodigy-announces-free-disney-gift-card-with-purchase-of-disney-world-ticket/').then((pages) => {
//   console.log(pages);

// });

crawlUrlsFromFile();

module.exports = {};
