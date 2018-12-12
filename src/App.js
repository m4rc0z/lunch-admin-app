import React, {Component} from 'react';
import './App.css';
import logo from './logo.svg';
import NavBar from "./components/NavBar";

class App extends Component {
    render() {
        return (
            <div>
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>
                        <h1 className="App-title">Welcome to React</h1>
                    </header>
                    <p className="App-intro">
                        My First React App now its hacking time !!!
                    </p>
                </div>
                <NavBar auth={this.props.auth} {...this.props}/>
            </div>
        );
    }
}

export default App;
