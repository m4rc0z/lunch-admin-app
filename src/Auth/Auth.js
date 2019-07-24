import history from '../history';
import auth0 from 'auth0-js';
import {AUTH_CONFIG} from "./auth0-variables";
import {REACT_APP_MOCK} from "../config";

export default class Auth {
    auth0 = new auth0.WebAuth({
        domain: AUTH_CONFIG.domain,
        clientID: AUTH_CONFIG.clientId,
        redirectUri: AUTH_CONFIG.callbackUrl,
        audience: AUTH_CONFIG.audience,
        responseType: 'token id_token',
        scope: 'openid'
    });

    constructor() {
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.getAccessToken = this.getAccessToken.bind(this);
        this.renewSession = this.renewSession.bind(this);
    }

    login() {
        this.auth0.authorize();
    }

    handleAuthentication() {
        const that = this;
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                that.getProfile(authResult);
            } else if (err) {
                history.replace('/');
                console.log(err);
                alert(`Error: ${err.error}. Check the console for further details.`);
            }
        });
    }

    getAccessToken() {
        return localStorage.getItem('access_token');
    }

    getIsAdmin() {
        return Boolean(JSON.parse(localStorage.getItem('isAdmin'))) || false;
    }

    getUserId() {
        return localStorage.getItem('userId');
    }

    getProfile(authResult) {
        this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
            if (profile) {
                this.setSession(authResult, profile);
            } else if (err) {
                console.warn(`Error retrieving profile ${err.error}`);
            }
        });
    }

    checkIsAdmin(profile) {
        const roles = profile['https://example.com/roles'] || [];
        return roles.indexOf('admin') > -1;
    }

    setSession(authResult, profile) {
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        const userId = authResult.idTokenPayload.sub;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
        localStorage.setItem('userId', userId);
        let isAdmin;
        if (profile) {
            isAdmin = this.checkIsAdmin(profile);
            localStorage.setItem('isAdmin', isAdmin);
        }
        if (isAdmin) {
            history.push('/restaurants');
        } else {
            history.push(`/restaurants/${userId}`);
        }
    }

    renewSession() {
        this.auth0.checkSession({}, (err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
            } else if (err) {
                if (!REACT_APP_MOCK) {
                    this.logout();
                    console.log(err);
                    // TODO: adapt for real popup message
                    alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
                }
            }
        });
    }

    logout() {
        // Clear access token and ID token from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        // Remove isLoggedIn flag from localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userId');

        // navigate to the home route
        history.replace('/');
    }

    isAuthenticated() {
        // Check whether the current time is past the
        // access token's expiry time
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }
}
