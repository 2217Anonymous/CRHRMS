import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import Loader from '../../../services/loader/Loader'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { isAuthenticated } from '../../../services/Auth'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { ToastLeft } from '../../../services/notification/Notification'
import { addMaritalData, fetchMaritalData } from '../../../Redux/slice/Master/Marital'

export default function MaritalModel({isOpen, onClose}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading,setLoading]  = useState(false)

  const on_submit =  useFormik({
    initialValues : {
        name : '',
        description : ''
    },
    validationSchema:yup.object({
        name : yup.string()
      .required("Marital status is required")
    }),
    onSubmit:(userInputData) => {
      setLoading(true)
        dispatch(addMaritalData(userInputData)).then((res) => {
            const type = res.payload.result
            const msg = res.payload.Msg 
            if(res.payload.result === 'success'){
                ToastLeft(msg,type)
                setLoading(true)
                onClose()
                dispatch(fetchMaritalData())
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

  useEffect(() => {
    dispatch(addMaritalData())
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
            <Modal.Title>New Marital Status</Modal.Title>
            <span className="d-flex ms-auto" onClick={onClose}><i className='fe fe-x ms-auto' ></i></span>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <div className="form-group">
                    <Form.Label>Marital Status</Form.Label>
                    <input className="form-control" name="name" required type="text" onChange={on_submit.handleChange} placeholder="Enter marital status" />
                    {                              
                        on_submit.touched.name && on_submit.errors.name ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.name}</p> : null
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
