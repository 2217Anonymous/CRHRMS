import React, { useEffect, useState } from 'react'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import { Badge, Button, Card, Col, Form, Modal, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table'
import axios from 'axios'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { ToastContainer } from 'react-toastify'
import { getUserData } from '../../services/storage/Storage'
import { GENDERSTATUS, GETGENDER, INSERTGENDER } from '../../services/api/Master'
import { ToastLeft } from '../../services/notification/Notification'
import Loader from '../../services/loader/Loader'
import Datatable from '../../components/Helper/Datatable'
import { isAuthenticated } from '../../services/Auth'
import { checkPermission } from '../../services/Permission'
import AuthError from '../../components/authentication/errorPage/AuthError/AuthError'

const authToken = getUserData()

export const COLUMNS = [
    {
      Header: "GENDER",
      accessor: "GENNAME",
      className: "text-center wd-15p border-bottom-0",
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

export default function Gender() {
    const navigate = useNavigate()
    const [loading,setLoading] = useState(true)
    const [DATATABLE,setDATATABLE] = useState([])

    const getGenderList = (() => {
        GETGENDER().then((res) => {
            const data = res.data.Data
            const tableData = data.map((res) => ({
                GENNAME     : res.GenName,
                STATUS      : res.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">De Active</Badge> ,
                ACTION      : (<>
                    {
                      checkPermission('Genders_Edit') ? (
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
        console.log(pk);
        GENDERSTATUS(pk).then(res => {
            getGenderList()
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

        getGenderList()
    },[])
      
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const on_submit =  useFormik({
        initialValues : {
            gander : '',
        },
        validationSchema:yup.object({
        gander : yup.string().required("Gander is required")
        }),
        onSubmit:(userInputData) => {
          setLoading(true)
          INSERTGENDER(userInputData).then((res) => {
                handleClose()
                getGenderList()
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
        <PageHeader titles="Gender" active="Gender" items={['Pages']} />
        <ToastContainer />
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>New Gander</Modal.Title>
                <span className="d-flex ms-auto" onClick={handleClose}><i className='fe fe-x ms-auto' ></i></span>
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
                        <Card.Title>Gender</Card.Title>
                        {
                            checkPermission('Genders_Edit') ? <button style={{float:'right'}} className='d-flex ms-auto mx-2 btn btn-success' onClick={handleShow}>Add Gender</button> : ''
                        }
                    </Card.Header>
                    <Card.Body>
                    {
                            checkPermission('Genders_List') ? <Datatable data={DATATABLE} col={COLUMNS} /> : <AuthError />
                    }
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>
  )
}
