import "./App.css";
import { Box, Flex } from "@chakra-ui/react";
import Table from "./Table";
import SearchBar from "./Searchbar";
import { useState } from "react";
import axios from "axios";

function App() {
  const [loading, setLoading] = useState(false);
  const [searchText, setInputSearch] = useState("");
  const [scrapedUrls, setScrapedUrls] = useState([]);

  const handleOnSearch = (e) => {
    setInputSearch(e.target.value);
  };


  const handleClickOnSearch = async () => {
    setLoading(true);
    try {
      const backendApiUrl = await axios.post(
        "http://localhost:3003/api/proxy",
        { url: searchText }
      ); // Adjust the backend server URL as needed
      // const urls = await scrapeAndParseSitemap(searchText, backendApiUrl);

      setScrapedUrls(backendApiUrl.data[0]);
      console.log(backendApiUrl);
    } catch (error) {
      console.error("Error scraping URLs:", error);
    }
    setLoading(false);
  };

  return (
    <Box
      w="100%"
      h="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Flex mt="50px" width="100%">
        <SearchBar
          handleOnSearch={handleOnSearch}
          handleClickOnSearch={handleClickOnSearch}
          loading={loading}
          searchText={searchText}
        />
      </Flex>
      <Table scrapedUrls={scrapedUrls} isLoading={loading} />{" "}
    </Box>
  );
}

export default App;
