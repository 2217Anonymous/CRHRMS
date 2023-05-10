import React, { useEffect, useState } from 'react'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import { Badge, Button, Card, Col, Form, Modal, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { ToastContainer } from 'react-toastify'
import { ToastLeft } from '../../services/notification/Notification'
import Loader from '../../services/loader/Loader'
import { BLOODSTATUS, GETBLOOD, INSERTBLOOD } from '../../services/api/Master'
import Datatable from '../../components/Helper/Datatable'

export const COLUMNS = [
    {
      Header: "NAME",
      accessor: "NAME",
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

export default function Blood() {
    const navigate = useNavigate()
    const [loading,setLoading] = useState(true)
    const [DATATABLE,setDATATABLE] = useState([])

    const getBloodList = (() => {
        GETBLOOD().then((res) => {
            const data = res.data.Data
            const tableData = data.map((res) => ({
              NAME        : res.Name,
              STATUS      : res.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">De Active</Badge> ,
              ACTION      : res.IsActive ? <Link onClick={() => statusClick(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >De active</Tooltip>}><span className="zmdi zmdi-eye me-2 text-primary"></span></OverlayTrigger></Link>
              : <Link onClick={() => statusClick(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >Active</Tooltip>}><span className="zmdi zmdi-eye-off me-2 text-danger"></span></OverlayTrigger></Link>
            }))
            setDATATABLE(tableData)
        }).catch((error) => {
            ToastLeft(error.message,"Failed");
        })
    })

    const statusClick = (pk) => {
        BLOODSTATUS(pk).then(res => {
            getBloodList()
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
        getBloodList()
    },[])
    
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const on_submit =  useFormik({
        initialValues : {
          name : '',
        },
        validationSchema:yup.object({
            name : yup.string()
          .required("Blood Group is required")
        }),
        onSubmit:(userInputData) => {
          setLoading(true)
            INSERTBLOOD(userInputData).then((res) => {
                handleClose()
                getBloodList()
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


  return (
    <>
        <PageHeader titles="Blood Grups" active="Blood Group" items={['Pages']} />
        <ToastContainer />
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>New Gender</Modal.Title>
                <span className="d-flex ms-auto" onClick={handleClose}><i className='fe fe-x ms-auto' ></i></span>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <div className="form-group">
                        <Form.Label>Gender</Form.Label>
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
                        <Button variant="danger" onClick={handleClose}>
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

        <Row>
            <Col xl={12}>
                <Card>
                    <Card.Header>
                        <Card.Title>Blood Group</Card.Title>
                        {
                            loading ? <button style={{float:'right'}} className='d-flex ms-auto mx-2 btn btn-success' onClick={handleShow}>Add Blood Group</button> : <Loader />   
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