import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { isAuthenticated } from '../../../services/Auth'
import Loader from '../../../services/loader/Loader'
import { ToastLeft } from '../../../services/notification/Notification'
import { addDesignationData, fetchDesignationData } from '../../../Redux/slice/Master/Designation'
import { fetchDepartmentData } from '../../../Redux/slice/Master/Department'

export default function DesignationModel({isOpen, onClose}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading,setLoading]  = useState(true)

  const on_submit =  useFormik({
    initialValues : {
        deptName    : '',
        designName  : '',
        description : '',
    },
    validationSchema:yup.object({
        deptName    : yup.string().required("Select atleast one department"),
        designName  : yup.string().required("Designation is required"),
    }),
    onSubmit:(userInputData) => {
      setLoading(true)
        dispatch(addDesignationData(userInputData)).then((res) => {
            const type  = res.payload.result
            const msg   = res.payload.Msg 
            if(res.payload.result === 'success'){
              ToastLeft(msg,type)
              setLoading(true)
              dispatch(fetchDesignationData())
              onClose()
            }
            else if(res.payload.result === 'Failed'){
              ToastLeft(msg,type)
              setLoading(true)
            }
        }).catch((error) => {
            ToastLeft(error.message,"Failed");
        })
    }
  }) 

  const departmentList = useSelector((state) => state.department.departmentList.Data)

  useEffect(() => {
    dispatch(addDesignationData())
    dispatch(fetchDepartmentData())
  },[dispatch])

  if(!isAuthenticated()){
    navigate('/')
  }

  if(!isOpen){
    return null
  }

  return (
    <>
      <Modal show={isOpen} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>New Designation</Modal.Title>
                <span className="d-flex ms-auto" onClick={onClose}><i className='fe fe-x ms-auto' ></i></span>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Department</Form.Label>
                        <select className='form-control' onChange={on_submit.handleChange} required={true} name="deptName" >
                            <option value="">Select Department</option>
                            {
                                departmentList && departmentList.map(res => (
                                    <option key={res.Id} value={res.Id}>{res.DeptName}</option> 
                                ))  
                            }
                        </select>
                        {                              
                            on_submit.touched.deptName && on_submit.errors.deptName ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.deptName}</p> : null
                        }  
                    </Form.Group>

                    <div className="form-group">
                        <Form.Label>Designation</Form.Label>
                        <input className="form-control" name="designName" required type="text" onChange={on_submit.handleChange} placeholder="Enter designation" />
                        {                              
                            on_submit.touched.designName && on_submit.errors.designName ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.designName}</p> : null
                        } 
                    </div>
                    <div className="form-group">
                        <Form.Label>Description</Form.Label>
                        <textarea className="form-control mb-4" onChange={on_submit.handleChange} name="description" required placeholder="Enter description" rows={4}></textarea>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
            {
                loading ? (
                    <>
                        <Button variant="success" onClick={on_submit.handleSubmit}>
                            Save Changes
                        </Button>
                        <Button variant="danger" onClick={onClose}>
                            Close
                        </Button>
                    </>
                ) : (<Loader />)
            }
              
            </Modal.Footer>
        </Modal>
    </>
  )
}
