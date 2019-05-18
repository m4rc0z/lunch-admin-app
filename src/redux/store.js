import menuReducer from "../menu/redux/menuReducer";
import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import createSagaMiddleware from "redux-saga";
import menuSaga from "../menu/redux/menuSagas";
import notificationReducer from "../components/notification/redux/notificationReducer";

const sagaMiddleware = createSagaMiddleware();

function configureStore() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(combineReducers({menu: menuReducer, notification: notificationReducer}),
        composeEnhancers(
            applyMiddleware(sagaMiddleware)
        )
    );

    sagaMiddleware.run(menuSaga);

    return store;
}

export default configureStore;