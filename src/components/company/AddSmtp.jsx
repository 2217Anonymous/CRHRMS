import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { ADD_SMTP, GET_COMPANY_SMTP } from '../../services/api/Company';
import { ToastLeft } from '../../services/notification/Notification';


export default function AddSmtp(props) {

    const [loading,setLoading] = useState(false)    
    const [ssl, setSsl] = useState(false);
    const [smtpData,setSmtpData] = useState([])
    const [id,setId] = useState()
    const [companyId,setCompanyId] = useState()

    const handleCheckboxChange = (event) => {
        setSsl(event.target.checked);
    };

    const getSmtpList = (() => {
        GET_COMPANY_SMTP(props.id).then((res) => {
            setSmtpData(res.data.Data)
            setId(res.data.Data.Id)
            setCompanyId(res.data.Data.CompId)
            if(res.data.Data.IsCrmhave){
                setSsl(true);
            }
        }).catch((error) => {
            ToastLeft(error.message,"Failed");
        })
    })

    const oldInitialValues = {
        userName    : smtpData.UserName,
        displayName : smtpData.DisplayName,
        password    : smtpData.Password,
        host        : smtpData.Host,
        port        : smtpData.Port,
    }
    
    const newInitialValues = {
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
        ADD_SMTP(id,companyId,props.id,values,ssl).then(res => {
            const type = res.data.result
            const msg = res.data.Msg 
            if(res.data.result === 'success'){
                ToastLeft(msg,type)
                setLoading(false)
                on_submit.resetForm()
            }
            else if(res.data.result === 'Failed'){
                ToastLeft(msg,type)
                setLoading(true)
            }
        }).catch(err => {

        })  
    }
    //Form Submission
    const on_submit = useFormik({
        initialValues : oldInitialValues||newInitialValues,   
        validationSchema,
        onSubmit,
        enableReinitialize:true,
    })

    useEffect(() => {
        getSmtpList()
    },[])

  return (
    <>
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
                            <input className="form-control" name="password" defaultValue={smtpData.Password} type="password" placeholder="Enter password"
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
    </>
  )
}
