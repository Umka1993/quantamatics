import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import { userReducer } from "./store/user/reducer";
import { UserState } from "./store/user/reducer";
import { currentPageReducer } from "./store/currentPage/reducer";
import { CurrentPageState } from "./store/currentPage/reducer";
import thunk from "redux-thunk";
import { createAPI } from "./services/api";
import authorizationReducer, { AuthState } from "./store/authorization/reducer";


const api = createAPI();
export interface RootState {
  currentPage: CurrentPageState;
  user: UserState;
  auth: AuthState;
}

const rootReducer = combineReducers({
  user: userReducer,
  currentPage: currentPageReducer,
  auth: authorizationReducer
});

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk.withExtraArgument(api))))
