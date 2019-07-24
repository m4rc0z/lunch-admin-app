import ReactDOM from 'react-dom';
import './index.css';
import MainRoutes from './routes';
import React from "react";
import {Provider} from "react-redux";
import configureStore from "./redux/store";
import {SnackbarProvider} from "notistack/build";
import Notification from "./components/notification/Notification";

ReactDOM.render(
    <Provider store={configureStore()}>
        <SnackbarProvider maxSnack={3} preventDuplicate>
            <Notification/>
            <MainRoutes/>
        </SnackbarProvider>
    </Provider>,
    document.getElementById('root')
);