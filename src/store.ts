import { combineReducers } from "redux";
import { currentPageReducer } from "./store/currentPage/reducer";
import { CurrentPageState } from "./store/currentPage/reducer";
import { createAPI } from "./services/api";
import authorizationReducer, { AuthState } from "./store/authorization/reducer";
import { configureStore } from "@reduxjs/toolkit";
// import { breadcrumbsReducer, LinkData } from './store/breadcrumbs/reducer';

const api = createAPI();

// export type RootState = ReturnType<typeof rootReducer>
export interface RootState {
  currentPage: CurrentPageState;
  auth: AuthState;
  // breadcrumbs: Array<LinkData>,
}

const rootReducer = combineReducers({
  currentPage: currentPageReducer,
  auth: authorizationReducer,
  // breadcrumbs: breadcrumbsReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});

