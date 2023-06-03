import React, {useEffect, useState} from 'react'
import * as typeActions from "../../redux/actions/typeActions";
import {connect} from "react-redux";


function ModalDialog({deleteType,addType,editType, getCarTypes,types,errorMessage,error }) {

  const [typeCar,setTypeCars] = useState('');
  const [editText,setEditText] = useState('');
  const [showEditInp ,setShowEditInp] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      error()
    },1500);
  },[errorMessage]);

  useEffect(() => {
    getCarTypes()
  },[]);

  const addTypeCar = () => {
    if(typeCar){
      addType(typeCar);
      setTypeCars('')
    }
  };

  const editingType = () => {
    editType(editText);
    setShowEditInp(null)
  };

  return (
    <div className='card w-100 mt-5 p-5'>
      {
        errorMessage && (
          <div className="alert alert-danger fs-3" role="alert">
            This is a danger alert—check it out!
          </div>
        )
      }
          <div>
            <div>
              <button onClick={ addTypeCar } type="button" className="btn btn-info fs-3 me-4 mb-2"><i className="bi bi-car-front-fill me-2"/>Add</button>
              <input value={typeCar} onChange={(e) => setTypeCars(e.target.value)} type="text" className='form-control w-50 d-inline fs-3 rounded-4 me-5'/>
            </div>
          </div>
      <div className="card-body">
        <table className="table">
          <thead>
          <tr>
            <th className="border-bottom-0" scope="col">Types</th>
          </tr>
          </thead>
          <tbody>
          {
            types.map((item,i) => (
              <tr key={i}>
                <td> {showEditInp === i && (
                  <>
                    <input className="me-2" value={editText.name}  type="text" onChange={(e) => setEditText({name:e.target.value,id:item.id})} />
                    <button type="button" className="btn btn-info" onClick={ editingType }>Save</button>
                  </>
                )} {showEditInp !== i && item.name}
                </td>

                <td>
                  <button style={{width:100}} type="button" className="btn btn-danger float-end fs-4" onClick={() => deleteType( item.id ) }><i className="bi bi-trash3 me-2"/> Delete</button>
                  <button style={{width:100}} type="button" className="btn btn-success float-end fs-4 me-4" onClick={() =>{
                    setShowEditInp(i);
                    setEditText({name:item.name})
                  }}><i className="bi bi-pencil-square me-2" />Edit</button>
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
    cars: state.car.cars,
    carDocs: state.car.carDocs,
    types: state.type.types,
    errorMessage:state.type.error
  }
};

const mapDispatchToProps = dispatch => {
  return {
    deleteType: (id) => typeActions.deleteType(dispatch, id),
    addType: (type) => typeActions.addType(dispatch,type),
    editType: (type) => typeActions.editType(dispatch,type),
    getCarTypes: () => typeActions.getCarTypes(dispatch),
    error: () => typeActions.error(dispatch),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalDialog);
