import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import createSagaMiddleware from "redux-saga";
import notificationReducer from "../components/notification/redux/notificationReducer";
import authReducer from "../Auth/redux/authReducer";
import menuReducer from "../menu/redux/menuReducer";
import restaurantReducer from "../restaurant/redux/restaurantReducer";
import {all, fork} from 'redux-saga/effects'
import restaurantSaga from "../restaurant/redux/restaurantSagas";

const sagaMiddleware = createSagaMiddleware();

function* rootSaga() {
    yield all([
        fork(restaurantSaga)
    ])
}

function configureStore() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(combineReducers({
            menu: menuReducer,
            notification: notificationReducer,
            auth: authReducer,
            restaurants: restaurantReducer,
        }),
        composeEnhancers(
            applyMiddleware(sagaMiddleware)
        )
    );

    sagaMiddleware.run(rootSaga);

    return store;
}

export default configureStore;