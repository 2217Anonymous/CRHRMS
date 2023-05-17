import React, { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Form, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { QUALIFICATIONSTATUS } from '../../services/api/Master'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { ToastContainer } from 'react-toastify'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import Loader from '../../services/loader/Loader'
import { ToastLeft } from '../../services/notification/Notification'
import Datatable from '../../components/Helper/Datatable'
import { isAuthenticated } from '../../services/Auth'
import { useDispatch, useSelector } from 'react-redux'
import { addQualificationData,fetchQualificationData } from '../../Redux/slice/Master/Qualification'
import { checkPermission } from '../../services/Permission'
import AuthError from '../../components/authentication/errorPage/AuthError/AuthError'

export const COLUMNS = [
    {
      Header: "QUALIFICATION",
      accessor: "QUALIFICATION",
      className: "text-center wd-15p border-bottom-0",
    },
    {
      Header: "DESCRIPTION",
      accessor: "DESCRIPTION",
      className: "text-center wd-15p border-bottom-0 ",
  
    },
    {
      Header: "STATUS",
      accessor: "STATUS",
      className: "text-center wd-15p border-bottom-0 ",
    },
    {
      Header: "ACTION",
      accessor: "ACTION",
      className: "text-center wd-15p border-bottom-0 ",
    },
];

export default function Qualification() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [loading,setLoading] = useState(false)
    const [DATATABLE,setDATATABLE] = useState([])

    const [show, setShow] = useState(false);
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
                handleClose()
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

    const qualificationList = useSelector((state) => state.qualification.qualificationList.Data)
    
    useEffect(() => {
        dispatch(fetchQualificationData())
    },[dispatch])

    useEffect(() => {
        const statusClick = (pk) => {
            QUALIFICATIONSTATUS(pk).then(res => {
                const type = res.data.result
                const msg = res.data.Msg 
                if(res.data.result === 'success'){
                    dispatch(fetchQualificationData())
                    ToastLeft(msg,type)
                    setLoading(true)
                }
                else if(res.data.result === 'Failed'){
                    ToastLeft(msg,type)
                    setLoading(true)
                }
            }).catch((error) => {
                ToastLeft(error.message,"Failed");
            })
        }

        const getQualification = (() => {
            if (qualificationList) {
                const tableData = qualificationList.map((res) => ({
                    QUALIFICATION : res.Qualification,
                    DESCRIPTION : res.Description,
                    STATUS      : res.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">De Active</Badge> ,
                    ACTION      : (<>
                    {
                        checkPermission('Qualifications_Edit') ? (
                            <>
                            {
                                res.IsActive ? <Link onClick={() => statusClick(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >De active</Tooltip>}><span className="zmdi zmdi-eye me-2 text-primary"></span></OverlayTrigger></Link>
                            : <Link onClick={() => statusClick(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >Active</Tooltip>}><span className="zmdi zmdi-eye-off me-2 text-danger"></span></OverlayTrigger></Link>
                            }
                            </>) : ''
                    }
                    </>)
                }))
                setDATATABLE(tableData)
            }
        })

        getQualification()
    },[qualificationList,dispatch])

    if(!isAuthenticated()){
        navigate('/')
    }
  return (
    <>
        <PageHeader titles="Qualification" active="Qualification" items={['Pages']} />
        <ToastContainer />
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>New Qualification</Modal.Title>
                <span className="d-flex ms-auto" onClick={handleClose}><i className='fe fe-x ms-auto' ></i></span>
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
                </Form>
            </Modal.Body>
            <Modal.Footer>
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
                ) : (<Loader />)
            }
              
            </Modal.Footer>
        </Modal>
        <Row>
            <Col xl={12}>
                <Card>
                    <Card.Header>
                        <Card.Title>Qualification</Card.Title>
                        {
                            checkPermission('Qualifications_Add') ? <button style={{float:'right'}} className='d-flex ms-auto mx-2 btn btn-success' onClick={handleShow}>Add Qualification</button> : ''
                        }
                    </Card.Header>
                    <Card.Body>
                        {
                            checkPermission('Qualifications_List') ?<Datatable data={DATATABLE} col={COLUMNS} />:<AuthError/>
                        }
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>
  )
}