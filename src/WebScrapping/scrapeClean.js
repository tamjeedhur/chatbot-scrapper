// const fs = require('fs');

// const rawData = fs.readFileSync('urls.json');
// const scrapedUrls = JSON.parse(rawData);

// // Scrape the first 5 URLs from the array
// const urlsToScrape = scrapedUrls.slice(0, 1);

// // Scrape each URL
// urlsToScrape.forEach(({ urls }) => {
//   // Perform scraping operations on each URL
//   console.log('Scraping URL:', urls);
//     // Add your scraping logic here for each URL

// });
// const HTMLPartToTextPart = (HTMLPart) =>
//   HTMLPart.replace(/\n/gi, '')
//     .replace(/<style[^>]*>[\s\S]*?<\/style[^>]*>/gi, '')
//     .replace(/<head[^>]*>[\s\S]*?<\/head[^>]*>/gi, '')
//     .replace(/<script[^>]*>[\s\S]*?<\/script[^>]*>/gi, '')
//     .replace(/<\/\s*(?:p|div)>/gi, '\n')
//     .replace(/<br[^>]*\/?>/gi, '\n')
//     .replace(/<[^>]*>/gi, '')
//     .replace('&nbsp;', ' ')
//     .replace(/[^\S\r\n][^\S\r\n]+/gi, ' ');

// const fs = require('fs');
// const axios = require('axios');
// const cheerio = require('cheerio');

// const inputFilePath = 'urls.json';

// async function scrapeUrlsFromFile(filePath) {
//     try {
//         // Read the JSON file
//         const jsonData = fs.readFileSync(filePath, 'utf8');
//         const urls = JSON.parse(jsonData);

//         const scrapedData = [];

//         // Scrape only one URL from each individual sitemap
//         for (const url of urls) {
//             const { data: sitemapXml } = await axios.get(url);
//             const $ = cheerio.load(sitemapXml, { xmlMode: true });

//             // Extract the first URL from the individual sitemap
//             const url = $('url loc').first().text();

//             // Scrape data from the URL
//             const { data: webpageHtml } = await axios.get(url);
//             const $$ = cheerio.load(webpageHtml);

//             // const contentText = $$.text();

//             // Exclude header and footer elements
//             //   $$('.header-selector').remove();
//             //   $$('.footer-selector').remove();

//             // Get the remaining text content
//             //   const contentText = $$.text();

//             const contentHtml = $$.html();

//             const contentText = htmlToText(contentHtml);

//             // Create a JSON object with the scraped data
//             const scrapedDataItem = {
//                 url: url,
//                 contentText: contentText,
//             };

//             // Add the scraped data to the array
//             scrapedData.push(scrapedDataItem);

//             //   console.log(scrapedD);

//             console.log('Scraped data:', scrapedData);

//         }
//     }

//          catch (error) {
//             console.error('Error reading JSON file:', error.message);
//         }

// }

// scrapeUrlsFromFile(inputFilePath);

const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const cleanHtml = (html) => {
  console.log('HTML to replace');
  console.log(typeof html);
  return new Promise(async (resolve) => {
    if (typeof html !== 'string') {
      console.log(html);
      console.log('ERROR:');
      console.log(text);
      resolve('');
    }
    const cleanText = html
      .replace(/<script\b[^>]>[\s\S]?<\/script>/gi, '')
      .replace(/<noscript\b[^>]>[\s\S]?<\/noscript>/gi, '')
      .replace(/<style\b[^>]>[\s\S]?<\/style>/gi, '')
      .replace(/<iframe\b[^>]>[\s\S]?<\/iframe>/gi, '')
      .replace(/<svg\b[^>]>[\s\S]?<\/svg>/gi, '')
    //   .replace(/<img\b[^>]*>/gi, '')

      .replace(/<link\b[^>]*>/gi, '')

      .replace(/\n|\t/g, '')
    //   .replace(/ +/g, ' ')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/\$\([^<]*\)/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    const dom = new JSDOM(cleanText);
    const { document } = dom.window;

    // // Remove inline CSS styles from all elements within the 'body'
    const bodyElements = document.querySelectorAll('body *');
    bodyElements.forEach((element) => {
      element.removeAttribute('style');
    });

    // Get the modified HTML
    const modifiedHtml = document.documentElement.outerHTML;

    // Load the modified HTML using Cheerio

    const $ = cheerio.load(modifiedHtml);

    // Find all the text within the HTML
    const text = $('body')
      .text()
      .replace(/\s{2,}/g, ' ');

    resolve(text);
  });
};
// Read the JSON file
fs.readFile('urls.json', 'utf8', async (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  try {
    // Parse the JSON data
    const jsonData = JSON.parse(data);
    console.log(jsonData[0]);
    // Create an array to store the scraped data
    const scrapedData = [];

    // Iterate over each object in the array
    for (const object of [jsonData[0]]) {
      try {
        // Extract the URLs from the current object
        const urls = object.urls;

        // Scrape data from each URL
        for (const url of urls.slice(0, 2)) {
          try {
            // Make an HTTP GET request to the URL
            const response = await axios.get(url);

            // Load the HTML content using Cheerio
            // const $ = cheerio.load(response.data);

            // Extract the desired data from the HTML
            //   const textContent = $('body').text();

            // Add the object to the scrapedData array
            scrapedData.push({
              url: url,
              contentHtml: await cleanHtml(response.data),
            });

            console.log(scrapedData);
          } catch (error) {
            s;
            console.error('Error scraping data from URL:', url, error);
          }
        }
      } catch (error) {
        console.error('Error processing object:', object, error);
      }
    }

    // Write the scraped data to a JSON file

    const outputFile = 'scrapedData.json';
    fs.writeFile(outputFile, JSON.stringify(scrapedData, null, 2), (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
      } else {
        console.log('Scraped data saved to', outputFile);
      }
    });
  } catch (err) {
    console.error('Error parsing JSON:', err);
  }
});
