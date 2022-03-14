import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import authorizationReducer from "./store/authorization";
import api from "./api";

const rootReducer = combineReducers({
	auth: authorizationReducer,
	[api.reducerPath]: api.reducer
});

export type RootState = ReturnType<typeof rootReducer>

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(api.middleware),
});

