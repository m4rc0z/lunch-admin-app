import React from 'react';
import './App.css';
import HeaderComponent from "./components/Header";
import ContentComponent from "./components/Content";

function App(props) {
    return (
        <div>
            <HeaderComponent {...props}/>
            <ContentComponent/>
        </div>
    );
}

export default App;
