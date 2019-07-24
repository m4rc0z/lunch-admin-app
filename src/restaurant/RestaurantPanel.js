import React from "react";
import * as PropTypes from "prop-types";
import {Link} from "react-router-dom";

function RestaurantPanel(props) {
    const {restaurant} = props;
    return (
        <Link to={{pathname: `/restaurants/${restaurant.RID}`}} data-cy={`restaurant-${restaurant.RID}`}>
            <div>{restaurant.RID}</div>
            <div>{restaurant.name}</div>
        </Link>
    );
}

export default RestaurantPanel;

RestaurantPanel.propTypes = {
    restaurant: PropTypes.object,
};