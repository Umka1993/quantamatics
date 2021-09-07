import React from 'react';

require('./global.scss')
import {BrowserRouter} from "react-router-dom"
import {App} from "./app"
import ReactDOM from 'react-dom';
import {Header} from "./components/header";
import {Provider} from 'react-redux';
import store from './store';

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <Header/>
            <App/>
        </Provider>
    </BrowserRouter>,
    document.getElementById("root")
);