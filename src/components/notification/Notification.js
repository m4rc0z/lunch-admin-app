import React from 'react';
import {withSnackbar} from "notistack/build";
import {connect} from "react-redux";
import {closeNotificationAction, showNotificationAction} from "./redux/notificationActions";
import * as PropTypes from "prop-types";

class Notification extends React.Component {
    displayed = [];

    storeDisplayed = (id) => {
        this.displayed = [...this.displayed, id];
    };

    shouldComponentUpdate({ notification: newSnacks = [] }) {
        const { notifications: currentSnacks } = this.props.notification;
        let notExists = false;
        for (let i = 0; i < newSnacks.length; i += 1) {
            if (notExists) continue;
            notExists = notExists || !currentSnacks.filter(({ key }) => newSnacks[i].key === key).length;
        }
        return true;
    }

    componentDidUpdate() {
        const { notifications = [] } = this.props.notification;

        notifications.forEach((notification) => {
            // Do nothing if snackbar is already displayed
            if (this.displayed.includes(notification.key)) return;
            // Display snackbar using notistack
            this.props.enqueueSnackbar(notification.message, notification.options);
            // Keep track of snackbars that we've displayed
            this.storeDisplayed(notification.key);
            // Dispatch action to remove snackbar from redux store
            this.props.closeNotificationAction(notification.key);
        });
    }

    render() {
        return null;
    }
}

Notification.propTypes = {
    enqueueSnackbar: PropTypes.func,
    removeSnackbar: PropTypes.func,
    notification: PropTypes.object,
    closeNotificationAction: PropTypes.func,
};

const mapStateToProps = state => {
    return ({
        ...state
    });
};

const mapDispatchToProps = dispatch => ({
    showNotificationAction: (payload) => dispatch(showNotificationAction(payload)),
    closeNotificationAction: (payload) => dispatch(closeNotificationAction(payload)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withSnackbar(Notification));
