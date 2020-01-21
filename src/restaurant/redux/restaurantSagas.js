import {all, call, put, select, takeEvery} from 'redux-saga/effects'
import {showNotificationAction} from "../../components/notification/redux/notificationActions";
import {
    deleteRestaurantMenusAction,
    deleteRestaurantMenusActionType,
    deleteRestaurantMenusForWeekNumberActionType,
    deleteRestaurantMenusSuccessAction,
    deleteRestaurantMenusSuccessActionType,
    getRestaurantCategoriesActionType,
    getRestaurantCategoriesSuccessAction,
    getRestaurantMenusAction,
    getRestaurantMenusActionType,
    getRestaurantsActionType,
    saveRestaurantActionType,
    saveRestaurantFailAction,
    saveRestaurantFailActionType,
    saveRestaurantSuccessAction,
    saveRestaurantSuccessActionType,
    setRestaurantAction,
    setRestaurantsAction,
    showErrorToastAction,
    showErrorToastActionType,
    showMenusNotDeletedErrorAction,
    showMenusNotDeletedErrorActionType,
    updateRestaurantCategoriesActionType,
    updateRestaurantCategoriesSuccessAction,
    updateRestaurantCategoriesSuccessActionType,
    updateRestaurantMenusActionType,
    updateRestaurantMenusFailAction,
    updateRestaurantMenusFailActionType,
    updateRestaurantMenusSuccessAction,
    updateRestaurantMenusSuccessActionType,
    uploadRestaurantImageActionType,
    uploadRestaurantImageFailAction,
    uploadRestaurantImageFailActionType,
    uploadRestaurantImageSuccessAction,
    uploadRestaurantImageSuccessActionType,
    uploadRestaurantMapImageActionType,
    uploadRestaurantMapImageFailAction,
    uploadRestaurantMapImageFailActionType,
    uploadRestaurantMapImageSuccessAction,
    uploadRestaurantMapImageSuccessActionType
} from "./restaurantActions";
import {getFilteredMenusByWeek} from "../../utils/menuUtil";
import {setShowImportMenuPanelAction} from "../../menu/redux/menuActions";
import 'whatwg-fetch';

export const getAuthToken = (state) => state.auth.authToken;

export function* watchGetRestaurants() {
    yield takeEvery(getRestaurantsActionType, function* () {
        try {
            const authToken = yield select(getAuthToken);

            const res = yield call(fetch, `/authenticated/api/restaurants/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (res.status !== 200) {
                yield put(showErrorToastAction('Fehler beim Abruf der Menüs'));
            } else {
                yield put(setRestaurantsAction(yield res.json()));
            }
        } catch (err) {
            yield put(showErrorToastAction('Fehler beim Abruf der Menüs'))
        }
    });
}

export function* watchGetRestaurantMenus() {
    yield takeEvery(getRestaurantMenusActionType, function* (action) {
        try {
            const authToken = yield select(getAuthToken);

            const res = yield call(fetch, `/authenticated/api/restaurants/${action.restaurantId}/menus`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (res.status !== 200) {
                yield put(showErrorToastAction('Fehler beim Abruf der Menüs'));
            } else {
                yield put(setRestaurantAction(yield res.json()));
            }
        } catch (err) {
            yield put(showErrorToastAction('Fehler beim Abruf der Menüs'))
        }
    });
}

export function* watchGetRestaurantCategories() {
    yield takeEvery(getRestaurantCategoriesActionType, function* () {
        try {
            const authToken = yield select(getAuthToken);

            const res = yield call(fetch, `/authenticated/api/restaurants/categories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (res.status !== 200) {
                yield put(showErrorToastAction('Fehler beim Abruf der Menüs'));
            } else {
                yield put(getRestaurantCategoriesSuccessAction(yield res.json()));
            }
        } catch (err) {
            yield put(showErrorToastAction('Fehler beim Abruf der Menüs'))
        }
    });
}

export const getMenus = (restaurantId) => (state) => state.restaurants[restaurantId] && state.restaurants[restaurantId].menus;

export function* watchDeleteMenusForWeekNumber() {
    yield takeEvery(deleteRestaurantMenusForWeekNumberActionType, function* (action) {
        const menus = yield select(getMenus(action.restaurantId));
        const menusForWeek = getFilteredMenusByWeek(action.weekNumber, menus);
        yield put(deleteRestaurantMenusAction(action.restaurantId, menusForWeek));
    })
}

export function* watchDeleteRestaurantMenus() {
    yield takeEvery(deleteRestaurantMenusActionType, function* (action) {
        try {
            const authToken = yield select(getAuthToken);
            const res = yield call(fetch, `/authenticated/api/restaurants/${action.restaurantId}/menus`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    menus: action.menus
                })
            });
            if (res.status !== 200) {
                yield put(showMenusNotDeletedErrorAction());
            } else {
                yield put(deleteRestaurantMenusSuccessAction(action.restaurantId));
            }
        } catch (err) {
            yield put(showMenusNotDeletedErrorAction())
        }
    });
}


export function* watchDeleteMenusSuccess() {
    yield takeEvery(deleteRestaurantMenusSuccessActionType, function* (action) {
        yield put(showNotificationAction({
            message: 'Menüs erfolgreich gelöscht',
            options: {
                variant: 'success',
                autoHideDuration: 3000,
            }
        }));
        yield put(getRestaurantMenusAction(action.restaurantId));
    })
}

export function* watchUpdateMenus() {
    yield takeEvery(updateRestaurantMenusActionType, function* (action) {
        try {
            const authToken = yield select(getAuthToken);
            const res = yield call(fetch, `/authenticated/api/restaurants/${action.restaurantId}/menus`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    menus: action.menus
                })
            });
            if (res.status !== 200) {
                yield [
                    yield put(updateRestaurantMenusFailAction()),
                    yield put(setShowImportMenuPanelAction(true)),
                ];
            } else {
                yield [
                    yield put(setRestaurantAction(yield res.json())),
                    yield put(updateRestaurantMenusSuccessAction(action.restaurantId)),
                    yield put(setShowImportMenuPanelAction(false)),
                ];
            }
        } catch (err) {
            yield put(showErrorToastAction('Fehler beim Speichern der Menüs'))
        }
    });
}

export function* watchUpdateMenusError() {
    yield takeEvery(updateRestaurantMenusFailActionType, function* (action) {
        yield put(showErrorToastAction('Fehler beim Speichern der Menüs'));
    })
}

export function* watchUpdateMenusSuccess() {
    yield takeEvery(updateRestaurantMenusSuccessActionType, function* (action) {
        yield put(showNotificationAction({
            message: 'Menüs erfolgreich gespeichert',
            options: {
                variant: 'success',
                autoHideDuration: 3000,
            }
        }));
        yield put(getRestaurantMenusAction(action.restaurantId));
    })
}

export function* watchSaveRestaurant() {
    yield takeEvery(saveRestaurantActionType, function* (action) {
        try {
            const authToken = yield select(getAuthToken);
            const res = yield call(fetch, `/authenticated/api/restaurants/${action.restaurant.RID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify(action.restaurant),
            });
            if (res.status !== 200) {
                yield [
                    yield put(saveRestaurantFailAction()),
                ];
            } else {
                yield [
                    yield put(setRestaurantAction(yield res.json())),
                    yield put(saveRestaurantSuccessAction(action.restaurantId)),
                ];
            }
        } catch (err) {
            yield put(showErrorToastAction('Fehler beim Speichern der Menüs'))
        }
    });
}

export function* watchSaveRestaurantError() {
    yield takeEvery(saveRestaurantFailActionType, function* (action) {
        yield put(showErrorToastAction('Fehler beim Speichern des Restaurants'));
    })
}

export function* watchSaveRestaurantSuccess() {
    yield takeEvery(saveRestaurantSuccessActionType, function* (action) {
        yield put(showNotificationAction({
            message: 'Restaurant erfolgreich gespeichert',
            options: {
                variant: 'success',
                autoHideDuration: 3000,
            }
        }));
        yield put(getRestaurantMenusAction(action.restaurantId));
    })
}

export function* watchUploadRestaurantImage() {
    yield takeEvery(uploadRestaurantImageActionType, function* (action) {
        try {
            const formData = new FormData();

            formData.append('image', action.image);
            const authToken = yield select(getAuthToken);
            const res = yield call(fetch, `/authenticated/api/restaurants/${action.restaurantId}/image`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: formData,
            });
            if (res.status !== 200) {
                yield [
                    yield put(uploadRestaurantImageFailAction()),
                ];
            } else {
                yield [
                    yield put(setRestaurantAction(yield res.json())),
                    yield put(uploadRestaurantImageSuccessAction()),
                ];
            }
        } catch (err) {
            yield put(showErrorToastAction('Fehler beim Upload des Bildes'))
        }
    });
}

export function* watchUploadRestaurantImageError() {
    yield takeEvery(uploadRestaurantImageFailActionType, function* (action) {
        yield put(showErrorToastAction('Fehler beim Upload des Bildes'));
    })
}

export function* watchUploadRestaurantImageSuccess() {
    yield takeEvery(uploadRestaurantImageSuccessActionType, function* (action) {
        yield put(showNotificationAction({
            message: 'Bild erfolgreich gespeichert',
            options: {
                variant: 'success',
                autoHideDuration: 3000,
            }
        }));
        yield put(getRestaurantMenusAction(action.restaurantId));
    })
}

export function* watchUploadRestaurantMapImage() {
    yield takeEvery(uploadRestaurantMapImageActionType, function* (action) {
        try {
            const formData = new FormData();

            formData.append('image', action.image);
            const authToken = yield select(getAuthToken);
            const res = yield call(fetch, `/authenticated/api/restaurants/${action.restaurantId}/mapImage`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: formData,
            });
            if (res.status !== 200) {
                yield [
                    yield put(uploadRestaurantMapImageFailAction()),
                ];
            } else {
                yield [
                    yield put(setRestaurantAction(yield res.json())),
                    yield put(uploadRestaurantMapImageSuccessAction()),
                ];
            }
        } catch (err) {
            yield put(showErrorToastAction('Fehler beim Upload des Bildes'))
        }
    });
}

export function* watchUploadRestaurantMapImageError() {
    yield takeEvery(uploadRestaurantMapImageFailActionType, function* (action) {
        yield put(showErrorToastAction('Fehler beim Upload des Bildes'));
    })
}

export function* watchUploadRestaurantMapImageSuccess() {
    yield takeEvery(uploadRestaurantMapImageSuccessActionType, function* (action) {
        yield put(showNotificationAction({
            message: 'Bild erfolgreich gespeichert',
            options: {
                variant: 'success',
                autoHideDuration: 3000,
            }
        }));
        yield put(getRestaurantMenusAction(action.restaurantId));
    })
}

export function* watchGetRestaurantsError() {
    yield takeEvery(showErrorToastActionType, function* (action) {
        yield put(showNotificationAction({
            message: action.errorMessage,
            options: {
                variant: 'error',
                autoHideDuration: 3000,
            }
        }));
    })
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

export function* watchUpdateRestaurantCategories() {
    yield takeEvery(updateRestaurantCategoriesActionType, function* (action) {
        try {
            const authToken = yield select(getAuthToken);
            const res = yield call(fetch, `/authenticated/api/restaurants/categories`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify(action.categories),
            });
            if (res.status !== 200) {
                yield [
                    yield put(showErrorToastAction('Fehler beim Speichern der Kategorien')),
                ];
            } else {
                yield [
                    yield put(updateRestaurantCategoriesSuccessAction(yield res.json())),
                ];
            }
        } catch (err) {
            yield put(showErrorToastAction('Fehler beim Speichern der Menüs'))
        }
    });
}


export function* watchUpdateRestaurantCategoriesSuccess() {
    yield takeEvery(updateRestaurantCategoriesSuccessActionType, function* (action) {
        yield put(showNotificationAction({
            message: 'Kategorien erfolgreich gespeichert',
            options: {
                variant: 'success',
                autoHideDuration: 3000,
            }
        }));
    })
}


export default function* restaurantSaga() {
    yield all([
        watchGetRestaurants(),
        watchGetRestaurantsError(),
        watchGetRestaurantMenus(),
        watchDeleteRestaurantMenus(),
        watchDeleteMenusForWeekNumber(),
        watchDeleteMenusSuccess(),
        watchDeleteMenusError(),
        watchUpdateMenusSuccess(),
        watchUpdateMenus(),
        watchUpdateMenusError(),
        watchSaveRestaurant(),
        watchSaveRestaurantSuccess(),
        watchSaveRestaurantError(),
        watchUploadRestaurantImage(),
        watchUploadRestaurantImageSuccess(),
        watchUploadRestaurantImageError(),
        watchUploadRestaurantMapImage(),
        watchUploadRestaurantMapImageSuccess(),
        watchUploadRestaurantMapImageError(),
        watchGetRestaurantCategories(),
        watchUpdateRestaurantCategories(),
        watchUpdateRestaurantCategoriesSuccess()
    ])
}