import React, {Component} from 'react';
import './App.css';
import HeaderComponent from "./components/Header";
import styled from "styled-components";
import NavBar from "./components/NavBar";
import * as PropTypes from 'prop-types'

const NavBarContainer = styled(NavBar)`
  color: #ffffff;
`;

class App extends Component {
    render() {
        return (
            <div>
                <NavBarContainer auth={this.props.auth} history={this.props.history} {...this.props}/>
                <HeaderComponent {...this.props}/>
            </div>
        );
    }
}

App.propTypes = {
    auth: PropTypes.func.isRequired,
    history: PropTypes.func.isRequired
};

export default App;
