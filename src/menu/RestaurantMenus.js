import React, {useEffect} from "react";
import MenuPanel from "./MenuPanel";
import * as PropTypes from "prop-types";
import MenuImport from "./import/MenuImport";
import connect from "react-redux/es/connect/connect";
import {
    deleteRestaurantMenusForWeekNumberAction,
    getRestaurantMenusAction
} from "../restaurant/redux/restaurantActions";
import CardContent from "@material-ui/core/es/CardContent/CardContent";
import Card from "@material-ui/core/Card/Card";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import Icon from "@material-ui/icons/Edit";
import styled from "styled-components";

const StyledCardContainer = styled(CardContent)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledCard = styled(Card)`
  margin-bottom: 10px;
`;

function RestaurantMenus(props) {

    useEffect(() => {
        props.getRestaurantMenusAction(props.restaurantId);
    }, []);


    const deleteMenus = (weekNumber) => {
        props.deleteRestaurantMenusForWeekNumberAction(weekNumber, props.restaurantId);
    };

    // TODO: add back button to navbar for edit case
    // TODO: remove link and use restaurant name with edit button
    return (
        <div data-cy={`menu_container`}>
            <StyledCard>
                <StyledCardContainer>
                    <div>
                        <div>{props.restaurant && props.restaurant.name}</div>
                    </div>
                    <div>
                        <IconButton onClick={() => props.click()}>
                            <Icon></Icon>
                        </IconButton>
                    </div>
                </StyledCardContainer>
            </StyledCard>
            <MenuImport auth={props.auth} restaurantId={props.restaurantId}/>
            <MenuPanel menus={props.restaurant && props.restaurant.menus}
                       deleteMenus={(weekNumber) => deleteMenus(weekNumber)}/>
        </div>
    );
}

RestaurantMenus.propTypes = {
    auth: PropTypes.object.isRequired,
    restaurant: PropTypes.object,
    restaurantId: PropTypes.string.isRequired,
    getRestaurantMenusAction: PropTypes.func,
    deleteRestaurantMenusForWeekNumberAction: PropTypes.func,
    click: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
    const restaurant = state.restaurants[ownProps.restaurantId];
    return ({
        restaurant,
        userId: state.auth.userId,
        ...ownProps
    });
};

const mapDispatchToProps = dispatch => ({
    getRestaurantMenusAction: (restaurantId) => dispatch(getRestaurantMenusAction(restaurantId)),
    deleteRestaurantMenusForWeekNumberAction: (weekNumber, restaurantId) => dispatch(deleteRestaurantMenusForWeekNumberAction(weekNumber, restaurantId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantMenus);