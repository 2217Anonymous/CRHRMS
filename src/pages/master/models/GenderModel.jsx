import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import Loader from '../../../services/loader/Loader'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addGenderData, fetchGenderData } from '../../../Redux/slice/Master/Gender'
import { isAuthenticated } from '../../../services/Auth'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { ToastLeft } from '../../../services/notification/Notification'

export default function GenderModel({isOpen, onClose}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading,setLoading]  = useState(false)

  useEffect(() => {
    dispatch(addGenderData())
  },[dispatch])

  const on_submit =  useFormik({
    initialValues : {
        gander : '',
    },
    validationSchema:yup.object({
      gander : yup.string().required("Gander is required")
    }),
    onSubmit:(userInputData) => {
      setLoading(false)
      dispatch(addGenderData(userInputData)).then((res) => {
            const type = res.payload.result
            const msg = res.payload.Msg 
            if(res.payload.result === 'success'){
              ToastLeft(msg,type)
              setLoading(false)
              dispatch(fetchGenderData())
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

  useEffect(() => {
    dispatch(addGenderData())
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
                <Modal.Title>New Gander</Modal.Title>
                <span className="d-flex ms-auto" onClick={onClose}><i className='fe fe-x ms-auto' ></i></span>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <div className="form-group">
                        <Form.Label>Gander</Form.Label>
                        <input className="form-control" name="gander" required type="text" onChange={on_submit.handleChange} placeholder="Enter gander" />
                        {                              
                            on_submit.touched.gander && on_submit.errors.gander ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.gander}</p> : null
                        } 
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
