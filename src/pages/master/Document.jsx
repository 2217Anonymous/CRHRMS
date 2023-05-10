import React, { useEffect, useState } from 'react'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import { Badge, Button, Card, Col, Form, Modal, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap'
import {  Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { getUserData } from '../../services/storage/Storage'
import { DOCUMENTSTATUS, GETDOCUMENT, INSERTDOCUMENT } from '../../services/api/Master'
import { ToastLeft } from '../../services/notification/Notification'
import { ToastContainer } from 'react-toastify'
import Loader from '../../services/loader/Loader'
import Datatable from '../../components/Helper/Datatable'
import { isAuthenticated } from '../../services/Auth'


const authToken = getUserData()

export const COLUMNS = [
    {
      Header: "DOCUMENT NAME",
      accessor: "NAME",
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

export default function Document() {
    const navigate = useNavigate()
    const [loading,setLoading] = useState(true)
    const [DATATABLE,setDATATABLE] = useState([])

    const initialValues = {
        name        : '',
        description : ''
    }

    const validationSchema = yup.object({
        name : yup.string().required("document name is required")
    })

    const onSubmit = userInputData => {
        setLoading(true)
          INSERTDOCUMENT(userInputData).then((res) => {
              handleClose()
              getDocumentList()
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

    //Form Submission
    const on_submit = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    })


    const getDocumentList = (() => {
        GETDOCUMENT().then((res) => {
            const data = res.data.Data
            const tableData = data.map((res) => ({
              NAME          : res.Name,
              DESCRIPTION   : res.Description,
              STATUS        : res.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">De Active</Badge> ,
              ACTION        : res.IsActive ? <Link onClick={() => statusClick(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >De active</Tooltip>}><span className="zmdi zmdi-eye me-2 text-primary"></span></OverlayTrigger></Link>
              : <Link onClick={() => statusClick(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >Active</Tooltip>}><span className="zmdi zmdi-eye-off me-2 text-danger"></span></OverlayTrigger></Link>
            }))
            setDATATABLE(tableData)
        }).catch((error) => {
            ToastLeft(error.message,"Failed");
        })
    })

    const statusClick = (pk) => {
        DOCUMENTSTATUS(pk).then(res => {
            getDocumentList()
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

        getDocumentList()
    },[])

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    if(!isAuthenticated()){
        navigate('/')
      }
  return (
    <>
        <PageHeader titles="Documents" active="Documents" items={['Master']} />
        <ToastContainer />
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Add Document</Modal.Title>
                <span className="d-flex ms-auto" onClick={handleClose}><i className='fe fe-x ms-auto' ></i></span>
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
                        <Card.Title>Document</Card.Title>
                        {
                            loading ? <button style={{float:'right'}} className='d-flex ms-auto mx-2 btn btn-success' onClick={handleShow}>Add Document</button> : <Loader />
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
