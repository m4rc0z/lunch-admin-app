import React, {Component} from 'react';
import styled from "styled-components";
import * as PropTypes from "prop-types";

const StyledHomeContainer = styled.div`
  background-color: white;
  padding: 20px;
  margin: -60px 30px 0;
  border-radius: 6px;
  box-shadow: 
    0 16px 24px 2px rgba(0, 0, 0, 0.14), 
    0 6px 30px 5px rgba(0, 0, 0, 0.12), 
    0 8px 10px -5px rgba(0, 0, 0, 0.2)
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
