import React from "react";
import MenuPanel from "./MenuPanel";
import * as PropTypes from "prop-types";

function Menus(props) {
    return (<MenuPanel auth={props.auth}/>);
}

export default Menus;

Menus.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    auth: PropTypes.object.isRequired,
};