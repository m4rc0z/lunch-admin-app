import {setAuthRestaurantIdActionType, setAuthTokenActionType, setIsAdminActionType} from "./authActions";

const defaultState = {
    authToken: undefined,
    userId: undefined,
    isAdmin: false, // TODO: check if isAdmin is used
};
// TODO: add is authenticated to state and use it everywhere

export default (state = defaultState, action) => {
    switch (action.type) {
        case setAuthTokenActionType:
            return {
                ...state,
                authToken: action.authToken
            };
        case setIsAdminActionType:
            return {
                ...state,
                isAdmin: action.isAdmin
            };
        default:
            return state;
    }
}