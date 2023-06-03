import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

// noinspection JSDeprecatedSymbols
export const store = createStore(rootReducer, applyMiddleware(thunk));