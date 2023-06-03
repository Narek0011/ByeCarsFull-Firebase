// import React, {useEffect, useState} from 'react';
// import {connect} from 'react-redux';
// import {Route, Routes, useNavigate} from "react-router";
// import {collection, endBefore, getDocs, limit, orderBy, query, startAfter, where} from "@firebase/firestore";
// import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import MuiDrawer from '@mui/material/Drawer';
// import Box from '@mui/material/Box';
// import MuiAppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import List from '@mui/material/List';
// import Typography from '@mui/material/Typography';
// import Divider from '@mui/material/Divider';
// import IconButton from '@mui/material/IconButton';
// import Container from '@mui/material/Container';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import Pagination from "../../pagination/pagination";
// import LogOut from "./logout/logOut";
// import EditModal from "../cars/editForm/editFormModal";
// import styles from './users.module.css'
// import selectPng from '../../../assets/images/select.png'
// import * as carAction from '../../../redux/actions/carActions';
// import ModalDialog from '../../carDate/typeCar'
// import BrandCars from "../../carDate/brandCars";
// import * as typeActions from '../../../redux/actions/typeActions'
// import SpringModal from "./form/formModal";
// import {db} from "../../../firebaseService";
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import GarageIcon from '@mui/icons-material/Garage';
// import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import {Link} from "react-router-dom";
// import ListCars from "./logout/pages/list";
//
// const petrolCars = ['all','Газ','Бензин','Гибрид','Электро'];
// const sedanTypes = ['Седан','Купе','Универсал'];
// const drawerWidth = 200;
//
// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== 'open',
// })(({ theme, open }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(['width', 'margin'], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open && {
//     marginLeft: drawerWidth,
//     width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(['width', 'margin'], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));
// const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
//   ({ theme, open }) => ({
//     '& .MuiDrawer-paper': {
//       position: 'relative',
//       whiteSpace: 'nowrap',
//       width: drawerWidth,
//       transition: theme.transitions.create('width', {
//         easing: theme.transitions.easing.sharp,
//         duration: theme.transitions.duration.enteringScreen,
//       }),
//       boxSizing: 'border-box',
//       ...(!open && {
//         overflowX: 'hidden',
//         transition: theme.transitions.create('width', {
//           easing: theme.transitions.easing.sharp,
//           duration: theme.transitions.duration.leavingScreen,
//         }),
//         width: theme.spacing(7),
//         [theme.breakpoints.up('sm')]: {
//           width: theme.spacing(9),
//         },
//       }),
//     },
//   }),
// );
// const mdTheme = createTheme();
//
// function DashboardContent(props) {
//
//   const [open, setOpen] = React.useState(true);
//   const toggleDrawer = () => {
//     setOpen(!open);
//   };
//
//   const [ showTable,setShowTable ] = useState(false);
//   const [ dataCars,setDataCars ] = useState(props.cars);
//   const [ firstDoc,setFirstDoc ] = useState(null);
//   const [ lastDoc,setLastDoc ] = useState(null);
//   const [ showForm,setShowForm ] = useState(false);
//   const [ showEditForm,setShowEditForm] = useState(false);
//   const [ editId,setEditId] = useState('');
//   const [ page, setPage] = useState(1);
//   const [ modelCars, setModelCars ] = useState([]);
//   const [ showModalType,setShowModalType ] = useState(false);
//   const [ showBrandTypes,setShowBrandTypes ] = useState(false);
//   const [ openEdit,setOpenEdit ] = useState(false);
//   const [ filterIdPetrol,setFilterIdPetrol ] = useState('');
//   const [ adminName, setAdminName ] = useState('');
//   const [ logOut, setLogOut ] = useState(false);
//   const navigate = useNavigate();
//
//   useEffect(() => {
//     setTimeout(() => {
//       props.error(false)
//     },1500)
//   },[props.errorMessage]);
//
//   useEffect(() => {
//     props.setShowHeaderAndFooter(false);
//   },[]);
//
//   const editCars = (id) => {
//     props.getCar(id).then(() => {
//       setShowEditForm(true);
//       setEditId(id)
//     });
//   };
//
//   useEffect(() => {
//     props.getCarTypes()
//   },[]);
//
//   useEffect( () => {
//     (async () => {
//       const colRef = await collection(db, "cars");
//       let q = await query(colRef, orderBy('createdAt', 'desc'), limit(5));
//       await props.getCars(q);
//     })();
//   },[]);
//
//   useEffect( () => {
//     (async () => {
//       const colRef = await collection(db, "admin");
//       let q = await query(colRef);
//       const docsSnap = await getDocs(q);
//       let admin = {};
//       docsSnap.forEach(doc => {
//         admin = doc.data();
//       });
//       setAdminName(admin.name);
//     })();
//   },[]);
//
//
//   useEffect(() => {
//     if (props.carDocs) {
//       setFirstDoc(props.carDocs.docs[0]);
//       setLastDoc(props.carDocs.docs[props.carDocs.docs.length - 1]);
//     }
//   },[props.carDocs]);
//
//   useEffect(() => {
//     setDataCars(props.cars);
//   },[props.cars]);
//
//   const changePage = async (value) => {
//     const colRef = collection(db, "cars");
//     if (value > page && lastDoc) {
//       let q = await query(colRef, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(5));
//       props.getCars(q)
//     } else if (firstDoc) {
//       let q = await query(colRef, orderBy('createdAt', 'desc'), endBefore(firstDoc), limit(5));
//       props.getCars(q)
//     }
//     setPage(value)
//   };
//
//   const deleteCarInList = (id) => {
//     props.deleteCar(id)
//   };
//
//   const addCar = () => {
//     setOpen(true);
//     setShowModalType(false);
//     setShowForm(true);
//   };
//
//   const navigateCars = (id) => {
//     navigate(`/admin/car/${id}`);
//   };
//
//   const handleSelectChangeTypes = async (event) => {
//     const {value} = event.target;
//     setFilterIdPetrol(value);
//     if(value === 'all'){
//       let carsRef = await collection(db, "cars");
//       carsRef = query(carsRef);
//       props.getCars(carsRef);
//     }else{
//       let carsRef = await collection(db, "cars");
//       carsRef = query(carsRef, where("brandId", "==" , value));
//       await props.getCars(carsRef);
//
//       let tRef = await collection(db, "brandCars");
//       let typesRef = query(tRef, where("brandId", "==" , value));
//       const docsSnap = await getDocs(typesRef);
//       let cars = [];
//       docsSnap.forEach(doc => {
//         let newData = doc.data();
//         cars.push(newData)
//       });
//       setModelCars(cars)
//     }
//   };
//
//   const handleSelectChangeModels = async (event) => {
//     const {value} = event.target;
//     let carsRef = await collection(db, "cars");
//     if(value === 'all'){
//       carsRef = query(carsRef,where('brandId','==', filterIdPetrol));
//     }else{
//       carsRef = query(carsRef, where("brand", "==" , value),where('brandId','==', filterIdPetrol));
//     }
//     await props.getCars(carsRef);
//   };
//
//   const handleSelectChangePetrol = async (event) => {
//     console.log(filterIdPetrol);
//     const {value} = event.target;
//     console.log(value);
//     let carsRef = await collection(db, "cars");
//     if(value !== "all"){
//       carsRef = query(carsRef,where("petrol", "==" , value),where('brandId','==', filterIdPetrol))
//     }else{
//       carsRef = query(carsRef,where('brandId','==', filterIdPetrol))
//     }
//     await  props.getCars(carsRef);
//   };
//
//   const handleSelectChangeSedan = async (event) => {
//     const { value } = event.target;
//     console.log(value);
//     let carsRef = await collection(db, "cars");
//     if(value !== "sedan"){
//       carsRef = query(carsRef,where("sedan", "==" , value),where('brandId','==', filterIdPetrol))
//     }else{
//       carsRef= query(carsRef,where('brandId','==', filterIdPetrol))
//     }
//     await  props.getCars(carsRef);
//   };
//
//   return (
//     <ThemeProvider theme={mdTheme}>
//       <Box sx={{ display: 'flex' }}>
//         <CssBaseline />
//         <AppBar position="absolute" open={open}>
//           <Toolbar
//             sx={{
//               pr: '24px',
//             }}
//           >
//             <IconButton
//               edge="start"
//               color="inherit"
//               aria-label="open drawer"
//               onClick={ toggleDrawer }
//               sx={{
//                 marginRight: '36px',
//                 ...(open && { display: 'none' }),
//               }}
//             >
//               <img src={selectPng} alt=""/>
//             </IconButton>
//             <Typography
//               component="h1"
//               variant="h6"
//               color="inherit"
//               noWrap
//               sx={{ flexGrow: 1 }}
//             >
//             </Typography>
//
//
//             <Box sx={{ minWidth: 120,backgroundColor:"while" }}>
//               <FormControl fullWidth>
//                 <Select
//                   style={{backgroundColor:'white',fontSize:17,height:35}}
//                   labelId="demo-simple-select-label"
//                   id="demo-simple-select"
//                   value={adminName}
//                   onChange={() => setLogOut(true)}
//                 >
//                   <MenuItem style={{fontSize:17}} selected disabled value={adminName}>{adminName}</MenuItem>
//                   <MenuItem style={{fontSize:17}} value={true}>Log Out</MenuItem>
//                 </Select>
//               </FormControl>
//             </Box>
//
//           </Toolbar>
//         </AppBar>
//         <Drawer variant="permanent" open={open}>
//           <Toolbar
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'flex-end',
//               px: [1],
//             }}
//           >
//             <IconButton onClick={toggleDrawer}>
//               <img src={selectPng} alt=""/>
//             </IconButton>
//           </Toolbar>
//           <Divider />
//           <List component="nav">
//
//             <ListItemButton
//               style={{color: showTable ? 'red' : 'black'}}
//               onClick={() => {
//                 setShowTable(!showTable);
//                 setShowModalType(false);
//                 setShowBrandTypes(false);
//               }}>
//               <ListItemIcon>
//                 <AssignmentIcon style={{fontSize:"large"}}/>
//               </ListItemIcon>
//               <ListItemText sx={{ fontSize: 17 }} disableTypography >Car List</ListItemText>
//             </ListItemButton>
//
//             <ListItemButton
//               style={{color: showModalType ? 'red' : 'black',fontSize:"large"}}
//               onClick={() => {
//                 setShowTable(false);
//                 setShowModalType(!showModalType);
//                 setShowBrandTypes(false);
//               }}>
//               <ListItemIcon>
//                 <GarageIcon style={{fontSize:"large"}}/>
//               </ListItemIcon>
//               <ListItemText sx={{ fontSize: 17 }} disableTypography >Car Types</ListItemText>
//             </ListItemButton>
//
//             <ListItemButton
//               style={{color: showBrandTypes ? 'red' : 'black'}}
//               onClick={() => {
//                 setShowTable(false);
//                 setShowModalType(false);
//                 setShowBrandTypes(!showBrandTypes);
//               }} >
//               <ListItemIcon>
//                 <DepartureBoardIcon style={{fontSize:"large"}}/>
//               </ListItemIcon>
//               <ListItemText sx={{ fontSize: 17 }} disableTypography >Car Brands</ListItemText>
//             </ListItemButton>
//
//             <Link to="/admin/cars/list">Car list</Link>
//
//
//             <Divider sx={{ my: 1 }} />
//           </List>
//         </Drawer>
//         <Box
//           component="main"
//           sx={{
//             backgroundColor: (theme) =>
//               theme.palette.mode === 'light'
//                 ? theme.palette.grey[100]
//                 : theme.palette.grey[900],
//             flexGrow: 1,
//             height: '100vh',
//             overflow: 'auto',
//           }}
//         >
//           <Toolbar />
//           <Container maxWidth="1000" sx={{ mt: 4, mb: 4 }}>
//
//             <Routes>
//                 <Route path="/list" element={<ListCars/>}/>
//             </Routes>
//
//             <div className={styles.container}>
//               <div>
//                 {
//                   props.errorMessage && (
//                     <div className="alert alert-danger fs-3" role="alert">
//                       This is a danger alert—check it out!
//                     </div>
//                   )
//                 }
//                 { showTable && (<div className={styles.searching}>
//
//                   <div style={{display:"flex"}}>
//                     <div className={styles.selectTree}>
//                       <select onChange={handleSelectChangeTypes} className="form-select w-100 h-20  rounded-3" aria-label="Default select example">
//                         <option selected disabled>type</option>
//                         <option value='all'>all</option>
//                         {
//                           props.type.map(type => {
//                             return (
//                               <option key={type.id} value={type.id}>{type.name}</option>
//                             )
//                           })
//                         }
//                       </select>
//                     </div>
//                     <div className={styles.selectTree}>
//                       <select onChange={handleSelectChangeModels} className="form-select w-100 h-20  rounded-3" aria-label="Default select example">
//                         <option selected disabled>brand</option>
//                         <option value='all'>all</option>
//                         {
//                           modelCars.map((type,i) => {
//                             return (
//                               <option key={i} value={type.name}>{type.name}</option>
//                             )
//                           })
//                         }
//                       </select>
//                     </div>
//                     <div className={styles.selectTree}>
//                       <select onChange={handleSelectChangePetrol} className="form-select w-100 h-20  rounded-3" aria-label="Default select example">
//                         <option selected disabled>petrol</option>
//                         {
//                           petrolCars.map((type,i) => {
//                             return (
//                               <option key={i} value={type}>{type}</option>
//                             )
//                           })
//                         }
//                       </select>
//                     </div>
//                     <div className={styles.selectTree}>
//                       <select onChange={handleSelectChangeSedan} className="form-select w-100 h-20  rounded-3" aria-label="Default select example">
//                         <option value="sedan">box...</option>
//                         {
//                           sedanTypes.map((type,i) => {
//                             return (
//                               <option key={i} value={type}>{type}</option>
//                             )
//                           })
//                         }
//                       </select>
//                     </div>
//                   </div>
//                   <div>
//                     <button onClick={addCar} type="button" className="btn btn-primary btn-lg">Add</button>
//                   </div>
//                 </div>)}
//                 <div className='m-0'>
//                   {
//                     showTable && (
//                       <table className="table fs-3">
//                         <thead>
//                         <tr>
//                           <th scope="col">TYPE</th>
//                           <th scope="col">BRAND</th>
//                           <th scope="col">BOX</th>
//                           <th scope="col">LOCATION</th>
//                           <th scope="col">MILEAGE</th>
//                           <th scope="col">PETROL</th>
//                           <th scope="col">PRICE</th>
//                           <th scope="col">SALE</th>
//                           <th scope="col">SEDAN</th>
//                           <th scope="col">YEAR</th>
//                           <th scope="col">SETTINGS</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {
//                           !props.cars.length ?  <h1>No car of this model found</h1> :  props.cars.map((car)=>(
//                             <tr key={car.id} style={{cursor:"pointer"}} onClick={() => navigateCars(car.id)}>
//                               <td>{car.type}</td>
//                               <td>{car.brand}</td>
//                               <td>{car.box}</td>
//                               <td>{car.location}</td>
//                               <td>{car.mileage}</td>
//                               <td>{car.petrol}</td>
//                               <td>{car.price}</td>
//                               <td>{car.sale}</td>
//                               <td>{car.sedan}</td>
//                               <td>{car.year}</td>
//                               <td onClick={(e) => e.stopPropagation()}>
//                                 <button onClick={() => {
//                                   setOpenEdit(true);
//                                   editCars(car.id)
//                                 }} type="button" className="btn fs-4 me-2 btn-warning">Edit</button>
//                                 <button onClick={() => deleteCarInList(car.id)} type="button" className="btn fs-4 btn-danger">Delete</button>
//                               </td>
//                             </tr>
//                           ))
//                         }
//                         </tbody>
//
//                         <tfoot className="d-flex justify-content-center">
//                         <tr>
//                           <td>
//                             <Pagination perPage={10} setPage={changePage} dataCars={dataCars} page={page}/>
//                           </td>
//                         </tr>
//                         </tfoot>
//                       </table>)
//                   }
//                   { showEditForm && <EditModal openEdit={openEdit} id={editId} setShowEditForm={setShowEditForm} carData={props.car} setDataCars={setDataCars}/> }
//                   { showModalType && <ModalDialog setShowModalType={setShowModalType}/> }
//                   { showBrandTypes && <BrandCars/>}
//                   { showForm && <SpringModal open={open} setOpen={setOpen}  setDataCars={setDataCars} setShowForm={setShowForm}/> }
//                   { logOut && <LogOut logOut={logOut} setLogOut={setLogOut}/>
//                   }
//                 </div>
//               </div>
//             </div>
//           </Container>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// }
//
// const mapStateToProps = state => {
//   return {
//     cars: state.car.cars,
//     car: state.car.car,
//     carDocs: state.car.carDocs,
//     type: state.type.types,
//     brandCar:state.brand.defaultModelCars,
//     errorMessage:state.car.error
//   }
// };
//
// const mapDispatchToProps = dispatch => {
//   return {
//     getCars: (colRef) => carAction.getCars(dispatch, colRef),
//     getCar: (colRef) => carAction.getCar(dispatch, colRef),
//     deleteCar: (uid) => carAction.deleteCar(dispatch, uid),
//     getCarTypes: () => typeActions.getCarTypes(dispatch),
//     error: (bool) => carAction.error(dispatch,bool),
//   }
// };
//
// export default connect(mapStateToProps, mapDispatchToProps)(DashboardContent);

import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Route, Routes} from "react-router";
import {collection,  getDocs,  query } from "@firebase/firestore";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogOut from "./logout/logOut";
import styles from './users.module.css'
import selectPng from '../../../assets/images/select.png'
import * as carAction from '../../../redux/actions/carActions';
import ModalDialog from '../../carDate/typeCar'
import BrandCars from "../../carDate/brandCars";
import * as typeActions from '../../../redux/actions/typeActions'
import {db} from "../../../firebaseService";
import AssignmentIcon from '@mui/icons-material/Assignment';
import GarageIcon from '@mui/icons-material/Garage';
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {Link} from "react-router-dom";
import ListCars from "./logout/pages/list";

const drawerWidth = 200;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);
const mdTheme = createTheme();

function DashboardContent(props) {

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [ showTable,setShowTable ] = useState(false);
  const [ dataCars,setDataCars ] = useState(props.cars);


  const [ showModalType,setShowModalType ] = useState(false);
  const [ showBrandTypes,setShowBrandTypes ] = useState(false);
  const [ adminName, setAdminName ] = useState('');
  const [ logOut, setLogOut ] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      props.error(false)
    },1500)
  },[props.errorMessage]);

  useEffect(() => {
    props.setShowHeaderAndFooter(false);
  },[]);

  useEffect( () => {
    (async () => {
      const colRef = await collection(db, "admin");
      let q = await query(colRef);
      const docsSnap = await getDocs(q);
      let admin = {};
      docsSnap.forEach(doc => {
        admin = doc.data();
      });
      setAdminName(admin.name);
    })();
  },[]);



  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px',
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={ toggleDrawer }
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <img src={selectPng} alt=""/>
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
            </Typography>


            <Box sx={{ minWidth: 120,backgroundColor:"while" }}>
              <FormControl fullWidth>
                <Select
                  style={{backgroundColor:'white',fontSize:17,height:35}}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={adminName}
                  onChange={() => setLogOut(true)}
                >
                  <MenuItem style={{fontSize:17}} selected disabled value={adminName}>{adminName}</MenuItem>
                  <MenuItem style={{fontSize:17}} value={true}>Log Out</MenuItem>
                </Select>
              </FormControl>
            </Box>

          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <img src={selectPng} alt=""/>
            </IconButton>
          </Toolbar>
          <Divider/>
          <List component="nav">
            <Link style={{textDecoration:'none'}} to="/admin/cars/list">
            <ListItemButton
              style={{color: showTable ? 'red' : 'black'}}
              onClick={() => {
                setShowTable(true);
                setShowModalType(false);
                setShowBrandTypes(false);
              }}
              >
              <ListItemIcon>
                <AssignmentIcon style={{fontSize:"large"}}/>
              </ListItemIcon>
              <ListItemText sx={{ fontSize: 17 }} disableTypography >Car List</ListItemText>
            </ListItemButton>
          </Link>

            <Link style={{textDecoration:'none'}} to="/admin/cars/types">
            <ListItemButton
              style={{color: showModalType ? 'red' : 'black',fontSize:"large"}}
              onClick={() =>{
                setShowModalType(true);
                setShowBrandTypes(false);
                setShowTable(false);
              }}
              >
              <ListItemIcon>
                <GarageIcon style={{fontSize:"large"}}/>
              </ListItemIcon>
              <ListItemText sx={{ fontSize: 17 }} disableTypography >Car Types</ListItemText>
            </ListItemButton>
            </Link>

            <Link style={{textDecoration:'none'}} to="/admin/cars/brands">
            <ListItemButton
              style={{color: showBrandTypes ? 'red' : 'black'}}
              onClick={() => {
                setShowBrandTypes(true);
                setShowModalType(false);
                setShowTable(false);
              }}
               >
              <ListItemIcon>
                <DepartureBoardIcon style={{fontSize:"large"}}/>
              </ListItemIcon>
              <ListItemText sx={{ fontSize: 17 }} disableTypography >Car Brands</ListItemText>
            </ListItemButton>
            </Link>

            <Divider sx={{ my: 1 }} />
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="1000" sx={{ mt: 4, mb: 4 }}>
            <div>
              {
                props.errorMessage && (
                  <div className="alert alert-danger fs-3" role="alert">
                    Network Error
                  </div>
                )
              }
              <div className='m-0'>
                {logOut && <LogOut logOut={logOut} setLogOut={setLogOut}/>}
              </div>
            </div>

            <Routes>
              <Route path="/list" element={<ListCars setShowModalType={setShowModalType} dataCars={dataCars} setDataCars={setDataCars}/>}/>
              <Route path="/types" element={<ModalDialog  setShowModalType={setShowModalType}/>}/>
              <Route path="/brands" element={<BrandCars/>}/>
            </Routes>


          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

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
    error: (bool) => carAction.error(dispatch,bool),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContent);





