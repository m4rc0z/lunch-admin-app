import {
    getMenusActionType,
    saveImportedMenusActionType,
    saveImportedMenusErrorAction,
    saveImportedMenusErrorActionType,
    saveImportedMenusSuccessAction,
    saveImportedMenusSuccessActionType,
    setImportedMenusAction,
    setMenusAction,
    setShowImportMenuPanelAction,
    showMenusNotFoundErrorAction,
    showMenusNotFoundErrorActionType
} from "./menuActions";
import {all, call, put, takeEvery} from 'redux-saga/effects'
import {showNotificationAction} from "../../components/notification/redux/notificationActions";


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

export default function* menuSaga() {
    yield all([
        watchGetMenus(),
        watchGetMenusError(),
        watchSaveImportedMenus(),
        watchSaveImportedMenusError(),
        watchSaveImportedMenusSuccess(),
    ])
}