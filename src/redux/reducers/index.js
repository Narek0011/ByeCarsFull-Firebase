import { combineReducers } from 'redux';
import carsReducer from './carsReducer'
import typeReducer from "./carTypeReducer";
import brandReducer from "./brandReducer";

const rootReducer = combineReducers({
  car: carsReducer,
  type: typeReducer,
  brand:brandReducer,
});

export default rootReducer;