import React from "react";
import styled from "styled-components";
import backgroundImg from '../assets/img/restaurant_background_bw.jpg';

const HeaderContainer = styled.div`
  height: 100vh;
  background-image: url(${backgroundImg});
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
`;
function HeaderComponent() {
    return (
        <HeaderContainer/>
    );
}

export default HeaderComponent;