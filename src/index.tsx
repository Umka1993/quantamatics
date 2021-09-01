import React from 'react';
require('./global.scss')
import {BrowserRouter} from "react-router-dom"
import {App} from "./app"
import ReactDOM from 'react-dom';
import {Header} from "./components/header";


ReactDOM.render(
    <BrowserRouter>
        <Header/>
        <App/>
    </BrowserRouter>,
    document.getElementById("root")
);