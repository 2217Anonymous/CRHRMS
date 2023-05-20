import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { addBloodGroupData, fetchBloodGroupData} from '../../../Redux/slice/Master/BloodGroup'
import { useDispatch } from 'react-redux'
import Loader from '../../../services/loader/Loader'
import { ToastLeft } from '../../../services/notification/Notification'

export default function BloodModel({isOpen, onClose}) {
    console.log(isOpen);
    const dispatch = useDispatch()
    const [loading,setLoading] = useState(true)

    const on_submit =  useFormik({
        initialValues : {
          name : '',
        },

        validationSchema:yup.object({
            name : yup.string().required("Blood Group is required")
        }),
        
        onSubmit:(userInputData) => {
            setLoading(false)
            dispatch(addBloodGroupData(userInputData)).then(action => {
                onClose()
                const res = action.payload;
                const type = res.result
                const msg = res.Msg 
                if(res.result === 'success'){
                    ToastLeft(msg,type)
                    setLoading(false)
                    dispatch(fetchBloodGroupData())
                }
                else if(res.data.result === 'Failed'){
                    ToastLeft(msg,type)
                    setLoading(true)
                }
            }).catch(err => ToastLeft(err,'Failed')).finaly(() => setLoading(false))
        }
    }) 
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
                        <Form.Label>Blood Group</Form.Label>
                        <input className="form-control" name="name" required type="text" onChange={on_submit.handleChange} placeholder="Enter blood groups" />
                        {                              
                            on_submit.touched.name && on_submit.errors.name ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.name}</p> : null
                        } 
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
