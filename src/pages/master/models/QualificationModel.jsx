import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import * as yup from 'yup'
import { addQualificationData, fetchQualificationData } from '../../../Redux/slice/Master/Qualification'
import { useDispatch } from 'react-redux';
import { ToastLeft } from '../../../services/notification/Notification';
import { isAuthenticated } from '../../../services/Auth';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../services/loader/Loader';



export default function QualificationModel({isOpen, onClose}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [loading,setLoading] = useState(false)

    const on_submit =  useFormik({
        initialValues : {
            qualification : '',
            description : '',
        },
        validationSchema:yup.object({
            qualification : yup.string().required("qualification is required")
        }),
        onSubmit:(userInputData) => {
            setLoading(false)
            dispatch(addQualificationData(userInputData)).then(action => {
                onClose()
                const res = action.payload;
                const type = res.result
                const msg = res.Msg 
                if(res.result === 'success'){
                    ToastLeft(msg,type)
                    setLoading(false)
                    dispatch(fetchQualificationData())
                }
                else if(res.data.result === 'Failed'){
                    ToastLeft(msg,type)
                    setLoading(true)
                }
            }).catch(err => ToastLeft(err,'Failed')).finaly(() => setLoading(false))
        }
    }) 

    useEffect(() => {
        dispatch(fetchQualificationData())
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
                <Modal.Title>New Qualification</Modal.Title>
                <span className="d-flex ms-auto" onClick={onClose}><i className='fe fe-x ms-auto' ></i></span>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <div className="form-group">
                        <Form.Label>Qualification</Form.Label>
                        <input className="form-control" name="qualification" required type="text" onChange={on_submit.handleChange} placeholder="Enter qualification" />
                        {                              
                            on_submit.touched.qualification && on_submit.errors.qualification ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.qualification}</p> : null
                        } 
                    </div>
                    <div className="form-group">
                        <Form.Label>Description</Form.Label>
                        <textarea className="form-control mb-4" onChange={on_submit.handleChange} name="description" required placeholder="Enter description" rows={4}></textarea>
                    </div>
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
                </Form>
            </Modal.Body>
        </Modal>
       
    </>
  )
}
