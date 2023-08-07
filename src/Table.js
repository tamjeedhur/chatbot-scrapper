import React, { useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Checkbox, IconButton, Skeleton, SkeletonText } from '@chakra-ui/react';
import { MdEdit, MdDelete, MdSwapHoriz } from 'react-icons/md';

const DataTable = ({ isLoading }) => {
  const data = [
    {
      id: 1,
      url: 'https://example.com/page1',
    },
    {
      id: 2,
      url: 'https://example.com/page2',
    },
    {
      id: 2,
      url: 'https://example.com/page2',
    },
    {
      id: 2,
      url: 'https://example.com/page2',
    },
    {
      id: 2,
      url: 'https://example.com/page2',
    },
    {
      id: 2,
      url: 'https://example.com/page2',
    },
    // Add more data as needed
  ];

  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedItems(data.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleCheckboxChange = (event, id) => {
    if (event.target.checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    }
  };

  return (
    <Table variant='simple' size='sm' width={'container.lg'} mt={20}>
      <Thead backgroundColor='gray.100' height={'50px'}>
        <Tr>
          <Th width='50px'>
            <Checkbox isChecked={selectAll} onChange={toggleSelectAll} />
          </Th>
          <Th>URL</Th>
          <Th textAlign={'center'}>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {isLoading ? (
          <>
            <Tr>
              <Td width='50px'>
                <Checkbox isChecked={false} isDisabled />
              </Td>
              <Td width={'80%'}>
                <SkeletonText mt='1' noOfLines={2} spacing='2' />
              </Td>
              <Td pl={0}>
                <IconButton icon={<MdEdit />} aria-label='Edit' mr={2} variant='ghost' isDisabled />
                <IconButton icon={<MdDelete />} aria-label='Delete' mr={2} variant='ghost' isDisabled />
                {/* <IconButton icon={<MdSwapHoriz />} aria-label='Switch' variant='ghost' isDisabled /> */}
              </Td>
            </Tr>
            <Tr>
              <Td width='50px'>
                <Checkbox isChecked={false} isDisabled />
              </Td>
              <Td width={'80%'}>
                <SkeletonText mt='1' noOfLines={2} spacing='2' />
              </Td>
              <Td width={'100%'}>
                <IconButton icon={<MdEdit />} aria-label='Edit' mr={2} variant='ghost' isDisabled />
                <IconButton icon={<MdDelete />} aria-label='Delete' mr={2} variant='ghost' isDisabled />
                {/* <IconButton icon={<MdSwapHoriz />} aria-label='Switch' variant='ghost' isDisabled /> */}
              </Td>
            </Tr>
          </>
        ) : data.length === 0 ? (
          <Tr>
            <Td colSpan={3}>No data found.</Td>
          </Tr>
        ) : (
          data.map((item) => (
            <Tr key={item.id}>
              <Td width='50px'>
                <Checkbox isChecked={selectedItems.includes(item.id)} onChange={(e) => handleCheckboxChange(e, item.id)} />
              </Td>
              <Td width={'75%'}>{item.url}</Td>
              <Td width={'400px'}>
                <IconButton icon={<MdEdit />} aria-label='Edit' mr={2} variant='ghost' />
                <IconButton icon={<MdDelete />} aria-label='Delete' mr={2} variant='ghost' />
                <IconButton icon={<MdSwapHoriz />} aria-label='Switch' variant='ghost' />
              </Td>
            </Tr>
          ))
        )}
      </Tbody>
    </Table>
  );
};

export default DataTable;
