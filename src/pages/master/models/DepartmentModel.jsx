import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import Loader from '../../../services/loader/Loader'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { ToastLeft } from '../../../services/notification/Notification'
import { useDispatch } from 'react-redux'
import { addDepartmentData, fetchDepartmentData } from '../../../Redux/slice/Master/Department'
import { isAuthenticated } from '../../../services/Auth'
import { useNavigate } from 'react-router-dom'

export default function DepartmentModel({isOpen, onClose}) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading,setLoading] = useState(false)

    const on_submit =  useFormik({
        initialValues : {
            deptName : '',
          description : ''
        },
        validationSchema:yup.object({
            deptName : yup.string()
          .required("department is required")
        }),
        onSubmit:(userInputData) => {
          setLoading(true)
            dispatch(addDepartmentData(userInputData)).then((res) => {
                onClose()
                const type = res.data.result
                const msg = res.data.Msg 
                if(res.data.result === 'success'){
                    ToastLeft(msg,type)
                    setLoading(true)
                    dispatch(fetchDepartmentData())
                }
                else if(res.data.result === 'Failed'){
                    ToastLeft(msg,type)
                    setLoading(true)
                }
            }).catch((error) => {
                ToastLeft(error.message,"Failed");
            })
        }
    }) 

    useEffect(() => {
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
                <Modal.Title>New Department</Modal.Title>
                <span className="d-flex ms-auto" onClick={isOpen}><i className='fe fe-x ms-auto' ></i></span>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <div className="form-group">
                        <Form.Label>Department</Form.Label>
                        <input className="form-control" name="deptName" required type="text" onChange={on_submit.handleChange} placeholder="Enter department" />
                        {                              
                            on_submit.touched.deptName &&  on_submit.errors.deptName ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.deptName}</p> : null
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
                !loading ? (
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
