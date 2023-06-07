import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { useEffect } from 'react';
import { CityList, CountryList, StateList } from '../../services/api/Utility';
import { EDIT_COMPANY, NEW_COMPANY } from '../../services/api/Company';
import { ToastLeft } from '../../services/notification/Notification';
import Loader from '../../services/loader/Loader';
import { useNavigate } from 'react-router-dom';

export default function UpdateCompany(props) {

const navigate = useNavigate()
//State Management
const [isCrm, setIsCrm] = useState(false);
const [loading,setLoading] = useState(false)
const [country,setCountry] = useState([])
const [state,setState] = useState([])
const [city,setCity] = useState([])
const [selectedCountry,setSelectedCountry] = useState([])
const [selectedState, setSelectedState] = useState('');
const [selectedCity, setSelectedCity] = useState('');

const [id,setId] = useState()
const [countryId,setCountryId] = useState('')
const [stateId,setStateId] = useState('')
const [cityId,setCityId] = useState('')

const [data,setData] = useState([])

//HANDLE ON CHANGE
const handleCheckboxChange = (event) => {
    setIsCrm(event.target.checked);
};

const handleCountryChange = (event) => {
    setCountryId(event.target.value)
    setSelectedCountry(event.target.value);
    setStateId(event.target.value)
};  

const handleStateChange = (event) => {
    setStateId(event.target.value)
    setSelectedState(event.target.value);
    setCityId(event.target.value)
}

const handleCityChange = (event) => {
    setCityId(event.target.value)
    setSelectedCity(event.target.value);
}

//FETCH API DATA

const getCountry = (() => {
    CountryList().then(res => {
        setCountry(res.data.Data)
    }).catch(err => {
        console.log(err);
    })
})

useEffect(() => {
    CityList(stateId).then(res => {
        setCity(res.data.Data)
    })
},[stateId])

useEffect(() => {
    StateList(countryId).then(res => {
        setState(res.data.Data)
    })
},[countryId])

const getCompany = (() => {
    EDIT_COMPANY(props.id).then(res => {
        const type = res.data.result
        const msg = res.data.Msg 
        if(res.data.result === 'success'){
            ToastLeft(msg,type)
            setLoading(false)
            setData(res.data.Data)
            setId(res.data.Data.Id)
            setCountryId(res.data.Data.Country)
            setStateId(res.data.Data.State)
            setCityId(res.data.Data.City)
            if(res.data.Data.IsCrmhave){
                setIsCrm(true);
            }
        }
        else if(res.data.result === 'Failed'){
            console.log(res.data.Msg);
            ToastLeft(msg,type)
            setLoading(true)
        }
    })
})

//Hooks Management
useEffect(() => {
    getCompany()
    getCountry()
},[])

//Old Initial Values
const oldInitialValues =  {
    compName            : data.CompName,
    shortName           : data.ShortName,
    empCodePrefix       : data.EmpCodePrefix,
    empCodeSufix        : data.EmpCodeSufix,
    phoneNo             : data.PhoneNo, 
    mobileNo            : data.MobileNo, 
    email               : data.Email,
    address             : data.Address,
    postcode            : data.Postcode,
    geoLoc              : data.GeoLoc,
    website             : data.Website,
    registrationNo      : data.RegistrationNo,
    panNo               : data.PanNao,
    gstin               : data.GstIn, 
    country             : data.Country,
    state               : data.State,
    city                : data.City,
    isCrmhave           : data.IsCrmHave,
    userRegisterApi     : data.UserRegisterApi, 
    userRegisterData    : data.UserRegisterData, 
    userDeactivateApi   : data.UserDeactivateApi, 
    userDeactivateData  : data.UserDeactivateData,
}

//New Initial Values
const newInitialValues =  {
    compName            : '', //max 100
    shortName           : '', //max 10 null
    empCodePrefix       : '', // 3 req
    empCodeSufix        : '', // 3 null
    phoneNo             : '', //10 null
    mobileNo            : '', // 10 req
    email               : '', //100 req
    address             : '', // Max req
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
    compName            : Yup.string().required('Company name is required').min(3,'Minimum 3 characters'),
    shortName           : Yup.string().max(10,"Maximum 10 characters"),
    empCodePrefix       : Yup.string().required('Employee code required').min(3,'Minimum 3 characters').max(3,"Maximum 3 characters"),
    empCodeSufix        : Yup.string().min(3,'Minimum 3 characters').max(3,"Maximum 3 characters"),
    mobileNo            : Yup.string().required('Mobile number required').min(10,'Minimum 10 digit').max(10,'Maximum 10 digit'),
    phoneNo             : Yup.string().min(10,'Minimum 10 digit').max(10,'Maximum 10 digit'),
    email               : Yup.string().email().required('Email is required').max(100,'Maximum 100 characters'),
    address             : Yup.string().required('Address required'),
    //city                : Yup.string().required('City required'),
   // state               : Yup.string().required('State required'),
    //country             : Yup.string().required('Country required'),
    postcode            : Yup.string().required('Postcode required').min(6,"Minimium 6 characters").max(6,'Maximum 6 characters'),
    geoLoc              : Yup.string().required('Register api required'),
    panNo               : Yup.string().max(10,"Maximum 10 characters"),
    gstin               : Yup.string().max(15,"Maximum 15 characters"),
    userRegisterApi     : isCrm ? Yup.string().required('Register api required') : '',
    userRegisterData    : isCrm ? Yup.string().required('Register data required') : '',
    userDeactivateApi   : isCrm ? Yup.string().required('Deactive api required') : '',
    userDeactivateData  : isCrm ? Yup.string().required('Deactive data required') : ''
})

//Additional Data
const additionalValues = {
    Id          : id,
    isCrmhave   : isCrm,
    country     : selectedCountry,
    state       : selectedState,
    city        : cityId,
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
            navigate('/companies/')
        }
        else if(res.data.result === 'Failed'){
            console.log(res.data.Msg);
            ToastLeft(msg,type)
            setLoading(true)
        }
    })
    on_submit.resetForm()
}

//Form Submission
const on_submit = useFormik({
    initialValues : oldInitialValues || newInitialValues,
    validationSchema,
    onSubmit,
    enableReinitialize:true,
})

return (
    <>
        <div className='row'>
            <div className='col-md-12'>
                <div className="form-group">
                    <Form.Label htmlFor='company_name'>Company name</Form.Label>
                    <input className="form-control" id='company_name' defaultValue={data.CompName} name="compName" required type="text" placeholder="Enter company name" 
                        onChange={on_submit.handleChange}
                        onBlur={on_submit.handleBlur}
                    />
                    {                              
                        on_submit.touched.compName &&  on_submit.errors.compName ?( 
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
                      <input className="form-control" defaultValue={data.ShortName} name="shortName" type="text" placeholder="Enter short name"
                          onChange={on_submit.handleChange}
                          onBlur={on_submit.handleBlur}
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
                      <input className="form-control" defaultValue={data.EmpCodePrefix} name="empCodePrefix" type="text" placeholder="Enter prefix"
                          onChange={on_submit.handleChange}
                          onBlur={on_submit.handleBlur}
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
                      <input className="form-control" defaultValue={data.EmpCodeSufix} name="empCodeSufix" type="text" placeholder="Enter suffix" 
                          onChange={on_submit.handleChange}
                          onBlur={on_submit.handleBlur}
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
                      <input className="form-control" defaultValue={data.MobileNo} name="mobileNo" required type="text" min={1} placeholder="Enter mobile number" 
                          onChange={on_submit.handleChange}
                          onBlur={on_submit.handleBlur}
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
                      <input className="form-control" defaultValue={data.PhoneNo} name="phoneNo" type="text" min={1} placeholder="Enter phone number" 
                          onChange={on_submit.handleChange}
                          onBlur={on_submit.handleBlur}
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
                      <input className="form-control" defaultValue={data.Email} name="email" required type="text" placeholder="Enter email id" 
                          onChange={on_submit.handleChange}
                          onBlur={on_submit.handleBlur}
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
                      <input className="form-control" defaultValue={data.Website} name="website" type="url" placeholder="Enter website url" 
                          onChange={on_submit.handleChange}
                          onBlur={on_submit.handleBlur}
                      />
                  </div>
              </div>
          </div>

          <div className='row'>
              <div className='col-md-4'>
                  <div className="form-group">
                      <Form.Label>Address</Form.Label>
                      <input className="form-control" defaultValue={data.Address} name="address" required type="text" placeholder="Enter address" 
                            onChange={on_submit.handleChange}
                            onBlur={on_submit.handleBlur}
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
                      <input className="form-control" defaultValue={data.Postcode} name="postcode" required type="url" placeholder="Enter postcode" 
                          onChange={on_submit.handleChange}
                          onBlur={on_submit.handleBlur}
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
                      <input className="form-control" defaultValue={data.GeoLoc} name="geoLoc" type="url" placeholder="Enter location" 
                          onChange={on_submit.handleChange}
                          onBlur={on_submit.handleBlur}
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
                      <select className='form-control' value={countryId} required={true} name="country" onChange={handleCountryChange}>
                          {
                              country.map((dt) => {
                                  return(
                                      <option key={dt.Id} value={dt.Id}>
                                          {dt.Name}
                                      </option>
                                  )
                              })
                          }
                      </select>
                      {                              
                          on_submit.touched.country &&  on_submit.errors.country ?( 
                              <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.country}</p> 
                          ): null
                      }
                  </div>
              </div>
              <div className='col-md-4'>
                  <div className="form-group">
                      <Form.Label>State</Form.Label>
                      <select className='form-control' value={stateId} required={true} name="state" onChange={handleStateChange} >
                          <option value="">Select state</option>  
                          {
                            state.map((dt) => {
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
                      <select className='form-control' value={cityId} required={true} name="city" onChange={handleCityChange} >
                          <option value="">Select city</option>  
                          {
                              city.map((dt) => {
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
                      <input className="form-control" defaultValue={data.RegistrationNo} name="registrationNo" type="text" placeholder="Enter register number" 
                          onChange={on_submit.handleChange}
                          onBlur={on_submit.handleBlur}
                      />
                  </div> 
              </div>
              <div className='col-md-4'>
                  <div className="form-group">
                      <Form.Label>Pan number</Form.Label>
                      <input className="form-control" defaultValue={data.PanNo} name="panNo" type="text" placeholder="Enter pan number" 
                          onChange={on_submit.handleChange}
                          onBlur={on_submit.handleBlur}
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
                      <input className="form-control" defaultValue={data.Gstin} name="gstin" type="text" placeholder="Enter gst number" 
                          onChange={on_submit.handleChange}
                          onBlur={on_submit.handleBlur}
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
                        <input className="form-control" name="userRegisterApi" defaultValue={data.UserRegisterApi} required type="url" placeholder="Enter user register api" 
                            onChange={on_submit.handleChange}
                            onBlur={on_submit.handleBlur}
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
                        <input className="form-control" name="userRegisterData" defaultValue={data.UserRegisterData} type="url" placeholder="Enter user register data" 
                            onChange={on_submit.handleChange}
                            onBlur={on_submit.handleBlur}
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
                        <input className="form-control" name="userDeactivateApi" defaultValue={data.UserDeactivateApi} type="url" placeholder="Enter user deactivate api" 
                            onChange={on_submit.handleChange}
                            onBlur={on_submit.handleBlur}
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
                        <input className="form-control" name="userDeactivateData" defaultValue={data.UserDeactivateData} type="url" placeholder="Enter user deactivate data" 
                            onChange={on_submit.handleChange}
                            onBlur={on_submit.handleBlur}
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

        <div className="submit text-end">
            { !loading ? <>
                <Button variant="danger" onClick={on_submit.handleReset}>
                    Close
                </Button> { }
                <Button variant="success" onClick={on_submit.handleSubmit}>
                    Update Company
                </Button>
                </> : (<Loader />)
            } 
        </div>      

    </>
  )
}
