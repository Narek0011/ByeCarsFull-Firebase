import { collection, deleteDoc, doc, getDocs, setDoc } from "@firebase/firestore";
import { db } from "../../firebaseService";

export const GET_CAR_BRANDS = 'GET_CAR_BRANDS';
export const ERROR = 'ERROR';
export const ADD_BRAND = 'ADD_BRAND';
export const ADD_BRAND_ERROR = 'ADD_BRAND_ERROR';
export const DELETE_BRAND = 'DELETE_BRAND';
export const DELETE_BRAND_ERROR = 'DELETE_BRAND_ERROR';
export const EDIT_BRAND = 'EDIT_BRAND';
export const EDIT_BRAND_ERROR = 'EDIT_BRAND_ERROR';

export const  getCarBrand = async (dispatch) => {
  let newData = [];
  const docRef = await collection(db, "brandCars");
  const docsSnap = await getDocs(docRef);
  docsSnap.forEach(doc => {
    newData.push(doc.data());
  });
  dispatch({
    type: GET_CAR_BRANDS,
    payload: newData
  });
  return newData
};

export const addBrand = async (dispatch , brand) => {
  let carRef = collection(db, "brandCars");
  const carDocRef = doc(carRef);
  const newData = {
    brandId:brand.brandId,
    name:brand.name,
    id:carDocRef.id
  };
  try {
    let newBrand = await setDoc(carDocRef, newData);
    dispatch({
      type: ADD_BRAND,
      payload: newBrand
    })
  } catch (e) {
    dispatch({
      type:ADD_BRAND_ERROR,
    })
  }
};

export const deleteBrand = async (dispatch , id) => {
  if(id){
    const docRef = doc(db, "brandCars", id);
    await deleteDoc(docRef).then(() => {
      dispatch({
        type: DELETE_BRAND,
        payload: id
      });
    }).catch(err => {
      console.log(err);
    })
  }else{
    dispatch({
      type:DELETE_BRAND_ERROR
    });
  }
};

export const editBrand = async (dispatch , brand) => {
  if(brand){
    const docRef = doc(db, "brandCars", brand.id );
    await setDoc(docRef, brand).then(() => {
      dispatch({
        type:EDIT_BRAND,
        payload: brand,
      });
    });
  }else{
    dispatch({
      type:EDIT_BRAND_ERROR
    })
  }
};

export const error = (dispatch , bol) => {
    dispatch({
      type:ERROR,
      payload: bol,
    });
};