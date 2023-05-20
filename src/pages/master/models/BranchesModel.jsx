import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import Loader from '../../../services/loader/Loader'
import { ToastLeft } from '../../../services/notification/Notification'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated } from '../../../services/Auth'
import { addBranchData, fetchBranchData } from '../../../Redux/slice/Master/Branch'

export default function BranchModel({isOpen, onClose}) {
    console.log(isOpen);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading,setLoading] = useState(true)

    const on_submit =  useFormik({
        initialValues : {
          name : '',
          description : '',
        },
        validationSchema:yup.object({
            name : yup.string()
          .required("Branch name is required")
        }),
        onSubmit:(userInputData) => {
          setLoading(true)
          dispatch(addBranchData(userInputData)).then((res) => {
                onClose()
                const type = res.data.result
                const msg = res.data.Msg 
                if(res.data.result === 'success'){
                    ToastLeft(msg,type)
                    setLoading(true)
                    dispatch(fetchBranchData())
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
        dispatch(fetchBranchData())
    },[dispatch])

    if(!isOpen){
        return null
    }

    if(!isAuthenticated()){
        navigate('/')
    }

  return (
    <>
      <Modal show={isOpen} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>Blood Group Name</Modal.Title>
                <span className="d-flex ms-auto" onClick={onClose}><i className='fe fe-x ms-auto' ></i></span>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <div className="form-group">
                        <Form.Label>Branch name</Form.Label>
                        <input className="form-control" name="name" required type="text" onChange={on_submit.handleChange} placeholder="Enter branches" />
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
                loading ? (
                    <>
                        <Button variant="danger" onClick={onClose}>
                            Close
                        </Button>
                        
                        <Button variant="success" onClick={on_submit.handleSubmit}>
                            Save Changes
                        </Button>
                    </>
                ) : (<Loader />)
            }
            </Modal.Footer>
        </Modal>
    </>
  )
}
