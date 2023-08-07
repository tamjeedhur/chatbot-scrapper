import './App.css';
import { Box, Container } from '@chakra-ui/react';
import Table from './Table';
import SearchBar from './Searchbar';
import { scrapeWebsiteFromSitemap } from './WebScrapping/WebScrapping';
import { useState } from 'react';

function App() {
  const [loading, setLoading] = useState(false);
  const [searchText, setInputSearch] = useState('');

  const handleOnSearch = (e) => {
    setInputSearch(e.target.value);
  };

  const handleClickOnSearch = async (url) => {
    setLoading(true);
    const req = await scrapeWebsiteFromSitemap(url);
    setLoading(false);

    console.log(req);
  };

  return (
    <Box
      // bgGradient='linear(to right, #4FD1C5, #4361EE)'
      w='100%'
      h='100vh'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'>
      <SearchBar handleOnSearch={handleOnSearch} handleClickOnSearch={handleClickOnSearch} loading={loading} searchText={searchText} />
      <Table />
    </Box>
  );
}

export default App;
