import React, { useState, useEffect } from "react";
import {
  Table,
  Flex,
  Thead,
  Tbody,
  Button,
  Spinner,
  Tr,
  Th,
  Td,
  Checkbox,
  IconButton,
  SkeletonText,
  Box,
  Popover,
  PopoverArrow,
  PopoverTrigger,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverContent,
  ButtonGroup,
} from "@chakra-ui/react";
import { MdEdit, MdDelete, MdSwapHoriz, MdMoreVert } from "react-icons/md";
import axios from "axios";

const generateInitialData = (urls) => {
  return urls.map((url) => ({ url, isLoading: false }));
};

const DataTable = ({ isLoading, scrapedUrls }) => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showMoreIcon, setShowMoreIcon] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [data, setData] = useState([]);

  // console.log(data);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const toggleSelectAll = () => {
    if (!selectAll) {
      setSelectedItems(data.slice());
    } else {
      setSelectedItems([]);
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (event, url) => {
    if (event.target.checked) {
      setSelectedItems([...selectedItems, url]);
    } else {
      setSelectedItems(
        selectedItems.filter((selectedUrl) => selectedUrl !== url)
      );
    }
  };

  const handleNextPage = () => {
    setCurrentPage(Math.min(currentPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };

  useEffect(() => {
    console.log("Selected URLs:", selectedItems);
  }, [selectedItems]);

  useEffect(() => {
    const initialData = generateInitialData(scrapedUrls);
    setData(initialData);
    // console.log(initialData);
  }, [scrapedUrls]);

  useEffect(() => {
    const handleResize = () => {
      setShowMoreIcon(window.innerWidth < 700);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // const handleScrapClick = async () => {
  //   // Create a copy of the data array to avoid directly modifying state
  //   const updatedData = [...data];

  //   for (const selectedUrl of selectedItems) {
  //     const dataIndex = updatedData.findIndex(
  //       (item) => item.url === selectedUrl
  //     );
  //     if (dataIndex !== -1) {
  //       updatedData[dataIndex].isLoading = true;
  //       console.log("Setting isLoading to true for", updatedData);
  //     }
  //   }

  //   // Update the state with the modified data array
  //   setData(updatedData);
  // };



  const handleScrapClick = async () => {
    // Create a copy of the data array to avoid directly modifying state
    const updatedData = [...data];
  
    // Set isLoading to true for selected URLs
    for (const selectedUrl of selectedItems) {
      const dataIndex = updatedData.findIndex(
        (item) => item.url === selectedUrl.url
      );
      if (dataIndex !== -1) {
        updatedData[dataIndex].isLoading = true;
      }
    }
  
    // Update the state with the modified data array to show loading spinners
    setData(updatedData);
  
    try {
      const selectedUrls = selectedItems.map(item => item.url);
  
      // Make the API request to trigger scraping
      const response = await axios.post("http://localhost:3003/api/scrap", {
        urls: selectedUrls
      });
  
      // Handle the response from the API
      console.log(response.data);
  
      // Update the state with the scraped data and remove loading spinners
      const newData = updatedData.map(item => {
        if (selectedUrls.includes(item.url)) {
          return { ...item, isLoading: false, scrapedData: response.data };
        }
        return item;
      });
  
      setData(newData);
    } catch (error) {
      console.error("Error scraping URLs:", error);
      // Handle the error if needed
  
      // Reset isLoading to false for the URLs that had loading spinners
      const newData = updatedData.map(item => {
        if (selectedItems.includes(item.url)) {
          return { ...item, isLoading: false };
        }
        return item;
      });
  
      setData(newData);
      // console.log(newData)
    }
  };

  

  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center">
      <Box
        width="90%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Flex width="100%" height="100%" mt={20} justifyContent="flex-end">
          <Flex textAlign="right" mr={12}>
            <Button onClick={handleScrapClick} colorScheme="blue">
              scrap
            </Button>
          </Flex>
        </Flex>
        <Table variant="simple" size="sm" width="100%" mt={2}>
          <Thead backgroundColor="gray.100" height={"50px"}>
            <Tr>
              <Th width="50px">
                <Checkbox isChecked={selectAll} onChange={toggleSelectAll} />
              </Th>
              <Th>URL</Th>
              <Th paddingLeft="0px" textAlign={"center"}>
                Actions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <>
                <Tr>
                  <Td width="50px">
                    <Checkbox isChecked={false} isDisabled />
                  </Td>
                  <Td width={"80%"}>
                    <SkeletonText mt="1" noOfLines={2} spacing="2" />
                  </Td>
                  <Td pl={0}>
                    <IconButton
                      icon={<MdEdit />}
                      aria-label="Edit"
                      mr={2}
                      variant="ghost"
                      isDisabled
                    />
                    <IconButton
                      icon={<MdDelete />}
                      aria-label="Delete"
                      mr={2}
                      variant="ghost"
                      isDisabled
                    />
                  </Td>
                </Tr>
                {/* Add more loading skeleton rows as needed */}
              </>
            ) : currentItems.length === 0 ? (
              <Tr>
                <Td colSpan={3}>No data found.</Td>
              </Tr>
            ) : (
              currentItems.map((url, index) => (
                <Tr
                  key={index}
                  backgroundColor={
                    selectedItems.includes(url.url) ? "gray.200" : "white"
                  }
                >
                  <Td width="50px">
                    <Checkbox
                      isChecked={selectedItems.includes(url.url)}
                      onChange={(e) => handleCheckboxChange(e, url.url)}
                    />
                  </Td>
                  <Td width={"75%"}>{url.url}</Td>
                  <Td
                    width={"100%"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    paddingLeft="0px"
                    paddingRight="0px"
                  >
                    {showMoreIcon ? (
                      <Popover>
                        <PopoverTrigger>
                          <IconButton
                            padding="0px"
                            icon={<MdMoreVert />}
                            aria-label="More"
                            variant="ghost"
                          />
                        </PopoverTrigger>
                        <PopoverContent width="170px">
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader backgroundColor="gray.100">
                            Actions
                          </PopoverHeader>
                          <PopoverBody>
                            <IconButton
                              icon={<MdEdit />}
                              aria-label="Edit"
                              mr={2}
                              variant="ghost"
                            />
                            <IconButton
                              icon={<MdDelete />}
                              aria-label="Delete"
                              mr={2}
                              variant="ghost"
                            />
                            <IconButton
                              icon={<MdSwapHoriz />}
                              aria-label="Switch"
                              variant="ghost"
                            />
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    ) : url.isLoading ? (
                      <Box mt="10px" mb="11px">
                        <Spinner size="sm" />
                      </Box>
                    ) : (
                      <>
                        <IconButton
                          icon={<MdEdit />}
                          aria-label="Edit"
                          mr={2}
                          variant="ghost"
                        />
                        <IconButton
                          icon={<MdDelete />}
                          aria-label="Delete"
                          mr={2}
                          variant="ghost"
                        />
                        <IconButton
                          icon={<MdSwapHoriz />}
                          aria-label="Switch"
                          variant="ghost"
                        />
                      </>
                    )}
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      <Box mt={4} display="flex" alignItems="center">
        <ButtonGroup variant="outline" spacing={2}>
          <Button onClick={handlePrevPage} disabled={currentPage === 1}>
            &lt;
          </Button>
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            if (
              (pageNumber >= currentPage - 2 &&
                pageNumber <= currentPage + 1) ||
              (currentPage <= 3 && pageNumber <= 4) ||
              (currentPage >= totalPages - 1 && pageNumber >= totalPages - 3)
            ) {
              return (
                <Button
                  key={pageNumber}
                  isActive={currentPage === pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            }
            return null;
          })}
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            &gt;
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};

export default DataTable;
