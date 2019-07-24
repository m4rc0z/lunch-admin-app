import {closeNotificationActionType, showNotificationActionType} from "./notificationActions";

const defaultState = {
    notifications: [],
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case showNotificationActionType:
            return {
                ...state,
                notifications: [
                    ...state.notifications,
                    {
                        ...action.notification,
                    },
                ],
            };
        case closeNotificationActionType:
            return {
                ...state,
                notifications: state.notifications.filter(
                    notification => notification.key !== action.key,
                ),
            };
        default:
            return state;
    }
}