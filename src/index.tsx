import React from 'react';
require('./global.scss')
import {BrowserRouter} from "react-router-dom"
import {App} from "./app"
import {store} from "./store";
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {Header} from "./components/header";


ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <Header/>
            <App/>
        </Provider>
    </BrowserRouter>,
    document.getElementById("root")
);
