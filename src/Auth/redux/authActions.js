export const setAuthTokenActionType = '[AUTH] set token';

export const setAuthTokenAction = (authToken) => ({
    type: setAuthTokenActionType,
    authToken
});