import { v4 as uuidv4 } from 'uuid';
import {
  ADD_TYPE,
  ADD_TYPE_ERROR,
  DELETE_TYPE,
  EDIT_TYPE,
  EDIT_TYPE_ERROR,
  ERROR,
  GET_CAR_TYPES
} from "../actions/typeActions";

const initialState = {
  types: [],
  error:false
};

function typeReducer(state = initialState,action) {
  switch (action.type) {
    case EDIT_TYPE_ERROR:
      return {
        ...state,
        error: true
      };
    case ERROR:
      return {
        ...state,
        error: action.payload
      };
    case ADD_TYPE_ERROR:
      return{
        ...state,
        error: true
      };
    case GET_CAR_TYPES:
      const newStates = action.payload;
      return {
        ...state,
         types: newStates
      };
    case EDIT_TYPE:
      const typesData = state.types.map(type => {
        if(type.id === action.payload.id){
          return {
            name:action.payload.name,
            id: uuidv4()
          }
        }
        return type
      });
      return {
        ...state,
        types:typesData
      };
    case DELETE_TYPE:
      console.log(action.payload);
      let types = state.types.filter(item => item.id !== action.payload);
      return {
        ...state,
        types: types
      };
    case ADD_TYPE:
      return {
        ...state,
        types: [...state.types, action.payload]
      };
    default:
      return state;
  }
}

export default typeReducer