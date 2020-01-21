export const getRestaurantsActionType = '[RESTAURANT] get restaurants';

export const getRestaurantsAction = () => ({
    type: getRestaurantsActionType,
});

export const getRestaurantCategoriesActionType = '[RESTAURANT] get restaurant categories';

export const getRestaurantCategoriesAction = () => ({
    type: getRestaurantCategoriesActionType,
});

export const getRestaurantCategoriesSuccessActionType = '[RESTAURANT] success get restaurant categories';

export const getRestaurantCategoriesSuccessAction = (categories) => ({
    type: getRestaurantCategoriesSuccessActionType,
    categories
});

export const updateRestaurantCategoriesActionType = '[RESTAURANT] update restaurant categories';

export const updateRestaurantCategoriesAction = (categories) => ({
    type: updateRestaurantCategoriesActionType,
    categories
});

export const updateRestaurantCategoriesSuccessActionType = '[RESTAURANT] success update restaurant categories';

export const updateRestaurantCategoriesSuccessAction = (categories) => ({
    type: updateRestaurantCategoriesSuccessActionType,
    categories
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

export const saveRestaurantActionType = '[RESTAURANT] save restaurant';

export const saveRestaurantAction = (restaurant) => ({
    type: saveRestaurantActionType,
    restaurant,
});

export const saveRestaurantSuccessActionType = '[RESTAURANT] save restaurant success';

export const saveRestaurantSuccessAction = (restaurantId) => ({
    type: saveRestaurantSuccessActionType,
    restaurantId,
});

export const saveRestaurantFailActionType = '[RESTAURANT] update restaurant fail';

export const saveRestaurantFailAction = () => ({
    type: saveRestaurantFailActionType,
});

export const uploadRestaurantImageActionType = '[RESTAURANT] upload restaurant image';

export const uploadRestaurantImageAction = (image, restaurantId) => ({
    type: uploadRestaurantImageActionType,
    image,
    restaurantId
});

export const uploadRestaurantImageSuccessActionType = '[RESTAURANT] upload restaurant image success';

export const uploadRestaurantImageSuccessAction = () => ({
    type: uploadRestaurantImageSuccessActionType,
});

export const uploadRestaurantImageFailActionType = '[RESTAURANT] upload restaurant image fail';

export const uploadRestaurantImageFailAction = () => ({
    type: uploadRestaurantImageFailActionType,
});

export const uploadRestaurantMapImageActionType = '[RESTAURANT] upload restaurant map image';

export const uploadRestaurantMapImageAction = (image, restaurantId) => ({
    type: uploadRestaurantMapImageActionType,
    image,
    restaurantId
});

export const uploadRestaurantMapImageSuccessActionType = '[RESTAURANT] upload restaurant map image success';

export const uploadRestaurantMapImageSuccessAction = () => ({
    type: uploadRestaurantMapImageSuccessActionType,
});

export const uploadRestaurantMapImageFailActionType = '[RESTAURANT] upload restaurant map image fail';

export const uploadRestaurantMapImageFailAction = () => ({
    type: uploadRestaurantMapImageFailActionType,
});

