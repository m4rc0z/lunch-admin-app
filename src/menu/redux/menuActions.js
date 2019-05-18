export const setMenusActionType = '[MENUS] set menus';

export const setMenusAction = (menus) => ({
    type: setMenusActionType,
    payload: menus
});

export const getMenusActionType = '[MENUS] get menus';

export const getMenusAction = (authToken) => ({
    type: getMenusActionType,
    authToken: authToken
});

export const showMenusNotFoundErrorActionType = '[MENUS] not found menus';

export const showMenusNotFoundErrorAction = () => ({
    type: showMenusNotFoundErrorActionType
});

export const saveImportedMenusActionType = '[MENUS] save imported menus';

export const saveImportedMenusAction = (authToken, convertedMenus) => ({
    type: saveImportedMenusActionType,
    authToken: authToken,
    convertedMenus: convertedMenus
});

export const saveImportedMenusErrorActionType = '[MENUS] save imported menus error';

export const saveImportedMenusErrorAction = () => ({
    type: saveImportedMenusErrorActionType
});

export const saveImportedMenusSuccessActionType = '[MENUS] save imported menus success';

export const saveImportedMenusSuccessAction = () => ({
    type: saveImportedMenusSuccessActionType
});

export const setImportedMenusActionType = '[MENUS] set imported menus';

export const setImportedMenusAction = (menus) => ({
    type: setImportedMenusActionType,
    payload: menus
});

export const setShowImportMenuPanelActionType = '[MENUS] set show import menu panel';

export const setShowImportMenuPanelAction = (payload) => ({
    type: setShowImportMenuPanelActionType,
    payload: payload
});
