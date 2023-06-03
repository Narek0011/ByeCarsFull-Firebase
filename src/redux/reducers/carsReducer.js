import {GET_CAR_DOCS,ERROR, GET_CARS, ADD_CAR, DELETE_CAR, EDIT_CAR, GET_CAR, ADD_CAR_ERROR} from "../actions/carActions";

const initialState = {
  cars: [],
  car: {},
  carDocs: null,
  error:false
};

function carsReducer(state = initialState, action) {
  switch (action.type) {
    case ERROR:
      return {
        ...state,
        error: false
      };
    case ADD_CAR_ERROR:
    return {
      ...state,
      error: true,
    };
    case GET_CAR:
      state.car = action.payload;
      return state;
    case EDIT_CAR:
      const carsData = state.cars.map(item => {
        if (item.id === action.payload.id) {
          return action.payload
        }
        return item
      });
      return {
        ...state,
        cars: carsData
      };
    case GET_CARS:
      return {
        ...state,
        cars: action.payload
      };
    case GET_CAR_DOCS:
      return {
        ...state,
        carDocs: action.payload
      };
    case ADD_CAR:
      const newData = [action.payload, ...state.cars];
      return {
        ...state,
        cars: newData
      };
    case DELETE_CAR:
      const newCarsList = state.cars.filter(item => item.id !== action.payload.id);
      return {
        ...state,
        cars: newCarsList
      };
    default:
      return state
  }
}
export default carsReducer