// import React from 'react';
// import { Container, Input, InputGroup, InputRightElement, Icon } from '@chakra-ui/react';
// import { FaSearch } from 'react-icons/fa';

// const SearchBar = () => {
//   return (
//     <Container display='flex' justifyContent='center' alignItems='center' height='100vh'>
//       <InputGroup maxW='lg' alignItems='center'>
//         <Input
//           type='text'
//           placeholder='Search...'
//           size='lg'
//           borderRadius='full'
//           fontSize='xl'
//           boxShadow='md'
//           _focus={{ borderColor: 'teal.500', boxShadow: 'outline' }}
//           _hover={{ borderColor: 'teal.300' }}
//           pr='4.5rem' // Padding-right to create space for the search icon
//         />
//         <InputRightElement width='4.5rem' pointerEvents='none'>
//           <Icon as={FaSearch} color='teal.400' fontSize='2xl' />
//         </InputRightElement>
//       </InputGroup>
//     </Container>
//   );
// };

// export default SearchBar;
import React from 'react';
import { Container, Input, InputGroup, InputRightElement, Icon, IconButton } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ handleOnSearch, handleClickOnSearch, loading = true, searchText }) => {
  return (
    <Container maxW='lg'>
      <InputGroup alignItems='center'>
        <Input
          type='text'
          placeholder='Search...'
          size='lg'
          borderRadius='full'
          fontSize='xl'
          background={'#ffff'}
          boxShadow='md'
          _focus={{ borderColor: 'teal.500', boxShadow: 'outline' }}
          _hover={{ borderColor: 'teal.300' }}
          isDisabled={loading}
          name='search'
          onChange={handleOnSearch}
        />
        <InputRightElement width='3.0rem' mt={1}>
          <IconButton
            borderRadius='full'
            cursor='pointer'
            onClick={() => handleClickOnSearch(searchText)}
            _hover={{ backgroundColor: 'teal.400' }}
            isLoading={loading}>
            <Icon as={FaSearch} color='teal.400' fontSize='2xl' _hover={{ color: '#fff' }} onClick={() => handleClickOnSearch(searchText)} />
          </IconButton>
        </InputRightElement>
      </InputGroup>
    </Container>
  );
};

export default SearchBar;
