import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { createAPI } from "./services/api";

import authorizationReducer from "./store/authorization";
import quantamaticsApi from "./api";

const api = createAPI();

const rootReducer = combineReducers({
  auth: authorizationReducer,
  [quantamaticsApi.reducerPath]: quantamaticsApi.reducer
});

export type RootState = ReturnType<typeof rootReducer>

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }).concat(quantamaticsApi.middleware),
});

