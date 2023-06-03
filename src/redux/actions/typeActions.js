import {collection, deleteDoc, doc, getDocs, setDoc} from "@firebase/firestore";
import {db} from "../../firebaseService";


export const ERROR = 'ERROR';
export const ADD_TYPE_ERROR = 'ADD_TYPE_ERROR';
export const ADD_TYPE = 'ADD_TYPE';
export const DELETE_TYPE = 'DELETE_TYPE';
export const EDIT_TYPE = 'EDIT_TYPE';
export const EDIT_TYPE_ERROR = 'EDIT_TYPE_ERROR';
export const GET_CAR_TYPES = 'GET_CAR_TYPES';

export const  addType = async (dispatch , type) => {
  if(type){
    let carRef = collection(db, "carTypes");
    const carDocRef = doc(carRef);
    const newData = {
      id: carDocRef.id,
      name: type
    };
    await setDoc(carDocRef, newData).then(() => {
      dispatch({
        type: ADD_TYPE,
        payload: newData
      })
    }).catch(e => console.log(e));
    return type
  }else{
    dispatch({
      type:ADD_TYPE_ERROR
    })
  }

};

export const  getCarTypes = async (dispatch) => {
  let newData = [];
  const docRef = await collection(db, "carTypes");
  const docsSnap = await getDocs(docRef);
  docsSnap.forEach(doc => {
    newData.push(doc.data());
  });
  dispatch({
    type: GET_CAR_TYPES,
    payload: newData
  });
  return newData
};


export const deleteType = async (dispatch , id) => {
  const docRef = doc(db, "carTypes", id);
  await deleteDoc(docRef).then(() => {
    dispatch({
      type: DELETE_TYPE,
      payload: id
    });
  }).catch(err => {
    console.log(err);
  })
};

export const editType = async (dispatch , type) => {
  if(type){
    const docRef = doc(db, "carTypes", type.id );
    await setDoc(docRef, type).then(() => {
      dispatch({
        type:EDIT_TYPE,
        payload: type
      });
    });
  }else{
    dispatch({
      type:EDIT_TYPE_ERROR
    })
  }

};

export const error = (dispatch , bol) => {
  dispatch({
    type:ERROR,
    payload: bol,
  });
};