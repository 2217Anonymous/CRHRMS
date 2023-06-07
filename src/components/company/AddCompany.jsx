import React, { useState } from 'react'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { useEffect } from 'react';
import { NEW_COMPANY } from '../../services/api/Company';
import { ToastLeft } from '../../services/notification/Notification';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../../services/loader/Loader';
import { checkPermission } from '../../services/Permission';
import AuthError from '../authentication/errorPage/AuthError/AuthError';
import { isAuthenticated } from '../../services/Auth';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCityData, fetchCountryData, fetchStateData } from '../../Redux/slice/Master/Location';

export default function AddCompany() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    //State Management
    const [isCrm, setIsCrm] = useState(false)
    const [loading,setLoading] = useState(false)
    const [selectedCountry,setSelectedCountry] = useState()
    const [selectedState,setSelectedState] = useState()

    //HANDLE ON CHANGE
    const handleCheckboxChange  = (event) => setIsCrm(event.target.checked)
    const handleCountryChange   = (event) => {
        setSelectedCountry(event.target.value)
        dispatch(fetchStateData(event.target.value))
    }
    const handleStateChange     = (event) =>{ 
        setSelectedState(event.target.value)
        dispatch(fetchCityData(event.target.value))
    }

    //FETCH API DATA
    const { countries, states, cities } = useSelector((state) => state.location);
    useEffect(() => {
        dispatch(fetchCountryData())
    },[dispatch])

    //Initial values
    const initialValues =  {
        compName            : '', //max 100
        shortName           : '', //max 10 null
        empCodePrefix       : '', // 3 req
        empCodeSufix        : '', // 3 null
        phoneNo             : '', //10 null
        mobileNo            : '', // 10 req
        email               : '', //100 req
        address             : '', // Max req
        city                : '', //int req
        postcode            : '', //max 6 req
        geoLoc              : '', //max req
        website             : '', // 100 null
        registrationNo      : '', // 50 null
        panNo               : '', // 10 null
        gstin               : '', //15 null
        isCrmhave           : '',
        userRegisterApi     : '', //100 
        userRegisterData    : '', // max
        userDeactivateApi   : '', //100
        userDeactivateData  : '', //max
    }

    //Validation
    const validationSchema = Yup.object({
    //     compName            : Yup.string().required('Company name is required').min(3,'Minimum 3 characters'),
    //     shortName           : Yup.string().max(10,"Maximum 10 characters"),
    //     empCodePrefix       : Yup.string().required('Employee code required').min(3,'Minimum 3 characters').max(3,"Maximum 3 characters"),
    //     empCodeSufix        : Yup.string().min(3,'Minimum 3 characters').max(3,"Maximum 3 characters"),
    //     mobileNo            : Yup.string().required('Mobile number required').min(10,'Minimum 10 digit').max(10,'Maximum 10 digit'),
    //     phoneNo             : Yup.string().min(10,'Minimum 10 digit').max(10,'Maximum 10 digit'),
    //     email               : Yup.string().email().required('Email is required').max(100,'Maximum 100 characters'),
    //     address             : Yup.string().required('Address required'),
    //     city                : Yup.string().required('City required'),
    //    // state               : Yup.string().required('State required'),
    //     //country             : Yup.string().required('Country required'),
    //     postcode            : Yup.string().required('Postcode required').min(6,"Minimium 6 characters").max(6,'Maximum 6 characters'),
    //     geoLoc              : Yup.string().required('Register api required'),
    //     panNo               : Yup.string().max(10,"Maximum 10 characters"),
    //     gstin               : Yup.string().max(15,"Maximum 15 characters"),
    //     userRegisterApi     : isCrm ? Yup.string().required('Register api required') : '',
    //     userRegisterData    : isCrm ? Yup.string().required('Register data required') : '',
    //     userDeactivateApi   : isCrm ? Yup.string().required('Deactive api required') : '',
    //     userDeactivateData  : isCrm ? Yup.string().required('Deactive data required') : ''
    })

    //Additional Data
    const additionalValues = {
        isCrmhave   : isCrm,
        country     : selectedCountry,
        state       : selectedState
    }
    
    //Submit Data
    const onSubmit = values => {
        const data = {...values,...additionalValues}
        NEW_COMPANY(data).then(res => {
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
            ToastLeft(err.message,"Failed");
        }).finally(() => {
            setLoading(false)
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
      <PageHeader titles="" active="company" items={['Home']} />
      <Row>
            <Col xl={12}>
                <ToastContainer />
                <Card>
                    <Card.Header>
                        <Card.Title as="h3">New Company Register</Card.Title>
                        {
                            checkPermission('Companies_List') ? <Link to={'/companies'} style={{float:'right'}} className='d-flex ms-auto mx-2 btn btn-outline-success'>Company List</Link> : ''
                        }   
                    </Card.Header>
                    <Card.Body>
                    {
                        checkPermission('Companies_Add') ? (
                            <>
                            <div className='row'>
                            <div className='col-md-12'>
                                <div className="form-group">
                                    <Form.Label htmlFor='company_name'>Company name</Form.Label>
                                    <input className="form-control" id='company_name' name="compName" required type="text" placeholder="Enter company name" 
                                        {...on_submit.getFieldProps('compName')}
                                    />
                                    {                              
                                        on_submit.touched.compName && on_submit.errors.compName ?( 
                                            <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.compName}</p> 
                                        ): null
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-md-4'>
                                <div className="form-group">
                                    <Form.Label>Short name</Form.Label>
                                    <input className="form-control" name="shortName" type="text" placeholder="Enter short name"
                                        {...on_submit.getFieldProps('shortName')}
                                    />
                                    {                              
                                        on_submit.touched.shortName &&  on_submit.errors.shortName ?( 
                                            <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.shortName}</p> 
                                        ): null
                                    }
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className="form-group">
                                    <Form.Label>Employee code prefix</Form.Label>
                                    <input className="form-control" name="empCodePrefix" type="text" placeholder="Enter prefix"
                                        {...on_submit.getFieldProps('empCodePrefix')}
                                    />
                                    {                              
                                        on_submit.touched.empCodePrefix &&  on_submit.errors.empCodePrefix ?( 
                                            <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.empCodePrefix}</p> 
                                        ): null
                                    }
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className="form-group">
                                    <Form.Label>Employee code sufix</Form.Label>
                                    <input className="form-control" name="empCodeSufix" type="text" placeholder="Enter suffix" 
                                        {...on_submit.getFieldProps('empCodeSufix')}
                                    />
                                    {                              
                                        on_submit.touched.empCodeSufix &&  on_submit.errors.empCodeSufix ?( 
                                            <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.empCodeSufix}</p> 
                                        ): null
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-md-6'>
                                <div className="form-group">
                                    <Form.Label>Mobile number</Form.Label>
                                    <input className="form-control" name="mobileNo" required type="text" min={1} placeholder="Enter mobile number" 
                                        {...on_submit.getFieldProps('mobileNo')}
                                    />
                                    {                              
                                        on_submit.touched.mobileNo &&  on_submit.errors.mobileNo ?( 
                                            <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.mobileNo}</p> 
                                        ): null
                                    }
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="form-group">
                                    <Form.Label>Phone number</Form.Label>
                                    <input className="form-control" name="phoneNo" type="text" min={1} placeholder="Enter phone number" 
                                        {...on_submit.getFieldProps('phoneNo')}
                                    />
                                    {                              
                                        on_submit.touched.phoneNo &&  on_submit.errors.phoneNo ?( 
                                            <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.phoneNo}</p> 
                                        ): null
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-md-6'>
                                <div className="form-group">
                                    <Form.Label>Email id</Form.Label>
                                    <input className="form-control" name="email" required type="text" placeholder="Enter email id" 
                                        {...on_submit.getFieldProps('email')}
                                    />
                                    {                              
                                        on_submit.touched.email &&  on_submit.errors.email ?( 
                                            <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.email}</p> 
                                        ): null
                                    }
                                </div> 
                            </div>
                            <div className='col-md-6'>
                                <div className="form-group">
                                    <Form.Label>Website URL</Form.Label>
                                    <input className="form-control" name="website" type="url" placeholder="Enter website url" 
                                        {...on_submit.getFieldProps('website')}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-md-4'>
                                <div className="form-group">
                                    <Form.Label>Address</Form.Label>
                                    <input className="form-control" name="address" required type="text" placeholder="Enter address" 
                                        {...on_submit.getFieldProps('address')}
                                    />
                                    {                              
                                        on_submit.touched.address &&  on_submit.errors.address ?( 
                                            <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.address}</p> 
                                        ): null
                                    }
                                </div> 
                            </div>
                            <div className='col-md-4'>
                                <div className="form-group">
                                    <Form.Label>Pincode</Form.Label>
                                    <input className="form-control" name="postcode" required type="url" placeholder="Enter postcode" 
                                        {...on_submit.getFieldProps('postcode')}
                                    />
                                    {                              
                                        on_submit.touched.postcode &&  on_submit.errors.postcode ?( 
                                            <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.postcode}</p> 
                                        ): null
                                    }
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className="form-group">
                                    <Form.Label>Location</Form.Label>
                                    <input className="form-control" name="geoLoc" type="url" placeholder="Enter location" 
                                        {...on_submit.getFieldProps('geoLoc')}
                                    />
                                    {                              
                                        on_submit.touched.geoLoc &&  on_submit.errors.geoLoc ?( 
                                            <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.geoLoc}</p> 
                                        ): null
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-md-4'>
                                <div className="form-group">
                                    <Form.Label>Country</Form.Label>
                                    <select className='form-control Select' required={true} name="country" onChange={handleCountryChange}>
                                        <option value="">Select country</option>  
                                        {
                                            countries.Data && countries.Data.map((dt) => {
                                                return(
                                                    <option key={dt.Id} value={dt.Id}>
                                                        {dt.Name}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                    {                              
                                        on_submit.touched.country && on_submit.errors.country ?( 
                                            <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.country}</p> 
                                        ): null
                                    }
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className="form-group">
                                    <Form.Label>State</Form.Label>
                                    <select className='form-control' required={true} name="state" onChange={handleStateChange} >
                                        <option value="">Select state</option>  
                                        {
                                            states.Data && states.Data.map((dt) => {
                                                return(
                                                    <option key={dt.Id} value={dt.Id}>
                                                        {dt.Name}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                    {                              
                                        on_submit.touched.state &&  on_submit.errors.state ?( 
                                            <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.state}</p> 
                                        ): null
                                    }
                                </div> 
                            </div>
                            <div className='col-md-4'>
                                <div className="form-group">
                                    <Form.Label>City</Form.Label>
                                    <select className='form-control' required={true} name="city" {...on_submit.getFieldProps('city')} >
                                        <option value="">Select city</option>  
                                        {
                                            cities.Data && cities.Data.map((dt) => {
                                                return(
                                                    <option key={dt.Id} value={dt.Id}>
                                                        {dt.Name}
                                                    </option>
                                                )
                                            })
                                        }  
                                    </select>
                                    {                              
                                        on_submit.touched.city &&  on_submit.errors.city ?( 
                                            <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.city}</p> 
                                        ): null
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-md-4'>
                                <div className="form-group">
                                    <Form.Label>Registration number</Form.Label>
                                    <input className="form-control" name="registrationNo" type="text" placeholder="Enter register number" 
                                        {...on_submit.getFieldProps('registrationNo')}
                                    />
                                </div> 
                            </div>
                            <div className='col-md-4'>
                                <div className="form-group">
                                    <Form.Label>Pan number</Form.Label>
                                    <input className="form-control" name="panNo" type="text" placeholder="Enter pan number" 
                                        {...on_submit.getFieldProps('panNo')}
                                    />
                                    {                              
                                        on_submit.touched.panNo &&  on_submit.errors.panNo ?( 
                                            <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.panNo}</p> 
                                        ): null
                                    }
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className="form-group">
                                    <Form.Label>GST number</Form.Label>
                                    <input className="form-control" name="gstin" type="text" placeholder="Enter gst number" 
                                        {...on_submit.getFieldProps('gstin')}
                                    />
                                    {                              
                                        on_submit.touched.gstin &&  on_submit.errors.gstin ?( 
                                            <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.gstin}</p> 
                                        ): null
                                    }
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className='row'>
                            <div className='col-md-3'>
                                <div className="form-group">
                                CRM have ?   
                                    <div className="material-switch pull-right">
                                        <input id="someSwitchOptionSuccess" checked={isCrm} onChange={handleCheckboxChange} name="isCrmhave" type="checkbox" />
                                        <label htmlFor="someSwitchOptionSuccess" className="label-success"></label>
                                    </div>
                                </div> 
                            </div>
                        </div>
                        {
                            isCrm && (<>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <div className="form-group">
                                        <Form.Label>User register api</Form.Label>
                                        <input className="form-control" name="userRegisterApi" required type="url" placeholder="Enter user register api" 
                                            {...on_submit.getFieldProps('userRegisterApi')}
                                        />
                                        {                              
                                            on_submit.touched.userRegisterApi &&  on_submit.errors.userRegisterApi ?( 
                                                <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.userRegisterApi}</p> 
                                            ): null
                                        }
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className="form-group">
                                        <Form.Label>User register data</Form.Label>
                                        <input className="form-control" name="userRegisterData" type="url" placeholder="Enter user register data" 
                                            {...on_submit.getFieldProps('userRegisterData')}
                                        />
                                        {                              
                                            on_submit.touched.userRegisterData &&  on_submit.errors.userRegisterData ?( 
                                                <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.userRegisterData}</p> 
                                            ): null
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <div className="form-group">
                                        <Form.Label>User deactivate api</Form.Label>
                                        <input className="form-control" name="userDeactivateApi" type="url" placeholder="Enter user deactivate api" 
                                            {...on_submit.getFieldProps('userDeactivateApi')}
                                        />
                                        {                              
                                            on_submit.touched.userDeactivateApi &&  on_submit.errors.userDeactivateApi ?( 
                                                <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.userDeactivateApi}</p> 
                                            ): null
                                        }
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className="form-group">
                                        <Form.Label>User deactivate data</Form.Label>
                                        <input className="form-control" name="userDeactivateData" type="url" placeholder="Enter user deactivate data" 
                                            {...on_submit.getFieldProps('userDeactivateData')}
                                        />
                                        {                              
                                            on_submit.touched.userDeactivateData &&  on_submit.errors.userDeactivateData ?( 
                                                <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.userDeactivateData}</p> 
                                            ): null
                                        }
                                    </div>
                                </div>
                            </div>
                            </>
                            )
                        }
                        <hr></hr>
                            <div className="text-end">
                                <div className="submit">
                                    { !loading ? <>
                                        <Button variant="danger" onClick={on_submit.handleReset}>
                                            Close
                                        </Button> { }
                                        <Button variant="success" onClick={on_submit.handleSubmit}>
                                            Save Changes
                                        </Button>
                                    </> : (<Loader />)
                                    } 
                                </div>      
                            </div>
                            </>
                        ) : <AuthError />
                    }    
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>
  )
}
