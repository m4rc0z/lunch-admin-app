import React, {Component} from 'react';
import {Navbar, Button} from 'react-bootstrap';

class NavBar extends Component {
    goTo(route) {
        this.props.history.replace(`/${route}`)
    }

    login() {
        if (process.env.REACT_APP_MOCK) {
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
                <Navbar fluid>
                    <Navbar.Header>
                        <Button
                            bsStyle="primary"
                            className="btn-margin"
                            onClick={this.goTo.bind(this, 'home')}
                            data-cy="homeBtn"
                        >
                            Home
                        </Button>
                        {
                            !isAuthenticated() && (
                                <Button
                                    id="qsLoginBtn"
                                    bsStyle="primary"
                                    className="btn-margin"
                                    onClick={this.login.bind(this)}
                                    data-cy="loginBtn"
                                >
                                    Log In
                                </Button>
                            )
                        }
                        {
                            isAuthenticated() && (
                                <Button
                                    id="qsLogoutBtn"
                                    bsStyle="primary"
                                    className="btn-margin"
                                    onClick={this.logout.bind(this)}
                                    data-cy="logoutBtn"
                                >
                                    Log Out
                                </Button>
                            )
                        }
                    </Navbar.Header>
                </Navbar>
            </div>
        );
    }
}

export default NavBar;
