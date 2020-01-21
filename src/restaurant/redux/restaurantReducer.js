import {
    getRestaurantCategoriesSuccessActionType,
    setRestaurantActionType,
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
        case getRestaurantCategoriesSuccessActionType:
            return {
                ...state,
                categories: action.categories.map((category) => ({_id: category._id, description: category.description})),
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