import  React , {useState} from 'react';
import {getDownloadURL, ref, uploadBytesResumable} from "@firebase/storage";
import { useForm } from "react-hook-form";
import {  object,string, number } from 'yup';
import {collection, doc, getDocs, query, where} from "@firebase/firestore";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import {connect} from "react-redux";
import {db, storage} from "../../../../firebaseService";
import {yupResolver} from "@hookform/resolvers/yup";
import * as carAction from "../../../../redux/actions/carActions";

const sedanTypes = ['Седан','Купе','Универсал'];
const typeBox = ['Бензин','Газ','Гибрид','Элеткро'];
const boxCars = ['Автомат','Механика'];

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

function SpringModal(props) {

  const schema = object({
    mileage: number(),
    price: number(),
    sale:number(),
    location: string(),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver:yupResolver(schema)
  });

  const [ brand, setBrand ] = useState({});
  const [ modelCars, setModelCars ] = useState([]);
  const [ file, setFile ] = useState(null);

  const handleChangeType = async (e) => {
    const {value} = e.target;
    let dataCar = props.type.filter((car) => car.id === value);
    setBrand(dataCar[0]);
    let carsRef = await collection(db, "brandCars");
    carsRef = query(carsRef, where("brandId", "==" , value));
    const docsSnap = await getDocs(carsRef);
    let cars = [];
    docsSnap.forEach(doc => {
      let newData = doc.data();
      cars.push(newData)
    });
    setModelCars(cars)
  };

  const onSubmit = async data => {
    let carRef = collection(db, "cars");
    const carDocRef = doc(carRef);
    const uploadFilePromise = new Promise(async (resolve, reject) => {
      if (file) {
        const storageRef = ref(storage, `car_images/${carDocRef.id}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        await uploadTask.on("state_changed",
          async () => {
            await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL)
            });
          }
        );
      } else {
        resolve('')
      }
    });
    await uploadFilePromise.then(res => {
      props.add({...data,  brandId: brand.id, type:brand.name, image: res}, carDocRef).then(() => {
        props.setShowForm(false);
        props.setUpdateLimit(!props.updateLimit)
      })
    })
  };


  return (
    <div>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={props.open}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
      >
        <Box sx={style}>
          <Typography id="spring-modal-description" sx={{ mt: 2 }}>
            <div>
              <form className='font-monospace fs-3' onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label>type</label>
                  <select  onChange={handleChangeType} className="form-select fs-3">
                    <option selected disabled>types</option>
                    {
                      props.type.map((item,i) => {
                        return <option key={i} value={item.id}>{item.name}</option>
                      })
                    }
                  </select>
                </div>
                <div>
                  <label>brand</label>
                  <select {...register("brand", { required: true })} className="form-select fs-3">
                    <option selected disabled>brand</option>
                    {
                      modelCars.map((box,i) => (
                        <option key={i} value={box.name}>{box.name}</option>
                      ))
                    }s
                  </select>
                </div>
                <div>
                  <label>petrol</label>
                  <select {...register("petrol", { required: true })} className="form-select fs-3">
                    <option selected>petrol</option>
                    {
                      typeBox.map((box,i) => (
                        <option key={i} value={box}>{box}</option>
                      ))
                    }
                  </select>
                </div>
                <div>
                  <label>sedan</label>
                  <select {...register("sedan", { required: true })} className="form-select fs-3">
                    <option selected>sedan</option>
                    {
                      sedanTypes.map((box,i) => (
                        <option key={i} value={box}>{box}</option>
                      ))
                    }
                  </select>
                </div>
                <div>
                  <label>box</label>
                  <select {...register("box", { required: true })} className="form-select fs-3">
                    <option selected>box</option>
                    {
                      boxCars.map((box,i) => (
                        <option key={i} value={box}>{box}</option>
                      ))
                    }
                  </select>
                </div>

                <div>
                  <label>year</label>
                  <input type="date" min="2000-01-01" max="2023-12-31" className="form-control h-25 fs-3" placeholder="year" {...register("year", { required: true  })} />
                </div>
                <div>
                  <label>location</label>
                  <input className="form-control h-25 fs-3" placeholder='location' {...register("location", { required: true })} />
                </div>
                <div>
                  <label>mileage</label>
                  <input className="form-control h-25 fs-3" placeholder="mileage" {...register("mileage", { required: true })} />
                </div>
                <div>
                  <label>price</label>
                  <input className="form-control h-25 fs-3" placeholder="price" {...register("price", { required: true })} />
                </div>
                <div>
                  <label>sale</label>
                  <input className="form-control h-25 fs-3" placeholder="sale" {...register("sale", { required: true })} />
                </div>
                <div>
                  <label>image</label>
                  <input type="file" className="form-control h-25 mb-2 fs-3" placeholder="image url" onChange={(e) => setFile(e.target.files[0])} />
                </div>
                <button type="submit" className="btn btn-success me-2 fs-3 p-1">Отправить</button>
                <button type="button" className="btn btn-danger fs-3 p-1" onClick={() => props.setShowForm(false)}>Close</button>
              </form>
              <span>{errors.message}</span>
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
    type: state.type.types,
    brandCars:state.brand.defaultModelCars,
    brand:state.brand.defaultModelCars,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    getCars: (colRef) => carAction.getCars(dispatch, colRef),
    add: (data, carDocRef) => carAction.add(dispatch, data, carDocRef),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SpringModal);
