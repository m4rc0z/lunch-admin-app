import {setAuthTokenActionType} from "./authActions";

const defaultState = {
    authToken: undefined,
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case setAuthTokenActionType:
            return {
                ...state,
                authToken: action.authToken
            };
        default:
            return state;
    }
}