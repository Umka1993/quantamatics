import {createStore} from 'redux'
import { combineReducers } from 'redux';
import {userReducer} from "./store/user/reducer";
import {UserState} from "./store/user/reducer";
import {currentPageReducer} from "./store/currentPage/reducer";
import {CurrentPageState} from "./store/currentPage/reducer";

export interface RootState {
  currentPage: CurrentPageState;
  user: UserState;
}

const rootReducer = combineReducers({
    user: userReducer,
    currentPage: currentPageReducer,
});
export const store = createStore(rootReducer)
