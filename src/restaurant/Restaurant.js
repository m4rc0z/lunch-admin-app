import React, {useEffect} from "react";
import * as PropTypes from "prop-types";
import RestaurantPanel from "./RestaurantPanel";
import connect from "react-redux/es/connect/connect";
import {getRestaurantsAction, updateRestaurantMenusAction} from "./redux/restaurantActions";

function Restaurant(props) {
    useEffect(() => {
        props.getRestaurantsAction();
    }, []);

    return (
        <div data-cy={`menu_container`}>
            {
                Object
                    .keys(props.restaurants)
                    .map((restaurant, i) => {
                        return props.restaurants[restaurant] &&
                            <RestaurantPanel key={i} restaurant={props.restaurants[restaurant]}/>;
                    })
            }
        </div>
    );
}

Restaurant.propTypes = {
    auth: PropTypes.object.isRequired,
    restaurants: PropTypes.object,
    getRestaurantsAction: PropTypes.func,
    updateRestaurantMenusAction: PropTypes.func,
    restaurantId: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
    restaurants: state.restaurants,
    userId: state.auth.userId,
    ...ownProps
});

const mapDispatchToProps = dispatch => ({
    getRestaurantsAction: () => dispatch(getRestaurantsAction()),
    updateRestaurantMenusAction: (menus, restaurantId) => dispatch(updateRestaurantMenusAction(menus, restaurantId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Restaurant);