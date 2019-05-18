export const showNotificationActionType = '[NOTIFICATION] show notification';

export const showNotificationAction = (notification) => ({
    type: showNotificationActionType,
    notification: {
        key: new Date().getTime() + Math.random(),
        ...notification,
    },
});

export const closeNotificationActionType = '[NOTIFICATION] close notification';

export const closeNotificationAction = (key) => ({
    type: closeNotificationActionType,
    key
});