import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import * as carAction from "../../../../redux/actions/carActions";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { number, object, string } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as brandAction from '../../../../redux/actions/brandActions'
import {getDownloadURL, ref, uploadBytesResumable} from "@firebase/storage";
import { storage } from "../../../../firebaseService";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: 0,
  boxShadow: 24,
  p: 4,
};

const typeBox = ['Бензин','Газ','Гибрид','Элеткро'];
const sedanTypes = ['Седан','Купе','Универсал'];
const boxCars = ['Автомат','Механика'];

function EditModal({ update, setShowEditForm, id, typeCars, brandCars, openEdit, getCarBrand, carData }) {

  const [ type, setType ] = useState('');
  const [ modelCars, setModelCars ] = useState([]);
  const [ file, setFile ] = useState(null);

  useEffect(() => {
    getCarBrand()
  }, []);

  const schema = object({
    mileage: number(),
    price: number(),
    sale:number(),
    location: string(),
  });

  const { register, handleSubmit,setValue, formState: { errors } } = useForm({
    resolver:yupResolver(schema)
  });

  useEffect(() => {
    setValue('year',carData.year);
    setValue('location',carData.location);
    setValue('mileage',carData.mileage);
    setValue('price',carData.price);
    setValue('sale',carData.sale);
    setValue('brand',carData.type);
    setValue('petrol',carData.petrol);
    setValue('sedan',carData.sedan);
    setValue('box',carData.box);
  },[carData]);

  const onSubmit = async data => {
    const uploadFilePromise = new Promise(async (resolve, reject) => {
      if (file) {
        const storageRef = ref(storage, `car_images/${carData.id}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        await uploadTask.on("state_changed",
          (snapshot) => {
            console.log(snapshot);
          },
          (error) => {
            reject(error);
          },
          async () => {
            await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      } else {
        resolve('')
      }
    });
    await uploadFilePromise.then((res) => {
      update({...data,id,type: type.name, image: res, brandId:type.id, createdAt: new Date().getTime().toString()}).then(() => {
        setShowEditForm(false)
      })
    })
  };

  const handleChangeType = (e) => {
    const {value} = e.target;
    let dataCar = typeCars.filter((car) => car.id === value);
    let modelCar = brandCars.filter((model) => model.brandId === value);
    setModelCars(modelCar);
    setType(dataCar[0]);
  };

  useEffect(() => {
    const value = carData.brandId;
    let dataCar = typeCars.filter((car) => car.id === value);
    let modelCar = brandCars.filter((model) => model.brandId === value);
    if(dataCar[0]){
      setType(dataCar[0]);
    }
    setModelCars(modelCar);
  },[carData]);

  const handleFile = (e) => {
    const file =  e.target.files[0];
    setFile(file);
  };

  return (
    <div>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={openEdit}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
      >
        <Box sx={style}>
          <Typography id="spring-modal-description" sx={{ mt: 2 }}>
            <div>
              <form className="font-monospace fs-3" onSubmit={handleSubmit(onSubmit)}>
                <div style={{display:"inline"}}>
                  <label>type</label>
                  <select onChange={handleChangeType} className="form-select fs-3">
                    <option value={type.id}>{type.name}</option>
                    {
                      typeCars.map((type,i) => (
                        <option key={i} value={type.id}>{type.name}</option>
                      ))
                    }
                  </select>
                </div>
                <div>
                  <label >model</label>
                  <select {...register("brand", { required: true })} className="form-select me-2 fs-3">
                    <option selected disabled value={carData.type}>{carData.brand}</option>
                    {
                      modelCars.map((model,i) => (
                        <option key={i} value={model.name}>{model.name}</option>
                      ))
                    }
                  </select>
                </div>
                <div>
                  <label>petrol</label>
                  <select {...register("petrol", { required: true })} className="form-select me-2 fs-3">
                    {
                      typeBox.map((petrol,i) => (
                        <option key={i} value={petrol}>{petrol}</option>
                      ))
                    }
                  </select>
                </div>
                <div>
                  <label>sedan</label>
                  <select {...register("sedan", { required: true })} className="form-select me-2 fs-3">
                    {
                      sedanTypes.map((petrol,i) => (
                        <option key={i} value={petrol}>{petrol}</option>
                      ))
                    }
                  </select>
                </div>
                <div>
                  <label>box</label>
                  <select {...register("box", { required: true })} className="form-select me-2 fs-3">
                    {
                      boxCars.map((petrol,i) => (
                        <option key={i} value={petrol}>{petrol}</option>
                      ))
                    }
                  </select>
                </div>
                <div>
                  <label>year</label>
                  <input type='date' min="2000-01-01" max="2023-12-31" className="form-control h-25  fs-3" placeholder="year" {...register("year", { required: true })} />
                </div>
                <div>
                  <label>location</label>
                  <input className="form-control h-25  fs-3" placeholder="location" {...register("location", { required: true })} />
                </div>
                <div>
                  <label>mileage</label>
                  <input className="form-control h-25  fs-3" placeholder="mileage" {...register("mileage", { required: true })} />
                </div>
                <div>
                  <label>price</label>
                  <input className="form-control h-25  fs-3" placeholder="price" {...register("price", { required: true })} />
                </div>
                <div>
                  <label>sale</label>
                  <input className="form-control h-25  fs-3" placeholder="sale" {...register("sale", { required: true })} />
                </div>
                <div>
                  <label>image</label>
                  <input type='file' className="form-control mb-2 h-25  fs-3" placeholder="image" onChange={handleFile} />
                </div>
                <button type="submit" className="btn fs-4 me-2 btn-success">Save</button>
                <button onClick={() => setShowEditForm(false)} type="button" className="btn fs-4 btn-danger">Close</button>
              </form>
            </div>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    cars: state.car.cars,
    carDocs: state.car.carDocs,
    typeCars: state.type.types,
    brandCars:state.brand.defaultModelCars,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    getCars : (colRef) => carAction.getCars(dispatch, colRef),
    getCar : (id) => carAction.getCar(dispatch, id),
    add : (data) => carAction.add(dispatch, data),
    update : (data) => carAction.update(dispatch,data),
    getCarBrand : () => brandAction.getCarBrand(dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(EditModal);















