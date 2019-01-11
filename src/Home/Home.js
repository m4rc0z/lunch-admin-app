import React, {Component} from 'react';
import styled from "styled-components";
import * as PropTypes from "prop-types";

const StyledHomeContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: lightgray;
  padding: 20px;
`;

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {response: undefined};
    }

    login() {
        this.props.auth.login();
    }

    componentDidMount() {
        let fetchPromise;
        if (!this.props.auth.getAccessToken()) {
            fetchPromise = fetch(`/api/public`);
        } else {
            fetchPromise = fetch('/api/private', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${this.props.auth.getAccessToken()}`
                }
            });
        }

        fetchPromise
            .then(res => res.json())
            .then(res => {
                this.setState({response: res});
            });
    }

    render() {
        const {isAuthenticated} = this.props.auth;
        return (
            <StyledHomeContainer className="container">
                {
                    isAuthenticated() && (
                        <h4>
                            You are logged in!
                        </h4>
                    )
                }
                {
                    !isAuthenticated() && (
                        <h4>
                            You are not logged in! Please{' '}
                            <a
                                style={{cursor: 'pointer'}}
                                onClick={this.login.bind(this)}
                            >
                                Log In
                            </a>
                            {' '}to continue.
                        </h4>
                    )
                }
                <div>
                    response:
                    <pre data-cy="responseText">{JSON.stringify(this.state.response)}</pre>
                </div>
            </StyledHomeContainer>
        );
    }
}


Home.propTypes = {
    auth: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

export default Home;
