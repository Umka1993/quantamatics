import React from 'react';
import './sass/global.scss';
import { BrowserRouter } from "react-router-dom"
import store from "./store";
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import BaseLayout from './layouts'

ReactDOM.render(
	<BrowserRouter>
		<Provider store={store}>
			<BaseLayout />
		</Provider>
	</BrowserRouter>,
	document.getElementById("root")
);
