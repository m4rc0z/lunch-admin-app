import React from 'react';
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import styled from "styled-components";

const StyledCircularProgress = styled(CircularProgress)`
  color: red;
`;
function Callback() {
    return (
        <div>
            <StyledCircularProgress />
        </div>
    );
}

export default Callback;
