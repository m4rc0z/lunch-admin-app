import React from 'react';
import {Redirect, Route, Router, Switch} from 'react-router-dom';
import LandingComponent from './landing/LandingComponent';
import Auth from './Auth/Auth';
import history from './history';
import Callback from "./callback/Callback";
import styled, {injectGlobal} from "styled-components";
import NavBar from "./components/navigation/NavBar";
import {connect} from "react-redux";
import {showNotificationAction} from "./components/notification/redux/notificationActions";
import Restaurant from "./restaurant/Restaurant";
import RestaurantMenus from "./menu/RestaurantMenus";
import * as PropTypes from "prop-types";
import RestaurantInfo from "./restaurant/RestaurantInfo";
import Category from "./restaurant/categories/Category";

const StyledInnerContainer = styled.div`
  height: 100%;
  background-color: #e3e3e3;
  padding: 20px;
`;

const StyledRouteContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: #e3e3e3;
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
  }
  #root {
    height: 100%;
  }
`;

const auth = new Auth();

const handleAuthentication = ({location}) => {
    if (/access_token|id_token|error/.test(location.hash)) {
        auth.handleAuthentication();
    }
};

function MainRoutes() {
    return (
        <Router history={history}>
            <StyledMainRouteContainer>
                <Switch>
                    <Route exact path="/restaurants/categories" render={(props) => {
                        return (
                            auth.getIsAdmin()
                                ?
                                <StyledRouteContainer>
                                    <NavBar auth={auth} history={history} landingPage={"false"}/>
                                    <StyledInnerContainer>
                                        <Category auth={auth} {...props}/>
                                    </StyledInnerContainer>
                                </StyledRouteContainer>
                                :
                                <Redirect to={`/restaurants/${auth.getUserId()}`}/>
                        );
                    }}/>
                    <Route exact path="/restaurants" render={(props) => {
                        return (
                            auth.getIsAdmin()
                                ?
                                <StyledRouteContainer>
                                    <NavBar auth={auth} history={history} landingPage={"false"}/>
                                    <StyledInnerContainer>
                                        <Restaurant auth={auth} {...props}/>
                                    </StyledInnerContainer>
                                </StyledRouteContainer>
                                :
                                <Redirect to={`/restaurants/${auth.getUserId()}`}/>
                        );
                    }}/>
                    <Route exact path="/restaurants/:id" render={(props) => {
                        return (<StyledRouteContainer>
                                <NavBar auth={auth} history={history} landingPage={"false"}/>
                                <StyledInnerContainer>
                                    {
                                        props.match.params.id === auth.getUserId() || auth.getIsAdmin()
                                            ? <RestaurantMenus
                                                auth={auth} {...props}
                                                restaurantId={props.match.params.id}
                                                click={() => history.push(`/restaurants/${props.match.params.id}/edit`)}
                                            />
                                            : undefined
                                    }
                                </StyledInnerContainer>
                            </StyledRouteContainer>
                        );
                    }}/>
                    <Route exact path="/restaurants/:id/edit" render={(props) => {
                        return (<StyledRouteContainer>
                                <NavBar auth={auth} history={history} landingPage={"false"}/>
                                <StyledInnerContainer>
                                    {
                                        props.match.params.id === auth.getUserId() || auth.getIsAdmin()
                                            ? <RestaurantInfo auth={auth} {...props}
                                                               restaurantId={props.match.params.id}/>
                                            : undefined
                                    }
                                </StyledInnerContainer>
                            </StyledRouteContainer>
                        );
                    }}/>
                    <Route path="/callback" render={(props) => {
                        handleAuthentication(props);
                        return <Callback {...props} />;
                    }}/>
                    <Route render={() => {
                        return (
                            auth.isAuthenticated()
                                ?
                                auth.getIsAdmin()
                                    ?
                                    <Redirect to={`/restaurants`}/>
                                    :
                                    <Redirect to={`/restaurants/${auth.getUserId()}`}/>
                                :
                                <StyledRouteContainer>
                                    <NavBar auth={auth} history={history} landingPage={"true"}/>
                                    <StyledRouteContainer>
                                        <LandingComponent/>
                                    </StyledRouteContainer>
                                </StyledRouteContainer>
                        );
                    }}/>
                </Switch>
            </StyledMainRouteContainer>
        </Router>
    );
}

MainRoutes.propTypes = {
    match: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
    ...state,
    ...ownProps
});

const mapDispatchToProps = dispatch => ({
    showNotificationAction: (payload) => dispatch(showNotificationAction(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainRoutes);

