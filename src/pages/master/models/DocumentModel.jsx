import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addDocumentData, fetchDocumentData } from '../../../Redux/slice/Master/Document'
import { isAuthenticated } from '../../../services/Auth'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { ToastLeft } from '../../../services/notification/Notification'
import { Button, Form, Modal } from 'react-bootstrap'
import Loader from '../../../services/loader/Loader'

export default function DocumentModel({isOpen, onClose}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading,setLoading]  = useState(true)

  const initialValues = {
    name        : '',
    description : ''
  }

  const validationSchema = yup.object({
      name : yup.string().required("document name is required")
  })

  const onSubmit = userInputData => {
    setLoading(true)
      dispatch(addDocumentData(userInputData)).then((res) => {
        onClose()
        const type = res.payload.result
        const msg = res.payload.Msg 
        if(res.payload.result === 'success'){
            ToastLeft(msg,type)
            setLoading(true)
            onClose()
            dispatch(fetchDocumentData())
        }
        else if(res.payload.result === 'Failed'){
            ToastLeft(msg,type)
            setLoading(true)
        }
    }).catch((error) => {
        ToastLeft(error.message,"Failed");
    })
  }

  //Form Submission
  const on_submit = useFormik({
      initialValues,
      validationSchema,
      onSubmit,
  })

  useEffect(() => {
    dispatch(addDocumentData())
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
            <Modal.Title>Add Document</Modal.Title>
            <span className="d-flex ms-auto" onClick={onClose}><i className='fe fe-x ms-auto' ></i></span>
        </Modal.Header>
        <Modal.Body>
            <div className="form-group">
                <Form.Label>Document name</Form.Label>
                <input className="form-control" name="name" required type="text" placeholder="Enter document name" 
                    onChange={on_submit.handleChange} 
                    onBlur={on_submit.handleBlur}
                />
                
            </div> 
            <div className="form-group">
                <Form.Label>Description</Form.Label>
                <textarea className="form-control mb-4" name="description" onChange={on_submit.handleChange} onBlur={on_submit.handleBlur} required placeholder="Enter description" rows={4}></textarea>
            </div>
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
