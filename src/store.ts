import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { createAPI } from "./services/api";

import { currentPageReducer } from "./store/currentPage/reducer";
import authorizationReducer from "./store/authorization";
import userReducer from './store/user/index';
import OrganizationReducer from "./store/organization/";
// import { breadcrumbsReducer, LinkData } from './store/breadcrumbs/reducer';

const api = createAPI();

const rootReducer = combineReducers({
  currentPage: currentPageReducer,
  auth: authorizationReducer,
  users: userReducer,
  organization: OrganizationReducer,
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

