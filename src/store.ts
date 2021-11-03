import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import { currentPageReducer } from "./store/currentPage/reducer";
import { CurrentPageState } from "./store/currentPage/reducer";
import thunk from "redux-thunk";
import { createAPI } from "./services/api";
import authorizationReducer, { AuthState } from "./store/authorization/reducer";


const api = createAPI();

// export type RootState = ReturnType<typeof rootReducer>
export interface RootState {
  currentPage: CurrentPageState,
  auth: AuthState,
}

const rootReducer = combineReducers({
  currentPage: currentPageReducer,
  auth: authorizationReducer
});

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk.withExtraArgument(api))))
