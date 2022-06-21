import { all, call } from 'redux-saga/effects';
import watchUser from "./user/saga";

export default function* rootSaga() {
    yield all([
        call(watchUser)
    ]);
    // code after all-effect
}
