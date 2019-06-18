import {
    deleteMenusAction,
    deleteMenusActionType,
    deleteMenusForWeekNumberActionType,
    deleteMenusSuccessAction,
    deleteMenusSuccessActionType,
    getMenusAction,
    getMenusActionType,
    saveImportedMenusActionType,
    saveImportedMenusErrorAction,
    saveImportedMenusErrorActionType,
    saveImportedMenusSuccessAction,
    saveImportedMenusSuccessActionType,
    setImportedMenusAction,
    setMenusAction,
    setShowImportMenuPanelAction,
    showMenusNotDeletedErrorAction,
    showMenusNotDeletedErrorActionType,
    showMenusNotFoundErrorAction,
    showMenusNotFoundErrorActionType
} from "./menuActions";
import {all, call, put, select, takeEvery} from 'redux-saga/effects'
import {showNotificationAction} from "../../components/notification/redux/notificationActions";
import {getFilteredMenusByWeek} from "../../utils/menuUtil";


export function* watchSaveImportedMenus() {
    yield takeEvery(saveImportedMenusActionType, function* (action) {
        try {
            const res = yield call(fetch, '/api/menus', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${action.authToken}`
                },
                body: JSON.stringify(action.convertedMenus),
            });
            if (res.status !== 200) {
                yield [
                    yield put(saveImportedMenusErrorAction()),
                    yield put(setShowImportMenuPanelAction(true)),
                ]
            } else {
                yield [
                    yield put(setImportedMenusAction(yield res.json())),
                    yield put(saveImportedMenusSuccessAction()),
                    yield put(setShowImportMenuPanelAction(false)),
                ];
            }
        } catch (err) {
            yield put(saveImportedMenusErrorAction())
        }
    });
}

export function* watchSaveImportedMenusError() {
    yield takeEvery(saveImportedMenusErrorActionType, function* () {
        yield put(showNotificationAction({
            message: 'Fehler beim Speichern der Menüs',
            options: {
                variant: 'error',
                autoHideDuration: 3000,
            }
        }));
    })
}

export function* watchSaveImportedMenusSuccess() {
    yield takeEvery(saveImportedMenusSuccessActionType, function* () {
        yield put(showNotificationAction({
            message: 'Menüs erfolgreich gespeichert',
            options: {
                variant: 'success',
                autoHideDuration: 3000,
            }
        }));
        const authToken = yield select(getAuthToken);

        yield put(getMenusAction(authToken));
    })
}

export function* watchGetMenus() {
    yield takeEvery(getMenusActionType, function* (action) {
        try {
            const res = yield call(fetch, '/api/menus', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${action.authToken}`
                }
            });
            if (res.status !== 200) {
                yield put(showMenusNotFoundErrorAction());
            } else {
                yield put(setMenusAction(yield res.json()));
            }
        } catch (err) {
            yield put(showMenusNotFoundErrorAction())
        }
    });
}

export function* watchGetMenusError() {
    yield takeEvery(showMenusNotFoundErrorActionType, function* () {
        yield put(showNotificationAction({
            message: 'Fehler beim Abruf der Menüs',
            options: {
                variant: 'error',
                autoHideDuration: 3000,
            }
        }));
    })
}

export const getMenus = (state) => state.menu.menus;
export const getRestaurantId = (state) => state.menu.menus._id;
export const getAuthToken = (state) => state.auth.authToken;

export function* watchDeleteMenusForWeekNumber() {
    yield takeEvery(deleteMenusForWeekNumberActionType, function* (action) {
        const menus = yield select(getMenus);
        const menusForWeek = getFilteredMenusByWeek(action.weekNumber, menus);
        const restaurantId = yield select(getRestaurantId);
        const authToken = yield select(getAuthToken);

        yield put(deleteMenusAction(restaurantId, menusForWeek, authToken));
    })
}


export function* watchDeleteMenus() {
    yield takeEvery(deleteMenusActionType, function* (action) {
        try {
            const res = yield call(fetch, '/api/menus', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${action.authToken}`
                },
                body: JSON.stringify({
                    restaurantId: action.restaurantId,
                    menus: action.menus
                })
            });
            if (res.status !== 200) {
                yield put(showMenusNotDeletedErrorAction());
            } else {
                yield put(deleteMenusSuccessAction());
            }
        } catch (err) {
            yield put(showMenusNotDeletedErrorAction())
        }
    });
}

export function* watchDeleteMenusError() {
    yield takeEvery(showMenusNotDeletedErrorActionType, function* () {
        yield put(showNotificationAction({
            message: 'Fehler beim Löschen der Menüs',
            options: {
                variant: 'error',
                autoHideDuration: 3000,
            }
        }));
    })
}

export function* watchDeleteMenusSuccess() {
    yield takeEvery(deleteMenusSuccessActionType, function* () {
        yield put(showNotificationAction({
            message: 'Menüs erfolgreich gelöscht',
            options: {
                variant: 'success',
                autoHideDuration: 3000,
            }
        }));
        const authToken = yield select(getAuthToken);

        yield put(getMenusAction(authToken));
    })
}

export default function* menuSaga() {
    yield all([
        watchGetMenus(),
        watchGetMenusError(),
        watchSaveImportedMenus(),
        watchSaveImportedMenusError(),
        watchSaveImportedMenusSuccess(),
        watchDeleteMenusForWeekNumber(),
        watchDeleteMenus(),
        watchDeleteMenusError(),
        watchDeleteMenusSuccess(),
    ])
}