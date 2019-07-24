import React from 'react';
import './App.css';
import HeaderComponent from "./components/Header";
import ContentComponent from "./components/Content";
import Notification from "./components/notification/Notification";

function App() {
    // TODO: rename App component and check usages
    // TODO: check if contentcomponent and nitification are needed
    return (
            <div>
                <HeaderComponent/>
                <ContentComponent/>
                <Notification/>
            </div>
    );
}

export default App;
