import { combineReducers } from "redux";
import { currentPageReducer } from "./store/currentPage/reducer";
import { CurrentPageState } from "./store/currentPage/reducer";
import { createAPI } from "./services/api";
import authorizationReducer from "./store/authorization";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from './store/user/index';
// import { breadcrumbsReducer, LinkData } from './store/breadcrumbs/reducer';

const api = createAPI();

const rootReducer = combineReducers({
  currentPage: currentPageReducer,
  auth: authorizationReducer,
  users: userReducer,
  // breadcrumbs: breadcrumbsReducer
});

export type RootState = ReturnType<typeof rootReducer>

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});

