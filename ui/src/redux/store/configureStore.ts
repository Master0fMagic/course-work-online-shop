import {
    configureStore,
    getDefaultMiddleware
} from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import createReducer from "./reducers";

const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: false
})


function configureAppStore() {
    const reduxSagaMonitorOptions = {};
    const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
    const store = configureStore({
        reducer: createReducer(),
        middleware: [...customizedMiddleware, sagaMiddleware],
        devTools: process.env.NODE_ENV !== "production",
    });

    return { store, sagaMiddleware};
}

export const { store, sagaMiddleware } = configureAppStore();
export type RootState = ReturnType<typeof store.getState>
