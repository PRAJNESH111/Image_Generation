import React from 'react';
import styled from 'styled-components';
import { SearchOutlined } from '@mui/icons-material';

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
 color: ${({ theme }) => theme.text_primary};
  background-color: ${({ theme }) => theme.bgLight || "#f0f0f0"};
  padding: 12px 16px;
  border-radius: 10px;
  gap: 10px;
  width: 100%;
  max-width: 550px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

// const SearchInput = styled.input`
//   border: none;
//   background: transparent;
//   outline: none;
//   font-size: 16px;
//   color: ${({ theme }) => theme.text_primary || "#000"};

//   &::placeholder {
//     color: ${({ theme }) => theme.text_secondary || "#888"};
//   }
// `;

const SearchBar = () => {
  return (
    <SearchBarContainer>
      <SearchOutlined />
      <input style={{
        border: 'none',
        background: 'transparent',
        outline: 'none',
        fontSize: '16px',
        color: 'inherit',
        width: '100%'
      }}  placeholder='Search With Prompt or Name ...' />
    </SearchBarContainer>
  );
};

export default SearchBar;
