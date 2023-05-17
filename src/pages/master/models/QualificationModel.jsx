import { useFormik } from 'formik';
import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import * as yup from 'yup'
import { addQualificationData } from '../../../Redux/slice/Master/Qualification'
import { useDispatch } from 'react-redux';
import { ToastLeft } from '../../../services/notification/Notification';
import { ToastContainer } from 'react-toastify';



export default function QualificationModel() {
    const dispatch = useDispatch()

    const [show, setShow] = useState(false);
    const [loading,setLoading] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
                const res = action.payload;
                handleClose()
                const type = res.result
                const msg = res.Msg 
                if(res.result === 'success'){
                    ToastLeft(msg,type)
                    setLoading(false)
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
    <ToastContainer />
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
                        <Button variant="danger" onClick={handleClose}>
                            Close
                        </Button>
                    </>
                ) : ('')
            }
        </Form>
    </>
  )
}
