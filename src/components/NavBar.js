import React, {Component} from 'react';
import {AppBar, Toolbar, Typography} from '@material-ui/core';
import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton/IconButton";
import LoginIcon from "@material-ui/icons/ExitToApp";
import LogoutIcon from "@material-ui/icons/PowerSettingsNew";
import * as PropTypes from "prop-types";
import {REACT_APP_MOCK} from "../config";
import SideNavigation from "./SideNavigation";
import {setAuthTokenAction, setIsAdminAction} from "../Auth/redux/authActions";
import connect from "react-redux/es/connect/connect";

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
        this.state = { scrolledDown: 'false', isAuthenticated: false, };
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.setState({ scrolledDown: 'true' })
        } else {
            this.setState({ scrolledDown: 'false' })
        }
    }

    goTo(route) {
        this.props.history.push(`/${route}`)
    }

    login() {
        if (REACT_APP_MOCK) {
            this.mockLogin();
        } else {
            this.props.auth.login();
        }
        this.setState({ isAuthenticated: this.props.auth.isAuthenticated() })
    }

    mockLogin() {
        const mockAuthResult = {
            expiresIn: 10000,
            accessToken: 'dummyToken',
            idToken: 'dummyIdToken',
            idTokenPayload: {
                sub: 'testSub'
            }
        };
        this.props.auth.setSession(mockAuthResult);
    }

    logout() {
        this.props.auth.logout();
        this.props.setAuthTokenAction(undefined);
        this.setState({ isAuthenticated: this.props.auth.isAuthenticated() })
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        const {renewSession} = this.props.auth;

        if (localStorage.getItem('isLoggedIn') === 'true') {
            renewSession();
            this.props.setAuthTokenAction(this.props.auth.getAccessToken());
            this.props.setIsAdminAction(this.props.auth.getIsAdmin());
        }
    }

    render() {

        return (
            <div>
                <StyledNavBar scrolleddown={this.state.scrolledDown} landingpage={this.props.landingPage}>
                    <Toolbar>
                        <SideNavigation isAdmin={this.props.isAdmin} click={(route) => this.goTo(route)}/>
                        <PageName>
                            Lunch Restaurant App
                        </PageName>
                        {
                            !this.props.auth.isAuthenticated() && (
                                <StyledIconButton
                                    onClick={() => this.login()}
                                    data-cy="loginBtn"
                                >
                                    <LoginIcon/>
                                </StyledIconButton>
                            )
                        }
                        {
                            this.props.auth.isAuthenticated() && (
                                <StyledIconButton
                                    onClick={() => this.logout()}
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
    landingPage: PropTypes.string,
    setAuthTokenAction: PropTypes.func,
    setIsAdminAction: PropTypes.func,
    isAdmin: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    return ({
        isAdmin: state.auth.isAdmin,
        ...ownProps
    });
};

const mapDispatchToProps = dispatch => ({
    setAuthTokenAction: (payload) => dispatch(setAuthTokenAction(payload)),
    setIsAdminAction: (isAdmin) => dispatch(setIsAdminAction(isAdmin)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);