export const setAuthTokenActionType = '[AUTH] set token';

export const setAuthTokenAction = (authToken) => ({
    type: setAuthTokenActionType,
    authToken
});

export const setIsAdminActionType = '[AUTH] set isAdmin';

export const setIsAdminAction = (isAdmin) => ({
    type: setIsAdminActionType,
    isAdmin,
});