export const getRestaurantsActionType = '[RESTAURANT] get restaurants';

export const getRestaurantsAction = () => ({
    type: getRestaurantsActionType,
});

export const showErrorToastActionType = '[GENERAL] error toast';

export const showErrorToastAction = (errorMessage) => ({
    type: showErrorToastActionType,
    errorMessage
});

export const setRestaurantsActionType = '[RESTAURANT] set restaurants';

export const setRestaurantsAction = (restaurants) => ({
    type: setRestaurantsActionType,
    restaurants,
});

export const updateRestaurantMenusActionType = '[RESTAURANT] update menus';

export const updateRestaurantMenusAction = (menus, restaurantId) => ({
    type: updateRestaurantMenusActionType,
    menus,
    restaurantId
});

export const updateRestaurantMenusSuccessActionType = '[RESTAURANT] update menus success';

export const updateRestaurantMenusSuccessAction = (restaurantId) => ({
    type: updateRestaurantMenusSuccessActionType,
    restaurantId,
});

export const updateRestaurantMenusFailActionType = '[RESTAURANT] update menus fail';

export const updateRestaurantMenusFailAction = () => ({
    type: updateRestaurantMenusFailActionType,
});

export const getRestaurantMenusActionType = '[RESTAURANT] get menus';

export const getRestaurantMenusAction = (restaurantId) => ({
    type: getRestaurantMenusActionType,
    restaurantId
});

export const deleteRestaurantMenusForWeekNumberActionType = '[RESTAURANT] delete weeknumber restaurant menus';

export const deleteRestaurantMenusForWeekNumberAction = (weekNumber, restaurantId) => ({
    type: deleteRestaurantMenusForWeekNumberActionType,
    weekNumber,
    restaurantId
});

export const deleteRestaurantMenusActionType = '[RESTAURANT] delete menus';

export const deleteRestaurantMenusAction = (restaurantId, menus) => ({
    type: deleteRestaurantMenusActionType,
    restaurantId,
    menus
});

export const deleteRestaurantMenusSuccessActionType = '[RESTAURANT] delete menus success';

export const deleteRestaurantMenusSuccessAction = (restaurantId) => ({
    type: deleteRestaurantMenusSuccessActionType,
    restaurantId
});

export const showMenusNotDeletedErrorActionType = '[MENUS] not deleted menus';

export const showMenusNotDeletedErrorAction = () => ({
    type: showMenusNotDeletedErrorActionType
});

export const setRestaurantActionType = '[RESTAURANT] set restaurant';

export const setRestaurantAction = (restaurant) => ({
    type: setRestaurantActionType,
    restaurant
});

