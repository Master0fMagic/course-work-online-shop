import {call, put, takeLatest, select, takeEvery} from 'redux-saga/effects';
import {AnyAction} from "redux";
import {PayloadAction} from "@reduxjs/toolkit";
import {login, logout, setAuth, setError, setUser, Statuses} from "./slice";
import {PostLogin, Register} from "../../../api/Api";

import {Api} from "../../../api/Api";

function* loginAction({payload}: PayloadAction<PostLogin>) {
    try {
        const api = new Api();
        const result = yield call(
            api.login,
            payload
        );
        if(!result.data)
            throw new Error(result.message)

        localStorage.setItem('techShop', JSON.stringify(payload));
        yield put(setUser(payload));
        yield put(setAuth(true))
    } catch (err) {
        yield put(setError(err.message));
        console.log(err.message)
    }
}

function* logoutAction() {
    try {
        const api = new Api();
        const result = yield call(
            api.logout
        );
        if(!result.data)
            throw new Error(result.message)

        localStorage.removeItem('techShop');
        yield put(setUser({}));
        yield put(setAuth(false))
    } catch (err) {
        console.log(err.message)
    }
}

export default function* watchUser() {
    yield takeLatest(login.type, loginAction);
    yield takeLatest(logout.type, logoutAction);
}
