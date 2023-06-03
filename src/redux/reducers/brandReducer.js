import {
  ADD_BRAND,
  ADD_BRAND_ERROR,
  DELETE_BRAND, DELETE_BRAND_ERROR,
  EDIT_BRAND,
  EDIT_BRAND_ERROR,
  ERROR,
  GET_CAR_BRANDS
} from "../actions/brandActions";

const initialState = {
  defaultModelCars : [],
  error:false
};

function brandReducer(state = initialState,action) {
  switch (action.type) {
    case DELETE_BRAND_ERROR:
      return {
        ...state,
        error : true
      };
    case EDIT_BRAND_ERROR:
      return {
        ...state,
        error: true
      };
    case ERROR:
      return {
        ...state,
        error: false
      };
    case ADD_BRAND_ERROR:
      return{
        ...state,
        error: true
      } ;
    case EDIT_BRAND:
      const brandData = state.defaultModelCars.map(type => {
        if(type.id === action.payload.id){
          return action.payload
        }
        return type
      });
      return {
        ...state,
        defaultModelCars:brandData
      };
    case GET_CAR_BRANDS:
      const newDate = action.payload;
      return {
        ...state,
        defaultModelCars: newDate
      };
    case ADD_BRAND:
      const newData = [...state.defaultModelCars,action.payload];
      return {
        ...state,
        defaultModelCars: newData
      };
    case DELETE_BRAND:
      const data = state.defaultModelCars.filter(item => item.id !== action.payload);
      return {
        ...state,
        defaultModelCars: data
      };
    default:
      return state
  }
}

export default brandReducer