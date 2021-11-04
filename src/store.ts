import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import { currentPageReducer } from "./store/currentPage/reducer";
import { CurrentPageState } from "./store/currentPage/reducer";
import thunk from "redux-thunk";
import { createAPI } from "./services/api";
import authorizationReducer, { AuthState } from "./store/authorization/reducer";
// import { breadcrumbsReducer, LinkData } from './store/breadcrumbs/reducer';


const api = createAPI();

// export type RootState = ReturnType<typeof rootReducer>
export interface RootState {
  currentPage: CurrentPageState,
  auth: AuthState,
  // breadcrumbs: Array<LinkData>,
}

const rootReducer = combineReducers({
  currentPage: currentPageReducer,
  auth: authorizationReducer,
  // breadcrumbs: breadcrumbsReducer
});

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk.withExtraArgument(api))))
