

const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeSitemap(sitemapUrl) {
    try {
      // Fetch the main sitemap
      const { data: mainSitemapXml } = await axios.get(sitemapUrl);
  
      // Load the main sitemap XML into Cheerio
      const $main = cheerio.load(mainSitemapXml, { xmlMode: true });
  
      // Extract the URLs of individual sitemaps
      const sitemapUrls = $main('sitemap loc')
        .map((_, el) => $main(el).text())
        .get();
      const scrapedData = [];
  
      // Scrape data from each URL in individual sitemaps
      for (const sitemapUrl of sitemapUrls) {
        const { data: sitemapXml } = await axios.get(sitemapUrl);
        const $ = cheerio.load(sitemapXml, { xmlMode: true });
  
        // Extract the URLs from the individual sitemap
        const urls = $('url loc')
          .map((_, el) => $(el).text())
          .get();
  
        // Scrape data from each URL
        for (const url of urls) {
          const { data: webpageHtml } = await axios.get(url);
          const $$ = cheerio.load(webpageHtml);
  
          // Exclude header and footer elements
          $$('.header-selector').remove();
          $$('.footer-selector').remove();
  
          // Get the remaining HTML content
          const contentHtml = $$.html();
  
          // Create a JSON object with the scraped data
          const scrapedDataItem = {
            url: url,
            contentHtml: contentHtml,
          };
  
          // Add the scraped data to the array
          scrapedData.push(scrapedDataItem);
        }
      }
  
      // Save the scraped data to a JSON file
      const jsonData = JSON.stringify(scrapedData, null, 2);
      fs.writeFileSync('scraped_data.json', jsonData);
      console.log('Scraped data saved to scraped_data.json');
    } catch (error) {
      console.error('An error occurred while scraping the sitemap:', error);
    }
  }
  
  // Call the function with your desired main sitemap URL
  const mainSitemapUrl = 'https://theparkprodigy.com/sitemap_index.xml';
  scrapeSitemap(mainSitemapUrl);
  module.exports = { scrapeSitemap };
