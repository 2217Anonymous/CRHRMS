import React, { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Form, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { GETQUALIFICATION, INSERTQUALIFICATION, QUALIFICATIONSTATUS } from '../../services/api/Master'
import axios from 'axios'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { ToastContainer } from 'react-toastify'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import { getUserData } from '../../services/storage/Storage'
import Loader from '../../services/loader/Loader'
import { ToastLeft } from '../../services/notification/Notification'
import Datatable from '../../components/Helper/Datatable'
import { isAuthenticated } from '../../services/Auth'
import { useDispatch, useSelector } from 'react-redux'
import { fetchQualificationData } from '../../Redux/slice/Master/Qualification'

const authToken = getUserData()

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
    const [loading,setLoading] = useState(true)
    const [DATATABLE,setDATATABLE] = useState([])

    const statusClick = (pk) => {
        QUALIFICATIONSTATUS(pk).then(res => {
            getQualificationList()
            const type = res.data.result
            const msg = res.data.Msg 
            if(res.data.result === 'success'){
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

    useEffect(() => {
        axios.interceptors.request.use(
            config => {
                config.headers.authorization = `Bearer ${authToken}`;
                return config;
            },
            error => {
                return Promise.reject(error);
        })

        getQualificationList()
    },[])
      
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const on_submit =  useFormik({
        initialValues : {
            qualification : '',
            description : '',
        },
        validationSchema:yup.object({
            qualification : yup.string()
          .required("qualification is required")
        }),
        onSubmit:(userInputData) => {
          setLoading(true)
            INSERTQUALIFICATION(userInputData).then((res) => {
                handleClose()
                getQualificationList()
                const type = res.data.result
                const msg = res.data.Msg 
                if(res.data.result === 'success'){
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
    }) 

    const dispatch = useDispatch()
    const {qualificationList} = useSelector((state) => state.qualification);
    
    const getQualificationList = (() => {
        GETQUALIFICATION().then((res) => {
            const data = res.data.Data
            const tableData = data.map((res) => ({
              QUALIFICATION : res.Qualification,
              DESCRIPTION : res.Description,
              STATUS      : res.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">De Active</Badge> ,
              ACTION      : res.IsActive ? <Link onClick={() => statusClick(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >De active</Tooltip>}><span className="zmdi zmdi-eye me-2 text-primary"></span></OverlayTrigger></Link>
              : <Link onClick={() => statusClick(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >Active</Tooltip>}><span className="zmdi zmdi-eye-off me-2 text-danger"></span></OverlayTrigger></Link>
            }))
            setDATATABLE(tableData)
        }).catch((error) => {
            ToastLeft(error.message,"Failed");
        })
    })

    useEffect(() => {
        dispatch(fetchQualificationData())
    },[dispatch])

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
                loading ? (
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
                            loading ? <button style={{float:'right'}} className='d-flex ms-auto mx-2 btn btn-success' onClick={handleShow}>Add Qualification</button> : <Loader />
                        }
                    </Card.Header>
                    <Card.Body>
                        <Datatable data={DATATABLE} col={COLUMNS} />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>
  )
}