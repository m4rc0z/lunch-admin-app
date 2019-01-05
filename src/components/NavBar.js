import React, {Component} from 'react';
import {AppBar, Toolbar, Typography} from '@material-ui/core';
import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import LoginIcon from "@material-ui/icons/ExitToApp";
import LogoutIcon from "@material-ui/icons/PowerSettingsNew";
import Button from "@material-ui/core/Button/Button";
import * as PropTypes from "prop-types";
import {REACT_APP_MOCK} from "../config";

const StyledNavBar = styled(AppBar)`
    display: flex;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1030;
    
    && {
      background-color: transparent;
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
    goTo(route) {
        this.props.history.replace(` /${route}`)
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
        const {renewSession} = this.props.auth;

        if (localStorage.getItem('isLoggedIn') === 'true') {
            renewSession();
        }
    }

    render() {
        const {isAuthenticated} = this.props.auth;

        return (
            <div>
                <StyledNavBar>
                    <Toolbar>
                        <StyledIconButton aria-label="Menu">
                            <MenuIcon/>
                        </StyledIconButton>
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
                <Button
                    onClick={this.goTo.bind(this, 'home')}
                    data-cy="homeBtn"
                >
                    Home
                </Button>
            </div>
        );
    }
}

NavBar.propTypes = {
    auth: PropTypes.func.isRequired,
    history: PropTypes.func.isRequired
};

export default NavBar;
