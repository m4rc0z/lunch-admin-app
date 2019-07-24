import styled, {injectGlobal} from "styled-components";

export const globalStyle = injectGlobal`
  html, body {
    height: 100%;
    width: 100%;
  }
  #root {
    height: 100%;
    width: 100%;
  }
`;

export const StyledPaddingContainer = styled.div`
  padding: 10px 0;
`;
