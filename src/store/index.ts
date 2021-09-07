import { combineReducers, createStore } from 'redux';

export interface IRootState {

}

const store = createStore<IRootState, any, any, any>(
    combineReducers({

    }));
export default store;