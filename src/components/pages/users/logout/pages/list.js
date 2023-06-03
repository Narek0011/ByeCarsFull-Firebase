import React, {useEffect, useState} from 'react';
import styles from "../../users.module.css";
import {collection, endBefore, getDocs, limit, orderBy, query, startAfter, where} from "@firebase/firestore";
import {db} from "../../../../../firebaseService";
import * as carAction from "../../../../../redux/actions/carActions";
import * as typeActions from "../../../../../redux/actions/typeActions";
import {connect} from "react-redux";
import Pagination from "../../../../pagination/pagination";
import {useNavigate} from "react-router";
import EditModal from "../../../cars/editForm/editFormModal";
import SpringModal from "../../form/formModal";

const petrolCars = ['all','Газ','Бензин','Гибрид','Электро'];
const sedanTypes = ['Седан','Купе','Универсал'];

const ListCars = (props) => {


  const [open, setOpen] = useState(true);


  const [ showEditForm,setShowEditForm] = useState(false);
  const [ modelCars, setModelCars ] = useState([]);
  const [ filterIdPetrol,setFilterIdPetrol ] = useState('');
  const [ firstDoc,setFirstDoc ] = useState(null);
  const [ lastDoc,setLastDoc ] = useState(null);
  const [ editId,setEditId] = useState('');
  const [ page, setPage] = useState(1);
  const [ showForm,setShowForm ] = useState(false);
  const [ openEdit,setOpenEdit ] = useState(false);
  const [ updateLimit, setUpdateLimit ] = useState(false);


  const navigate = useNavigate();


  const handleSelectChangeTypes = async (event) => {
    const {value} = event.target;
    setFilterIdPetrol(value);
    if(value === 'all'){
      let carsRef = await collection(db, "cars");
      carsRef = query(carsRef);
      props.getCars(carsRef);
    }else{
      let carsRef = await collection(db, "cars");
      carsRef = query(carsRef, where("brandId", "==" , value));
      await props.getCars(carsRef);

      let tRef = await collection(db, "brandCars");
      let typesRef = query(tRef, where("brandId", "==" , value));
      const docsSnap = await getDocs(typesRef);
      let cars = [];
      docsSnap.forEach(doc => {
        let newData = doc.data();
        cars.push(newData)
      });
      setModelCars(cars)
    }
  };

  const handleSelectChangeModels = async (event) => {
    const {value} = event.target;
    let carsRef = await collection(db, "cars");
    if(value === 'all'){
      carsRef = query(carsRef,where('brandId','==', filterIdPetrol));
    }else{
      carsRef = query(carsRef, where("brand", "==" , value),where('brandId','==', filterIdPetrol));
    }
    await props.getCars(carsRef);
  };

  const handleSelectChangePetrol = async (event) => {
    console.log(filterIdPetrol);
    const {value} = event.target;
    console.log(value);
    let carsRef = await collection(db, "cars");
    if(value !== "all"){
      carsRef = query(carsRef,where("petrol", "==" , value),where('brandId','==', filterIdPetrol))
    }else{
      carsRef = query(carsRef,where('brandId','==', filterIdPetrol))
    }
    await  props.getCars(carsRef);
  };

  const handleSelectChangeSedan = async (event) => {
    const { value } = event.target;
    console.log(value);
    let carsRef = await collection(db, "cars");
    if(value !== "sedan"){
      carsRef = query(carsRef,where("sedan", "==" , value),where('brandId','==', filterIdPetrol))
    }else{
      carsRef= query(carsRef,where('brandId','==', filterIdPetrol))
    }
    await  props.getCars(carsRef);
  };

  const changePage = async (value) => {
    const colRef = collection(db, "cars");
    if (value > page && lastDoc) {
      let q = await query(colRef, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(5));
      await props.getCars(q)
    } else if (firstDoc) {
      let q = await query(colRef, orderBy('createdAt', 'desc'), endBefore(firstDoc), limit(5));
      await props.getCars(q)
    }
    setPage(value)
  };

  useEffect(() => {
    if (props.carDocs) {
      setFirstDoc(props.carDocs.docs[0]);
      setLastDoc(props.carDocs.docs[props.carDocs.docs.length - 1]);
    }
  },[props.carDocs]);

  useEffect(() => {
    props.setDataCars(props.cars);
  },[props.cars]);


  useEffect(() => {
    props.getCarTypes()
  },[]);

  useEffect( () => {
    (async () => {
      const colRef = await collection(db, "cars");
      let q = await query(colRef, orderBy('createdAt', 'desc'), limit(5));
      await props.getCars(q);
    })();
  },[updateLimit]);

  const editCars = (id) => {
    props.getCar(id).then(() => {
      setShowForm(false);
      setEditId(id)
    });
  };

  const addCar = () => {
    setOpen(true);
    setShowForm(true);
  };

  const deleteCarInList = (id) => {
    props.deleteCar(id);
    setShowForm(false)
  };

  const navigateCars = (id) => {
    navigate(`/admin/car/${id}`);
  };

  return (
    <div>
       <div className={styles.searching}>
        <div style={{display:"flex"}}>
          <div className={styles.selectTree}>
            <select onChange={handleSelectChangeTypes} className="form-select w-100 h-20  rounded-3" aria-label="Default select example">
              <option selected disabled>type</option>
              <option value='all'>all</option>
              {
                props.type.map(type => {
                  return (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  )
                })
              }
            </select>
          </div>
          <div className={styles.selectTree}>
            <select onChange={handleSelectChangeModels} className="form-select w-100 h-20  rounded-3" aria-label="Default select example">
              <option selected disabled>brand</option>
              <option value='all'>all</option>
              {
                modelCars.map((type,i) => {
                  return (
                    <option key={i} value={type.name}>{type.name}</option>
                  )
                })
              }
            </select>
          </div>
          <div className={styles.selectTree}>
            <select onChange={handleSelectChangePetrol} className="form-select w-100 h-20  rounded-3" aria-label="Default select example">
              <option selected disabled>petrol</option>
              {
                petrolCars.map((type,i) => {
                  return (
                    <option key={i} value={type}>{type}</option>
                  )
                })
              }
            </select>
          </div>
          <div className={styles.selectTree}>
            <select onChange={handleSelectChangeSedan} className="form-select w-100 h-20  rounded-3" aria-label="Default select example">
              <option value="sedan">box...</option>
              {
                sedanTypes.map((type,i) => {
                  return (
                    <option key={i} value={type}>{type}</option>
                  )
                })
              }
            </select>
          </div>
        </div>
        <div>
          <button onClick={addCar} type="button" className="btn btn-primary btn-lg">Add</button>
        </div>
      </div>
          <table className="table fs-3">
            <thead>
            <tr>
              <th scope="col">TYPE</th>
              <th scope="col">BRAND</th>
              <th scope="col">BOX</th>
              <th scope="col">LOCATION</th>
              <th scope="col">MILEAGE</th>
              <th scope="col">PETROL</th>
              <th scope="col">PRICE</th>
              <th scope="col">SALE</th>
              <th scope="col">SEDAN</th>
              <th scope="col">YEAR</th>
              <th scope="col">SETTINGS</th>
            </tr>
            </thead>
            <tbody>
            {
              !props.cars.length ?  <h1>No car of this model found</h1> :  props.cars.map((car)=>(
                <tr key={car.id} style={{cursor:"pointer"}} onClick={() => navigateCars(car.id)}>
                  <td>{car.type}</td>
                  <td>{car.brand}</td>
                  <td>{car.box}</td>
                  <td>{car.location}</td>
                  <td>{car.mileage}</td>
                  <td>{car.petrol}</td>
                  <td>{car.price}</td>
                  <td>{car.sale}</td>
                  <td>{car.sedan}</td>
                  <td>{car.year}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => {
                      setShowEditForm(true)
                      setOpenEdit(true);
                      editCars(car.id)
                    }} type="button" className="btn fs-4 me-2 btn-warning">Edit</button>
                    <button onClick={() => deleteCarInList(car.id)} type="button" className="btn fs-4 btn-danger">Delete</button>
                  </td>
                </tr>
              ))
            }
            </tbody>

            <tfoot className="d-flex justify-content-center">
            <tr>
              <td>
                <Pagination perPage={10} setPage={changePage} dataCars={props.dataCars} page={page}/>
              </td>
            </tr>
            </tfoot>
          </table>
      { showEditForm && <EditModal openEdit={openEdit} id={editId} setShowEditForm={setShowEditForm} carData={props.car} setDataCars={props.setDataCars}/> }
      { showForm && <SpringModal open={open} setOpen={setOpen} updateLimit={updateLimit} setUpdateLimit={setUpdateLimit}  setDataCars={props.setDataCars} setShowForm={setShowForm}/> }

    </div>
  );
};

const mapStateToProps = state => {
  return {
    cars: state.car.cars,
    car: state.car.car,
    carDocs: state.car.carDocs,
    type: state.type.types,
    brandCar:state.brand.defaultModelCars,
    errorMessage:state.car.error
  }
};

const mapDispatchToProps = dispatch => {
  return {
    getCars: (colRef) => carAction.getCars(dispatch, colRef),
    getCar: (colRef) => carAction.getCar(dispatch, colRef),
    deleteCar: (uid) => carAction.deleteCar(dispatch, uid),
    getCarTypes: () => typeActions.getCarTypes(dispatch),
    error: (bool) => carAction.error(dispatch,bool),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ListCars);