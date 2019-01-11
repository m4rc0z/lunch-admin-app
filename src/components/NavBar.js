import React, {Component} from 'react';
import {AppBar, Toolbar, Typography} from '@material-ui/core';
import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton/IconButton";
import LoginIcon from "@material-ui/icons/ExitToApp";
import LogoutIcon from "@material-ui/icons/PowerSettingsNew";
import * as PropTypes from "prop-types";
import {REACT_APP_MOCK} from "../config";
import SideNavigation from "./SideNavigation";

const StyledNavBar = styled(AppBar)`
    top: 0;
    
    && {
      background-color: ${(props) => props.scrolleddown === 'true' || props.landingpage === 'false' ? 'white' : 'transparent'};
      color: ${(props) => props.scrolleddown === 'true' || props.landingpage === 'false'  ? 'black' : undefined};
      transition: all 250ms ease-in;
      position: ${(props) => props.landingpage === 'true' ? 'fixed' : 'sticky'};
    }
`;

const PageName = styled(Typography)`
  flex: 1;
  && {
    color: inherit;
  }
`;

const StyledIconButton = styled(IconButton)`
  && {
   color: inherit; 
  }
`;

class NavBar extends Component {

    constructor(props) {
        super(props);
        this.state = { scrolledDown: 'false' };
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.setState({ scrolledDown: 'true' })
        } else {
            this.setState({ scrolledDown: 'false' })
        }
    }

    goTo(route) {
        this.props.history.replace(`/${route}`)
    }

    login() {
        if (REACT_APP_MOCK) {
            this.mockLogin();
        } else {
            this.props.auth.login();
        }
    }

    mockLogin() {
        const mockAuthResult = {
            expiresIn: 10000,
            accessToken: 'dummyToken',
            idToken: 'dummyIdToken',
        };
        this.props.auth.setSession(mockAuthResult);
    }

    logout() {
        this.props.auth.logout();
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        const {renewSession} = this.props.auth;

        if (localStorage.getItem('isLoggedIn') === 'true') {
            renewSession();
        }
    }

    render() {
        const {isAuthenticated} = this.props.auth;

        return (
            <div>
                <StyledNavBar scrolleddown={this.state.scrolledDown} landingpage={this.props.landingPage}>
                    <Toolbar>
                        <SideNavigation clickHome={() => this.goTo( 'home')}/>
                        <PageName>
                            Lunch Restaurant App
                        </PageName>
                        {
                            !isAuthenticated() && (
                                <StyledIconButton
                                    onClick={this.login.bind(this)}
                                    data-cy="loginBtn"
                                >
                                    <LoginIcon/>
                                </StyledIconButton>
                            )
                        }
                        {
                            isAuthenticated() && (
                                <StyledIconButton
                                    onClick={this.logout.bind(this)}
                                    data-cy="logoutBtn"
                                >
                                    <LogoutIcon/>
                                </StyledIconButton>
                            )
                        }
                    </Toolbar>
                </StyledNavBar>
            </div>
        );
    }
}

NavBar.propTypes = {
    auth: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    landingPage: PropTypes.string
};

export default NavBar;
