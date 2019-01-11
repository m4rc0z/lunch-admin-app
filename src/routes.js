import React from 'react';
import {Route, Router, Switch} from 'react-router-dom';
import App from './App';
import Auth from './Auth/Auth';
import history from './history';
import Callback from "./callback/Callback";
import Home from "./Home/Home";
import styled, {injectGlobal} from "styled-components";
import NavBar from "./components/NavBar";

const StyledRouteContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const StyledMainRouteContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;


injectGlobal`
  html, body {
    height: 100%;
    width: 100%;
  }
  #root {
    height: 100%;
    width: 100%;
  }
`;

const auth = new Auth();

const handleAuthentication = ({location}) => {
    if (/access_token|id_token|error/.test(location.hash)) {
        auth.handleAuthentication();
    }
};

export const makeMainRoutes = () => {
    return (
        <Router history={history}>
            <StyledMainRouteContainer>
                <Switch>
                    <Route exact={true} path="/" render={() => {
                            return (
                                <StyledRouteContainer>
                                    <NavBar auth={auth} history={history} landingPage={"true"}/>
                                    <StyledRouteContainer><App/></StyledRouteContainer>
                                </StyledRouteContainer>
                            );
                    }}/>
                    <Route path="/home" render={(props) => {
                        return (
                            <StyledRouteContainer>
                                <NavBar auth={auth} history={history} landingPage={"false"}/>
                                <StyledRouteContainer><Home auth={auth} {...props} /></StyledRouteContainer>
                            </StyledRouteContainer>
                        );
                    }}/>
                    <Route path="/callback" render={(props) => {
                        handleAuthentication(props);
                        return <Callback {...props} />;
                    }}/>
                </Switch>
            </StyledMainRouteContainer>
        </Router>
    );
};
