// const fs = require('fs');
// const axios = require('axios');
// const cheerio = require('cheerio');

// async function scrapeSitemap(sitemapUrl) {
//   try {
//     // Fetch the main sitemap
//     const { data: mainSitemapXml } = await axios.get(sitemapUrl);

//     // Load the main sitemap XML into Cheerio
//     const $main = cheerio.load(mainSitemapXml, { xmlMode: true });

//     // Extract the URLs of individual sitemaps
//     const sitemapUrls = $main('sitemap loc')
//       .map((_, el) => $main(el).text())
//       .get();
//     const scrapedData = [];

//     // Scrape only one URL from each individual sitemap
//     for (const sitemapUrl of sitemapUrls) {
//       const { data: sitemapXml } = await axios.get(sitemapUrl);
//       const $ = cheerio.load(sitemapXml, { xmlMode: true });

//       // Extract the first URL from the individual sitemap
//       const url = $('url loc').first().text();

//       // Scrape data from the URL
//       const { data: webpageHtml } = await axios.get(url);
//       const $$ = cheerio.load(webpageHtml);

//       // Exclude header and footer elements
//       $$('.header-selector').remove();
//       $$('.footer-selector').remove();

//       // Get the remaining HTML content
//       const contentHtml = $$.html();

//       // Create a JSON object with the scraped data
//       const scrapedDataItem = {
//         url: url,
//         contentHtml: contentHtml,
//       };

//       // Add the scraped data to the array
//       scrapedData.push(scrapedDataItem);

//     //   console.log(scrapedD);
//     }

//     // Save the scraped data to a JSON file
//     const jsonData = JSON.stringify(scrapedData, null, 2);
//     fs.writeFileSync('scraped_data.json', jsonData);
//     console.log('Scraped data saved to scraped_data.json');
//   } catch (error) {
//     console.error('An error occurred while scraping the sitemap:', error);
//   }
// }

// // Call the function with your desired main sitemap URL
// // const mainSitemapUrl = 'http://example.com/main-sitemap.xml';
// // scrapeSitemap(mainSitemapUrl);
// const mainSitemapUrl = 'https://theparkprodigy.com/sitemap_index.xml';
// scrapeSitemap(mainSitemapUrl);

// const fs = require('fs');
// const axios = require('axios');
// const cheerio = require('cheerio');

// const { htmlToText } = require('html-to-text');

// async function scrapeSitemap(sitemapUrl) {
//   try {
//     // Fetch the main sitemap
//     const { data: mainSitemapXml } = await axios.get(sitemapUrl);

//     // Load the main sitemap XML into Cheerio
//     const $main = cheerio.load(mainSitemapXml, { xmlMode: true });

//     // Extract the URLs of individual sitemaps
//     const sitemapUrls = $main('sitemap loc')
//       .map((_, el) => $main(el).text())
//       .get();
//     const scrapedData = [];

//     // Scrape only one URL from each individual sitemap
//     for (const sitemapUrl of sitemapUrls) {
//       const { data: sitemapXml } = await axios.get(sitemapUrl);
//       const $ = cheerio.load(sitemapXml, { xmlMode: true });

//       // Extract the first URL from the individual sitemap
//       const url = $('url loc').first().text();

//       // Scrape data from the URL
//       const { data: webpageHtml } = await axios.get(url);
//         const $$ = cheerio.load(webpageHtml);

//         // const contentText = $$.text();

//       // Exclude header and footer elements
//     //   $$('.header-selector').remove();
//     //   $$('.footer-selector').remove();

//       // Get the remaining text content
//         //   const contentText = $$.text();

//         const contentHtml = $$.html();

//         const contentText = htmlToText(contentHtml);

//       // Create a JSON object with the scraped data
//       const scrapedDataItem = {
//         url: url,
//         contentText: contentText,
//       };

//       // Add the scraped data to the array
//       scrapedData.push(scrapedDataItem);

//       //   console.log(scrapedD);
//     }

//     // Save the scraped data to a JSON file
//     const jsonData = JSON.stringify(scrapedData, null, 2);
//     fs.writeFileSync('scraped_text.json', jsonData);
//     console.log('Scraped text saved to scraped_text.json');
//   } catch (error) {
//     console.error('An error occurred while scraping the sitemap:', error);
//   }
// }

// const mainSitemapUrl = 'https://theparkprodigy.com/sitemap_index.xml';
// scrapeSitemap(mainSitemapUrl);

// const axios = require('axios');
// const cheerio = require('cheerio');
// const fs = require('fs');

// // Function to fetch URLs from a sitemap
// async function fetchSitemapUrls(sitemapUrl) {
//   try {
//     const response = await axios.get(sitemapUrl);
//     const $ = cheerio.load(response.data, { xmlMode: true });
//     const urls = [];

//     $('url > loc').each((index, element) => {
//       urls.push($(element).text());
//     });

//     return urls;
//   } catch (error) {
//     console.error('Error fetching sitemap:', error);
//     return [];
//   }
// }

// // Function to scrape the body text and image tags from a URL
// async function scrapeUrl(url) {
//   try {
//     const response = await axios.get(url);
//     const $ = cheerio.load(response.data);
//     const bodyText = $('body').text();
//     const imageTags = [];

//     $('img').each((index, element) => {
//       imageTags.push($(element).attr('src'));
//     });

//     return {
//       url,
//       bodyText,
//       imageTags,
//     };
//   } catch (error) {
//     console.error(`Error scraping URL: ${url}`, error);
//     return {
//       url,
//       bodyText: '',
//       imageTags: [],
//     };
//   }
// }

// // Main function to scrape the website using sitemap
// async function scrapeWebsite(sitemapUrl, outputFilePath) {
//   try {
//     const { data: mainSitemapUrls } = await axios.get(sitemapUrl);

//     // Load the main sitemap XML into Cheerio
//     const $main = cheerio.load(mainSitemapUrls, { xmlMode: true });

//     // Extract the URLs of individual sitemaps
//     const sitemapUrls = $main('sitemap loc')
//       .map((_, el) => $main(el).text())
//       .get();
//     const scrapedData = [];

//     for (const sitemap of mainSitemapUrls) {
//       const sitemapUrls = await fetchSitemapUrls(sitemap);

//       if (sitemapUrls.length > 0) {
//         const firstUrl = sitemapUrls[0];
//         const scrapedUrlData = await scrapeUrl(firstUrl);
//         scrapedData.push(scrapedUrlData);
//       }
//     }

//     fs.writeFileSync(outputFilePath, JSON.stringify(scrapedData, null, 2));
//     console.log('Scraping complete. Data stored in', outputFilePath);
//   } catch (error) {
//     console.error('Error scraping website:', error);
//   }
// }

// // Usage example
// const sitemapUrl = 'https://theparkprodigy.com/sitemap_index.xml';
// const outputFilePath = 'scraped_data.json';
// scrapeWebsite(sitemapUrl, outputFilePath);
// const axios = require('axios');
// const { parseString } = require('xml2js');
// const fs = require('fs');

// async function scrapeSitemap() {
//   try {
//     const sitemapUrl = 'https://theparkprodigy.com/sitemap_index.xml'; // Replace with the actual sitemap URL

//     // Fetch the sitemap index file
//     const response = await axios.get(sitemapUrl);

//     // Parse the XML into a JavaScript object
//     const parsedXml = await parseXml(response.data);

//     // Access the URLs of individual sitemaps from the parsed object
//     const sitemapUrls = parsedXml.sitemapindex.sitemap.map((sitemapObj) => sitemapObj.loc[0]);

//     // Scrape URLs from each individual sitemap
//     const scrapedUrls = [];
//     for (const url of sitemapUrls) {
//       const sitemapResponse = await axios.get(url);
//       const sitemapXml = sitemapResponse.data;
//       const parsedSitemap = await parseXml(sitemapXml);
//       const urls = parsedSitemap.urlset.url.map((urlObj) => urlObj.loc[0]);
//       scrapedUrls.push(...urls);
//     }

//     // Output the scraped URLs
//     console.log(scrapedUrls);

//     // Save the scraped URLs to a JSON file
//     const jsonData = JSON.stringify(scrapedUrls, null, 2);
//     fs.writeFileSync('scrapedUrls.json', jsonData);

//     console.log('Scraped URLs saved to scrapedUrls.json');
//   } catch (error) {
//     console.error('Error scraping sitemap:', error);
//   }
// }

// // Helper function to parse XML
// function parseXml(xml) {
//   return new Promise((resolve, reject) => {
//     parseString(xml, (error, result) => {
//       if (error) reject(error);
//       else resolve(result);
//     });
//   });
// }

// const fs = require('fs');
// const axios = require('axios');
// const cheerio = require('cheerio');
import axios from 'axios';
import cheerio from 'cheerio';

const mainSitemapUrl = 'https://theparkprodigy.com/sitemap_index.xml';

const outputFilePath = 'urls.json';

async function scrapeWebsiteFromSitemap(url) {
  // try {
  
  console.log(url)
    const sitemapResponse = await axios.get(url);
    const sitemapXML = sitemapResponse.data;

    // Parse the sitemap XML to extract sub-sitemap URLs
    const $ = cheerio.load(sitemapXML, { xmlMode: true });
    const sitemapUrls = $('sitemap loc')
      .map((index, element) => $(element).text())
      .get();

    const scrapedUrls = [];

    // Scrape each sub-sitemap
    for (const sitemapUrl of sitemapUrls) {
      const subSitemapResponse = await axios.get(sitemapUrl);
      const subSitemapXML = subSitemapResponse.data;

      // Parse the sub-sitemap XML to extract URLs
      const $ = cheerio.load(subSitemapXML, { xmlMode: true });
      const urls = $('url loc')
        .map((index, element) => $(element).text())
        .get();

      console.log('URL:', urls);
      // console.log('Title:', title);

      // Store the URL in the scrapedUrls array
      scrapedUrls.push(urls);

      // for (const url of urls) {
      //   try {
      //     const response = await axios.get(url);
      //     const html = response.data;

      //     // Parse the HTML using cheerio and extract desired information
      //     const $ = cheerio.load(html);
      //     const bodyText = $('body').text().trim();
      //     console.log(bodyText);
      //     // Store the URL and extracted text in the scrapedUrls array
      //     scrapedUrls.push({ url, text: bodyText });
      //   } catch (error) {
      //     console.error('Error scraping URL:', url);
      //     console.error('Error message:', error.message);
      //   }
      // }
      //   }
    }

    // Save the scrapedUrls array to a JSON file
    // const jsonData = JSON.stringify(scrapedUrls, null, 2);
    // fs.writeFileSync(outputFilePath, jsonData);
    // console.log('URLs saved to', outputFilePath);
  // } catch (error) {
  //   console.error('Error:', error.message);
  // }
}

// scrapeWebsiteFromSitemap(mainSitemapUrl);

export { scrapeWebsiteFromSitemap };
