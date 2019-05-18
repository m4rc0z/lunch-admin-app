import {
    saveImportedMenusActionType,
    saveImportedMenusErrorActionType,
    setImportedMenusActionType,
    setMenusActionType,
    setShowImportMenuPanelActionType
} from "./menuActions";


const defaultState = {
    menus: [],
    saveMenusPending: false,
    showMenuImportPanel: false,
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case setMenusActionType:
            return {
                ...state,
                menus: action.payload
            };
        case setImportedMenusActionType:
            return {
                ...state,
                menus: action.payload,
                saveMenusPending: false,
            };
        case saveImportedMenusActionType:
            return {
                ...state,
                saveMenusPending: true,
            };
        case saveImportedMenusErrorActionType:
            return {
                ...state,
                saveMenusPending: false,
            };

        case setShowImportMenuPanelActionType:
            return {
                ...state,
                showMenuImportPanel: action.payload,
            };
        default:
            return state;
    }
}