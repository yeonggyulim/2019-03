import styled, { css } from 'styled-components';

const SearchWrapper = styled.div`
  display: none;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 5px;
  width: 215px;
  height: 19px;
  padding: 7px 5px 5px 10px;
  position: relative;
  ${({ theme }) => {
    const borderColor = theme.palette.border;
    return css`
      border: 1px solid ${borderColor};
    `;
  }};
  @media screen and (min-width: 600px) {
    display: flex;
  }
`;

export default SearchWrapper;
