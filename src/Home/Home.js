import React, {Component} from 'react';
import styled from "styled-components";
import * as PropTypes from "prop-types";
import Menus from "../menu/Menus";

const StyledHomeContainer = styled.div`
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

    render() {
        const {isAuthenticated} = this.props.auth;
        return (
            <StyledHomeContainer className="container">
                <Menus auth={this.props.auth} isAuthenticated={isAuthenticated()}/>
                {
                    isAuthenticated() && (
                        <h4 data-cy={`responseText`}>
                            You are logged in!
                        </h4>
                    )
                }
                {
                    !isAuthenticated() && (
                        <h4 data-cy={`responseText`}>
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
            </StyledHomeContainer>
        );
    }
}


Home.propTypes = {
    auth: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

export default Home;
