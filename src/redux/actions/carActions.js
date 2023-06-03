import {setDoc, collection, deleteDoc, doc, getDocs, query, where} from "@firebase/firestore";
import {db} from "../../firebaseService";

export const GET_CARS = 'GET_CARS';
export const GET_CAR = 'GET_CAR';
export const GET_CAR_DOCS = 'GET_CAR_DOCS';
export const DELETE_CAR = 'DELETE_CAR';
export const ADD_CAR = 'ADD_CAR';
export const ADD_CAR_ERROR = 'ADD_CAR_ERROR';
export const ERROR = 'ERROR';
export const EDIT_CAR = 'EDIT_CAR';

export const getCar = async  (dispatch , id) => {
  const colRef = await collection(db, "cars");
  let q = await query(colRef, where("id", "==" , id));
  const docsSnap = await getDocs(q);
  let car = {};
  docsSnap.forEach(doc => {
    car = doc.data();
  });
  dispatch({
    type:GET_CAR,
    payload: car
  });
  return car
};


export const getCars = async (dispatch, colRef) => {
  const docsSnap = await getDocs(colRef);
  let cars = [];
  docsSnap.forEach(doc => {
    let newData = doc.data();
    cars.push(newData)
  });
  dispatch({
    type: GET_CARS,
    payload: cars
  });
  dispatch({
    type: GET_CAR_DOCS,
    payload: docsSnap
  });
  return cars;
};

export const deleteCar = async (dispatch, id) => {
  const docRef = doc(db, "cars", id);
  await deleteDoc(docRef).then((res) => {
    dispatch({
      type: DELETE_CAR,
      payload: {id: id}
    });
  }).catch(err => {
    console.log(err);
  })
};

export const add = async (dispatch, newData, carDocRef) => {
  if(newData){
    const data = {...newData, createdAt: new Date().getTime(), id: carDocRef.id};
    await setDoc(carDocRef, data).then(() => {
      dispatch({
        type: ADD_CAR,
        payload: data
      });
    });
    return data
  }else{
    dispatch({
      type:ADD_CAR_ERROR,
    })
  }

};

export const update = async (dispatch,data) => {
  const docRef = doc(db, "cars", data.id );
  await setDoc(docRef, data).then(() => {
    dispatch({
      type:EDIT_CAR,
      payload: data,
    });
  });
};

export const error = (  dispatch  ) => {
  dispatch({
    type:ERROR,
  })
};