import React, {useState,useEffect} from 'react'
import {connect} from "react-redux";
import * as brandActions from '../../redux/actions/brandActions'
import 'bootstrap-icons/font/bootstrap-icons.css';
import * as typeActions from "../../redux/actions/typeActions";

function BrandCars({ addBrand, brand, getCarBrand, getCarTypes, types,deleteBrand,editBrand, errorMessage, error }) {

  const [ addId, setAddId ] = useState('');
  const [ brandData, setBrandData ] = useState({});
  const [ editText, setEditText ] = useState('');
  const [ showEditInp , setShowEditInp ] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      error()
    },1500);
  },[errorMessage]);

  useEffect(() => {
    getCarBrand()
  },[]);

  useEffect(() => {
    getCarTypes()
  },[]);

  useEffect(() => {
    handleChangeTypes();
  }, []);

  const handleChangeTypes = (e) => {
    if(e){
      const {value} = e.target;
      setAddId(value);
    }else{
      const value = null;
      setAddId(value);
    }
  };

  const editingType = () => {
    editBrand(editText);
    setShowEditInp(null)
  };

  return (
    <div className="card w-100 p-5">
      {errorMessage && (
          <div className="alert alert-danger fs-3" role="alert">
            Network Error
          </div>
          )}
      <div >
      <div className='d-flex justify-content-evenly'>
        <div className="w-75">
          <button
            disabled={!brandData.name}
            onClick={() => {
              if (brandData.name) {
                addBrand(brandData);
                brandData.name = ''
              }
            }}
            type="button"
            className="btn btn-info fs-3 me-4 mb-2"
          >Add</button>
          <input value={brandData.name} onChange={e => setBrandData({brandId:addId,name:e.target.value})} type="text" className="form-control w-50 d-inline fs-3 rounded-4 me-5" />
        </div>
           <select onChange={handleChangeTypes} className="form-select d-inline w-25 h-100 fs-3 rounded-4 fst-normal" aria-label="Default select example">
            <option selected disabled> add type </option>
            {
              types.map(({name,id}) => (
                <option key={id} value={id}>{name}</option>
              ))
            }
          </select>
        </div>
      </div>
      <div className="card-body">
        <table className="table">
          <thead>
          <tr>
            <th className="border-bottom-0">Brands</th>
          </tr>
          </thead>
          <tbody className="h-50">
          {
            brand.map((item,i) => (
              <tr key={i}>
                <td>
                  {showEditInp === i && (
                    <>
                      <input  type="text" value={editText.name} onChange={(e) => setEditText({name:e.target.value,id:item.id,brandId:item.brandId})} />
                      <button type="button"  className="btn btn-info" onClick={ editingType }>Save</button>
                    </>
                  )}
                  {showEditInp !== i && item.name}
                </td>
                <td>
                  <button type="button" style={{width:100}} className="btn btn-danger float-end fs-4" onClick={() => deleteBrand(item.id)}><i className="bi bi-trash3 me-2"/>Delete</button>
                  <button type="button" className="btn btn-success float-end fs-4 me-4" onClick={() => {
                    setShowEditInp(i);
                    setEditText({name:item.name})
                  }}><i className="bi bi-pencil-square me-2" /> Edit</button>

                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    brand:state.brand.defaultModelCars,
    types: state.type.types,
    errorMessage:state.brand.error
  }
};

const mapDispatchToProps = dispatch => {
  return {
    addBrand: (brandData) => brandActions.addBrand(dispatch,brandData),
    getCarBrand: () => brandActions.getCarBrand(dispatch),
    deleteBrand:(id) => brandActions.deleteBrand(dispatch,id),
    editBrand:(name) => brandActions.editBrand(dispatch,name),
    error:() => brandActions.error(dispatch),
    getCarTypes: () => typeActions.getCarTypes(dispatch),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(BrandCars);


