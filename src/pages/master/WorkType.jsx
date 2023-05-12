import React, { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Modal, OverlayTrigger, Row, Table, Tooltip,Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table'
import axios from 'axios'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { ToastContainer } from 'react-toastify'
import { GETWORKTYPE,INSERTWORKTYPE, WORKSTATUS } from '../../services/api/Master'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import { getUserData } from '../../services/storage/Storage'
import { ToastLeft } from '../../services/notification/Notification'
import { checkPermission } from '../../services/Permission'
import Loader from '../../services/loader/Loader'
import Datatable from '../../components/Helper/Datatable'
import { isAuthenticated } from '../../services/Auth'
import AuthError from '../../components/authentication/errorPage/AuthError/AuthError'

const authToken = getUserData()

  export const COLUMNS = [
    {
      Header: "NAME",
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

export default function WorkType() {
    const navigate = useNavigate()
    const [loading,setLoading] = useState(true)
    const [DATATABLE,setDATATABLE] = useState([])

    const getWorkList = (() => {
        GETWORKTYPE().then((res) => {
            const data = res.data.Data
            const tableData = data.map((res) => ({
                NAME        : res.Name,
                DESCRIPTION : res.Description,
                STATUS      : res.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">De Active</Badge> ,
                ACTION      : (<>
                    {
                      checkPermission('Worktype_Edit') ? (
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
        }).catch((error) => {
            ToastLeft(error.message,"Failed");
        })
    })

    const statusClick = (pk) => {
        WORKSTATUS(pk).then(res => {
            getWorkList()
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

        getWorkList()
    },[])
    
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const on_submit =  useFormik({
        initialValues : {
          name : '',
          description:''
        },
        validationSchema:yup.object({
            name : yup.string().required("Work type is required")
        }),
        onSubmit:(userInputData) => {
          setLoading(true)
            INSERTWORKTYPE(userInputData).then((res) => {
                handleClose()
                getWorkList()
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

    if(!isAuthenticated()){
        navigate('/')
      }
  return (
    <>
        <PageHeader titles="WorkType" active="WorkType" items={['Pages']} />
        <ToastContainer/>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>New Work Type</Modal.Title>
                <span className="d-flex ms-auto" onClick={handleClose}><i className='fe fe-x ms-auto' ></i></span>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <div className="form-group">
                        <Form.Label>Work Type</Form.Label>
                        <input className="form-control" name="name" required type="text" onChange={on_submit.handleChange} placeholder="Enter work type" />
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
                        <Card.Title>WorkType</Card.Title>
                        {
                            checkPermission('Worktype_Add') ? <button style={{float:'right'}} className='d-flex ms-auto mx-2 btn btn-success' onClick={handleShow}>Add Worktype</button> : ''
                        }
                    </Card.Header>
                    <Card.Body>
                    {
                        checkPermission('Worktype_List') ? <Datatable data={DATATABLE} col={COLUMNS} /> : <AuthError />
                    }
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>
  )
}