import React from "react";
import MenuPanel from "./MenuPanel";
import * as PropTypes from "prop-types";
import MenuImport from "./import/MenuImport";

function Menus(props) {
    return props.isAuthenticated && (
        <div data-cy={`menu_container`}>
            <MenuImport auth={props.auth}/>
            <MenuPanel auth={props.auth}/>
        </div>
    );
}

export default Menus;

Menus.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    auth: PropTypes.object.isRequired,
};