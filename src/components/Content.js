import React from "react";
import styled from "styled-components";

const StyledContentContainer = styled.div`
  background-color: white;
  padding: 20px;
  margin: -60px 30px 0;
  border-radius: 6px;
  box-shadow: 
    0 16px 24px 2px rgba(0, 0, 0, 0.14), 
    0 6px 30px 5px rgba(0, 0, 0, 0.12), 
    0 8px 10px -5px rgba(0, 0, 0, 0.2)
`;

function ContentComponent() {
    return (
        <StyledContentContainer>
            <p>This is my initial content</p>
            <p>Here will be some text for the landingpage</p>
            <p>Here will be more text for the landingpage</p>
        </StyledContentContainer>
    );
}

export default ContentComponent;