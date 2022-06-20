import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {sagaMiddleware, store} from "./redux/store/configureStore";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import rootSaga from "./redux/store/rootSaga";

sagaMiddleware.run(rootSaga);
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);