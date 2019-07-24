import {setShowImportMenuPanelActionType} from "./menuActions";

const defaultState = {
    showPanel: false,
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case setShowImportMenuPanelActionType:
            return {
                ...state,
                showMenuImportPanel: action.payload,
            };
        default:
            return state;
    }
}