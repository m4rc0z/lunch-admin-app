import React, {useEffect} from "react";
import MenuPanel from "./MenuPanel";
import * as PropTypes from "prop-types";
import MenuImport from "./import/MenuImport";
import connect from "react-redux/es/connect/connect";
import {
    deleteRestaurantMenusForWeekNumberAction,
    getRestaurantMenusAction
} from "../restaurant/redux/restaurantActions";

function RestaurantMenus(props) {

    useEffect(() => {
        props.getRestaurantMenusAction(props.restaurantId);
    }, []);


    const deleteMenus = (weekNumber) => {
        props.deleteRestaurantMenusForWeekNumberAction(weekNumber, props.restaurantId);
    };

    return (
        <div data-cy={`menu_container`}>
            <MenuImport auth={props.auth} restaurantId={props.restaurantId}/>
            <MenuPanel menus={props.menus} deleteMenus={(weekNumber) => deleteMenus(weekNumber)}/>
        </div>
    );
}

RestaurantMenus.propTypes = {
    auth: PropTypes.object.isRequired,
    menus: PropTypes.array,
    restaurantId: PropTypes.string.isRequired,
    getRestaurantMenusAction: PropTypes.func,
    deleteRestaurantMenusForWeekNumberAction: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
    const menus = state.restaurants[ownProps.restaurantId] && state.restaurants[ownProps.restaurantId].menus;
    return ({
        menus: menus,
        userId: state.auth.userId,
        ...ownProps
    });
};

const mapDispatchToProps = dispatch => ({
    getRestaurantMenusAction: (restaurantId) => dispatch(getRestaurantMenusAction(restaurantId)),
    deleteRestaurantMenusForWeekNumberAction: (weekNumber, restaurantId) => dispatch(deleteRestaurantMenusForWeekNumberAction(weekNumber, restaurantId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantMenus);