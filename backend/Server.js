const {
  scrapeWebsiteFromSitemap,
} = require("../src/WebScrapping/WebScrapping");
const { scrapeSitemap } = require("../src/WebScrapping/Scrapper");
const express = require("express");
const cors = require("cors"); // Import the cors package
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());

app.use(express.json());

// Use the cors middleware to allow requests from any origin

app.post("/api/proxy", async (req, res) => {
  try {
    const { url } = req.body;
    const response = await scrapeWebsiteFromSitemap(url);
    console.log(response);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// app.post("/api/scrap", async (req, res) => {
//   try {
//     const { urls } = req.body;
//     const scrapedData = await scrapeUrls(urls);
//     res.json(scrapedData);
//   } catch (error) {
//     res.status(500).json({ error: "Error scraping selected URLs" });
//   }
// });

// async function scrapeUrls(urls) {
//   const scrapedResults = [];

//   for (const url of urls) {
//     try {
//       const scrapedData = await scrapeSitemap(url);
//       scrapedResults.push(scrapedData);
//     } catch (error) {
//       console.error("Error scraping URL:", url);
//       console.error("Error message:", error.message);
//       scrapedResults.push({ error: `Error scraping URL: ${url}` });
//     }
//   }

//   return scrapedResults;
// }

app.post("/api/scrap", async (req, res) => {
  try {
    const { urls } = req.body;
    const scrapedData = await scrapeUrlsConcurrent(urls);
    res.json(scrapedData);
  } catch (error) {
    res.status(500).json({ error: "Error scraping selected URLs" });
  }
});

async function scrapeUrlsConcurrent(urls) {
  try {
    // Use Promise.all to concurrently scrape all URLs
    const scrapePromises = urls.map(async (url) => {
      try {
        const scrapedData = await scrapeSitemap(url);
        return scrapedData;
      } catch (error) {
        console.error("Error scraping URL:", url);
        console.error("Error message:", error.message);
        return { error: `Error scraping URL: ${url}` };
      }
    });

    // Wait for all promises to resolve (or reject)
    const scrapedResults = await Promise.all(scrapePromises);

    return scrapedResults;
  } catch (error) {
    console.error("Error in scrapeUrlsConcurrent:", error);
    return [];
  }
}
