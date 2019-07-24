import {
    setRestaurantActionType,
    setRestaurantMenusAction,
    setRestaurantMenusActionType,
    setRestaurantsActionType
} from "./restaurantActions";

export default (state = {}, action) => {
    switch (action.type) {
        case setRestaurantsActionType:
            return {
                ...state,
                ...action.restaurants.reduce((acc, restaurant) => {
                    acc[restaurant.RID] = {...restaurant};

                    return acc;
                }, {}),
            };
        case setRestaurantActionType:
            return {
                ...state,
                [action.restaurant.RID]: {...action.restaurant},
            };
        default:
            return state;
    }
}