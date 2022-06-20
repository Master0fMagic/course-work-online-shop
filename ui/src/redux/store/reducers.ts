import { combineReducers } from 'redux';
import userSlice from "./user/slice";
export default function createReducer(injectedReducers = {}) {
    const rootReducer = combineReducers({
        user: userSlice,
        ...injectedReducers
    });

    return rootReducer;
}
