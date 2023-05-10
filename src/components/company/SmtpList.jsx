import React, { useEffect, useState } from 'react'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import { Button, Card, Col, Form, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import Datatable from '../Helper/Datatable'
import { ADD_SMTP, SMTP_LIST } from '../../services/api/Company'
import { ToastLeft } from '../../services/notification/Notification'
import axios from 'axios'
import { isAuthenticated } from '../../services/Auth'
import { getUserData } from '../../services/storage/Storage'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import EditSmtp from './EditSmtp'

const authToken = getUserData()

export const col = [
    {
      Header: "COMPANY",
      accessor: "CompName",
      className: "text-center wd-15p border-bottom-0",
    },
    {
      Header: "USERNAME",
      accessor: "UserName",
      className: "text-center wd-15p border-bottom-0",
    },
    {
      Header: "DISPLAY NAME",
      accessor: "DisplayName",
      className: "text-center wd-15p border-bottom-0",
    },
    {
      Header: "HOST",
      accessor: "Host",
      className: "text-center wd-15p border-bottom-0",
    },
    {
      Header: "PORT",
      accessor: "Port",
      className: "text-center wd-15p border-bottom-0",
    },
    {
      Header: "ACTION",
      accessor: "Action",
      className: "text-center wd-15p border-bottom-0 ",
    },
];

export default function SmtpList() {
    const [datatable,setDatatable] = useState([])
    const [loading,setLoading] = useState(false)
    const [ssl, setSsl] = useState(false);
    const [smtpData,setSmtpData] = useState([])
    const [paramStr,setparamStr] = useState()
    const [id,setId] = useState()
    const [companyId,setCompanyId] = useState()

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const navigate = useNavigate()

    const handleCheckboxChange = (event) => {
        setSsl(event.target.checked);
    };

    const getSmtpList = (() => {
        SMTP_LIST().then((res) => {
            const data = res.data.Data
            const tableData = data.map((res) => ({
                CompName    : res.CompName,
                UserName    : res.UserName,
                DisplayName : res.DisplayName,
                Host        : res.Host,
                Port        : res.Port,
                Action      : (<>
                    <button data-toggle="modal" data-target="#editSmtp{res.Id}"><OverlayTrigger placement="top" overlay={<Tooltip >Edit</Tooltip>}><span className="fe fe-edit me-2 text-primary"></span></OverlayTrigger></button> 
                    <EditSmtp id={res.Id}/>
                </>)
            }))

            setSmtpData(res.data.Data)
            setId(res.data.Data.Id)
            setCompanyId(res.data.Data.CompId)
            setparamStr(res,data.Data.ParamStr)
            if(res.data.Data.IsCrmhave){
                setSsl(true);
            }
            setDatatable(tableData)
        }).catch((error) => {
            ToastLeft(error.message,"Failed");
        })
    })

    useEffect(() => {
        axios.interceptors.request.use(
            config => {
                config.headers.authorization = `Bearer ${authToken}`;
                return config;
            },
            error => {
                return Promise.reject(error);
        })
        getSmtpList()
    },[])

     //Initial values
     const initialValues =  {
        userName    : "",
        displayName : "",
        password    : "",
        host        : "",
        port        : "",
    }

    //Validation
    const validationSchema = Yup.object({
        userName    : Yup.string().required('Smtp username is required'),
        displayName : Yup.string().required('Smtp displayname is required'),
        password    : Yup.string().required('Smtp password is required'),
        host        : Yup.string().required('Smtp host is required'),
        port        : Yup.string().required('Smtp port is required'),
        sslEnable   : Yup.boolean(),
    })

    //Submit Data
    const onSubmit = values => {
        ADD_SMTP(id,companyId,paramStr,values,ssl).then(res => {
            const type = res.data.result
            const msg = res.data.Msg 
            if(res.data.result === 'success'){
                ToastLeft(msg,type)
                setLoading(false)
                on_submit.resetForm()
            }
            else if(res.data.result === 'Failed'){
                console.log(res.data.Msg);
                ToastLeft(msg,type)
                setLoading(true)
            }
        }).catch(err => {

        })  
    }

    //Form Submission
    const on_submit = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    })

    if(!isAuthenticated()){
        navigate('/')
    }
  return (
    <>
      <PageHeader titles="SMTP List" active="smtp" items={['Home']} />
      <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>New Gender</Modal.Title>
                <span className="d-flex ms-auto" onClick={handleClose}><i className='fe fe-x ms-auto' ></i></span>
            </Modal.Header>
            <Modal.Body>
            <Row>
                <Col xl={12}>
                    <div className='row'>
                        <div className='col-md-6'>
                            <div className="form-group">
                                <Form.Label>Username</Form.Label>
                                <input className="form-control" name="userName" defaultValue={smtpData.UserName} type="text" placeholder="Enter username"
                                    onChange={on_submit.handleChange}
                                    onBlur={on_submit.handleBlur}
                                />
                                {                              
                                    on_submit.touched.userName &&  on_submit.errors.userName ?( 
                                        <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.userName}</p> 
                                    ): null
                                }
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className="form-group">
                                <Form.Label>Displayname</Form.Label>
                                <input className="form-control" name="displayName" defaultValue={smtpData.DisplayName} type="text" placeholder="Enter displayname"
                                    onChange={on_submit.handleChange}
                                    onBlur={on_submit.handleBlur}
                                />
                                {                              
                                    on_submit.touched.displayName &&  on_submit.errors.displayName ?( 
                                        <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.displayName}</p> 
                                    ): null
                                }
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-md-6'>
                            <div className="form-group">
                                <Form.Label>Password</Form.Label>
                                <input className="form-control" name="password" type="password" placeholder="Enter password"
                                    onChange={on_submit.handleChange}
                                    onBlur={on_submit.handleBlur}
                                />
                                {                              
                                    on_submit.touched.password &&  on_submit.errors.password ?( 
                                        <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.password}</p> 
                                    ): null
                                }
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className="form-group">
                                <Form.Label>Host</Form.Label>
                                <input className="form-control" name="host"  defaultValue={smtpData.Host} type="text" placeholder="Enter host"
                                    onChange={on_submit.handleChange}
                                    onBlur={on_submit.handleBlur}
                                />
                                {                              
                                    on_submit.touched.host &&  on_submit.errors.host ?( 
                                        <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.host}</p> 
                                    ): null
                                }
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-md-6'>
                            <div className="form-group">
                                <Form.Label>Port</Form.Label>
                                <input className="form-control" name="port" defaultValue={smtpData.Port} type="text" placeholder="Enter port no"
                                    onChange={on_submit.handleChange}
                                    onBlur={on_submit.handleBlur}
                                />
                                {                              
                                    on_submit.touched.port &&  on_submit.errors.port ?( 
                                        <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.port}</p> 
                                    ): null
                                }
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className="form-group">
                                <Form.Label><br></br></Form.Label>
                                SSL Enable ?
                                    <div className="material-switch pull-right">
                                        <input id="ssl" checked={ssl} onChange={handleCheckboxChange} name="sslEnable" type="checkbox" />
                                        <label htmlFor="ssl" className="label-success"></label>
                                    </div>
                                </div> 
                                {                              
                                    on_submit.touched.sslEnable &&  on_submit.errors.sslEnable ?( 
                                        <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.sslEnable}</p> 
                                    ): null
                                }
                            </div>
                        </div>
            
                    <div className="submit text-end">
                        { loading ? "loading..." : <>
                            <Button variant="danger" onClick={on_submit.handleReset}>
                                Close
                            </Button> { }
                            <Button variant="success" onClick={on_submit.handleSubmit}>
                                Save Changes
                            </Button>
                        </>
                        } 
                    </div>      

                </Col>
            </Row>
            </Modal.Body>
        </Modal>
        <Row>
          <Col xl={12}>
              <ToastContainer />
              <Card>
                    <Card.Header>
                        <Card.Title as="h3">SMTP List</Card.Title>
                        <Link to={''} style={{float:'right'}} className='d-flex ms-auto mx-2 btn btn-success'>Add SMTP</Link>
                    </Card.Header>
                    <Card.Body>
                        <Datatable data={datatable} col={col} />
                    </Card.Body>
              </Card>
          </Col>
      </Row>
    </>
  )
}
