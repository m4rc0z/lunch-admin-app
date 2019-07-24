import React from 'react';
import '../App.css';
import HeaderComponent from "./Header";
import ContentComponent from "./Content";

function LandingComponent() {
    return (
            <div>
                <HeaderComponent/>
                <ContentComponent/>
            </div>
    );
}

export default LandingComponent;
