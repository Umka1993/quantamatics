import {createStore} from 'redux'
import {userReducer} from "./store/user/reducer";

export const store = createStore(userReducer)
