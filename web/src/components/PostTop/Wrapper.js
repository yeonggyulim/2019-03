import React from 'react';
import styled, { css } from 'styled-components';

const Wrapper = styled.header`
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-sizing: border-box;
  ${props => {
    const borderColor = props.theme.palette.border;
    return css`
      border: 1px solid ${borderColor};
    `;
  }}
  .user {
    display: flex;
    flex-direction: row;
    .username {
      margin-left: 10px;
    }
  }
  .more {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

export default Wrapper;
