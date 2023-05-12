import React, { useEffect, useState } from 'react'
import { Accordion,Card,Form, InputGroup } from 'react-bootstrap';
import PageHeader from '../../layouts/PageHeader/PageHeader';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { GETBLOOD, GETGENDER, GETMARITAL } from '../../services/api/Master';
import axios from 'axios';
import { getComId, getUserData } from '../../services/storage/Storage';
import Loader from '../../services/loader/Loader';
import { GETEDITCANDIDATE, GETRESUMEMASTERID, NEWCANDIDATE } from '../../services/api/Hrms';
import { isAuthenticated } from '../../services/Auth';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';
import { ToastLeft } from '../../services/notification/Notification';
import { ToastContainer } from 'react-toastify';
import { checkPermission } from '../../services/Permission';
import AuthError from '../authentication/errorPage/AuthError/AuthError';

const authToken = getUserData()

export default function UpdateCandidate(props) {
  const navigate = useNavigate()
  const {Param} = useParams()
  const [editSalutOption,setEditSalutOption] = useState({
    value : '',
    label : '',
  })

  const [loading,setLoading] = useState(false)
  const initialStateErrors = {
    MaritalStatus     : { required:false },
    Gender            : { required:false },
    BloodGroup        : { required:false },
    DateOfBirth       : { required:false },
    PermenentAddress  : { required:false },
    PresentAddress    : { required:false },
  }
  const [errors,setErrors] = useState(initialStateErrors)

  //MASTER ID
  const [masterId,setMasterId] = useState('')

  const [data,setData] = useState([])
  //LICIENCE
  const [isLicence, setIsLicence] = useState(false);
  const handleLicenceCheckboxChange = (event) => {
    setIsLicence(event.target.checked);
  }

  //VEHICLE
  const [isVehicle, setisVehicle] = useState(false);
  const handleVichleCheckboxChange = (event) => {
    setisVehicle(event.target.checked);
  }

  //READY TO RELOCATE
  const [isRelocate, setIsRelocate] = useState(false);
  const handleRelocateCheckboxChange = (event) => {
    setIsRelocate(event.target.checked);
  }

  //Date picker
  const [Datevalue, setDatevalue] = useState(null);
  
  //AGE CALCULATE
  const [age, setAge] = useState("");
  const calculateAge = () => {
    if(Datevalue !== null){
      const inputYear   = Datevalue.$y;
      const currentYear = new Date().getFullYear();
      console.log(parseInt(currentYear - inputYear));
      setAge(parseInt(currentYear - inputYear))
    }
    else{
      setAge("")
    }
  }

  //ADDRESS
  const [permanentAddress, setPermanentAddress] = useState('');
  const [presentAddress, setPresentAddress] = useState('');
  const [sameAddress, setSameAddress] = useState(false);
  const handlePermanentAddressChange = (event) => {
    const { value } = event.target;
    setPermanentAddress(value);
    if (sameAddress) {
      setPresentAddress(value);
    }
  }
  const handleSameAddressChange = (event) => {
    const { checked } = event.target;
    setSameAddress(checked);
    if (checked) {
      setPresentAddress(permanentAddress);
    }
  }  
 
  //SALUTOPTION
  const [salutId,setSalutId] = useState('')
  const [selectedSalut,setSelectedSault] = useState('')
  const salutOption  = [
        {...editSalutOption},
        { id:1,value: "Mr", label: "Mr" },
        { id:2,value: "Miss", label: "Miss" },
        { id:3,value: "Mrs", label: "Mrs" },
  ];
  const handleSalutChange = (event) => {
    setSelectedSault(event.target.value);
  }; 

  //LICIENCE TYPE
  const [licenceTypeId,setLicenceTypeId] = useState('')
  const [selectedLicenceType,setSeletedLicienceType] = useState('')
  const licenceType = [
    { id:1,value: "Two wheeler only", label: "Two wheeler only" },
    { id:2,value: "Two/Four wheeler only", label: "Two/Four wheeler only" },
    { id:3,value: "Batch ", label: "Batch " },
    { id:4,value: "Heavy", label: "Heavy" },
  ];
  const handleLicenceTypeChange = (event) => {
    setSeletedLicienceType(event.target.value);
  }; 

  //GENDER
  const [gender,setGender] = useState([])
  const [genderId,setGenderId] = useState('')
  const [selectedGender,setSelectedGender] = useState()
  const handleGenderChange = (event) => {
    setGenderId(event.target.value)
    setSelectedGender(event.target.value);
  }; 
  
  //MARITAL
  const [marital,setMarital] = useState([])
  const [martialId,setMartialId] = useState('')
  const [selectedMarital,setSelectedMarital] = useState()
  const handleMartialChange = (event) => {
    setMartialId(event.target.value)
    setSelectedMarital(event.target.value);
  }; 

  //BLOOD GROUP
  const [bloodGroup,setBloodGroup] = useState([])
  const [bloodGroupId,setBloodGroupId] = useState('')
  const [selectedBlood,setSelectedBlood] = useState()
  const handleBloodChange = (event) => {
    setBloodGroupId(event.target.value)
    setSelectedBlood(event.target.value);
  }; 

  //RESUME
  const [resume,setResume] = useState('')
  const fileHandle = (e) => {
    setResume(e.target.files[0])
  }

  //GET API
  const getGender = (() => {
    try {
          GETGENDER().then((res) => {
            setGender(res.data.Data)
        })
    } catch (error) {
        console.log(error);
    }
  })

  const getBlood = (() => {
    try {
          GETBLOOD().then((res) => {
            setBloodGroup(res.data.Data)
        })
    } catch (error) {
        console.log(error);
    }
  })

  const getMirital = (() => {
    try {
          GETMARITAL().then((res) => {
            setMarital(res.data.Data)
        })
    } catch (error) {
        console.log(error);
    }
  })

  const getMasterId = () => {
    GETRESUMEMASTERID().then(res => {
      setMasterId(res.data.Data.Id)
  })
  
  }

  const getEditCanditate = () => {
    GETEDITCANDIDATE(props.id).then(res => {
      setData(res.data.Data);
      setSalutId(res.data.Data.Salut)
      setLicenceTypeId(res.data.Data.LicenceType)
      setGenderId(res.data.Data.Gender)
      setBloodGroupId(res.data.Data.BloodGroup)
      if(res.data.Data.IsLicenseHave)   setIsLicence(true);
      if(res.data.Data.IsVehicleHave)   setisVehicle(true);
      if(res.data.Data.ReadyToRelocate) setIsRelocate(true);
    })
  }

  //Initial values
  const initialValues = {
    CompId                  : '',
    Master_Id               : '',
    //PERSONAL
    FirstName               : '',
    MiddleName              : '',
    LastName                : '',
    PersonalEmail           : '',
    Mob                     : '',
    Mob1                    : '',
    //FAMILY
    FatherName              : '',
    FatherOccupation        : '',
    MotherName              : '',
    MotherOccupation        : '',
    HusbandorWifeName       : '',
    HusbandorWifeOccupation : '',
    NoOfChildrens           : '',
    //KYC
    AadharNumber            : '',
    PanNumber               : '',
    PassportNumber          : '',
    LicenceNumber           : '',
    //ADDITIONAL
    SpecialSkills           : '',
    Remarks                 : '',
    ExpectedSal             : '',
  }

  //Validation
  const validationSchema = Yup.object({
    // FirstName               : Yup.string().required("Please enter required fields"),
    // LastName                : Yup.string().required("Please enter required fields"),
    // FatherName              : Yup.string().required("Please enter required fields"),
    // FatherOccupation        : Yup.string().required("Please enter required fields"),
    // MotherName              : Yup.string().required("Please enter required fields"),
    // MotherOccupation        : Yup.string().required("Please enter required fields"),
    // AadharNumber            : Yup.string().required("Please enter required fields"),
    // PanNumber               : Yup.string().required("Please enter required fields"),
    // PersonalEmail           : Yup.string().required("Please enter required fields"),
    // Mob                     : Yup.string().required("Please enter required fields"),
    // Mob1                    : Yup.string().required("Please enter required fields"),
    // ExpectedSal             : Yup.string().required("Please enter required fields"),
  })

  //Submit Data
  const onSubmit = values => {
    let errors    = initialStateErrors
    let hasError  = false

    console.log("==================================");
    console.log(selectedSalut,selectedGender,selectedBlood,selectedMarital,selectedLicenceType);
    console.log("==================================");

    const dob = Datevalue.$y + "/" + parseInt(Datevalue.$M + 1) + "/" + Datevalue.$D

    const additional = {
      CompId          : getComId(),
      Master_Id       : masterId,
      Salut           : selectedSalut,
      Gender          : selectedGender,
      BloodGroup      : selectedBlood,
      MaritalStatus   : selectedMarital,
      PermenentAddress: permanentAddress,
      PresentAddress  : presentAddress,
      IsLicenseHave   : isLicence,
      LicenceType     : selectedLicenceType,
      IsVehicleHave   : isVehicle,
      ReadyToRelocate : isRelocate,
      DateOfBirth     : dob,
      Age             : age,
      FileURI         : resume, 
    }
    const data = {...values,...additional}

    // if(selectedGender.value === "" || null || undefined ){
    //   errors.Gender.required = true
    //   hasError = true
    // }
    if(Datevalue === "" || null || undefined){
      errors.DateOfBirth.required = true
      hasError = true
    }
    if(selectedBlood.value === "" || null || undefined ){
      errors.BloodGroup.required = true
      hasError = true
    }
    if(selectedMarital.value === "" || null || undefined){
      errors.MaritalStatus.required = true
      hasError = true
    }
    if(permanentAddress === "" || null || undefined ){
      errors.PermenentAddress.required = true
      hasError = true
    }
    if(presentAddress === "" || null || undefined ){
      errors.PresentAddress.required = true
      hasError = true
    }

    if(!hasError){
      NEWCANDIDATE(data).then(res => {
        const type = res.data.result
        const msg = res.data.Msg 
        if(res.data.result === 'success'){
            ToastLeft(msg,type)
            setLoading(false)
            on_submit.handleReset()
        }
        else if(res.data.result === 'Failed'){
            console.log(res.data.Msg);
            ToastLeft(msg,type)
            setLoading(true)
        }
      }).catch(err => {
        ToastLeft(err.message,"Failed");
      }).finally(() => {
        setLoading(false)
      })
    }
    setErrors({...errors})
  }

  //FORM SUBMISSION
  const on_submit = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
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
      getEditCanditate()
      getGender()
      getBlood()
      getMirital()
      getMasterId()
  },[])

  useEffect(() => {

  },[])

  if(!isAuthenticated()){
    navigate('/')
  }
  return (
    <>
        <ToastContainer />
        <div className='panel-group1'>
          {/* PERSONAL */}
          <div className='mb-4'>
            <Accordion defaultActiveKey="0" className="demo-accordion accordionjs m-0">
              <Accordion.Item eventKey="0" className="acc_section ">
                <Accordion.Header className="acc_head">Personal Information</Accordion.Header>
                <Accordion.Body>
                  <section>
                    <div className='row'>
                      <div className="col-md-4 mb-1">
                        <Form.Group>
                          <Form.Label htmlFor='FirstName'>First name <span className='text-danger'>*</span></Form.Label>
                          <InputGroup className='my-3'>
                              <select className='form-control' value={salutId} onChange={handleSalutChange} name='Salut' required={true}>
                                {
                                  salutOption.map(dt => <option key={dt.id} value={dt.value}>{dt.label}</option>)
                                }
                              </select>
                              <input className="form-control" id='FirstName' value={data.FirstName} name="FirstName" required type="text" placeholder="Enter first name" 
                                  onChange={on_submit.handleChange} onBlur={on_submit.handleBlur}
                              />
                          </InputGroup>
                          {                              
                            on_submit.touched.FirstName && on_submit.errors.FirstName ?( 
                                <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.FirstName}</p> 
                            ): null
                          }
                        </Form.Group>
                      </div>
                      {/* <div className='col-md-3'>
                          <div className="form-group">
                              <Form.Label htmlFor='FirstName'>First name <span className='text-danger'>*</span></Form.Label>
                              <input className="form-control" id='FirstName' name="FirstName" required type="text" placeholder="Enter first name" 
                                  onChange={on_submit.handleChange} onBlur={on_submit.handleBlur}
                              />
                              {                              
                                on_submit.touched.FirstName && on_submit.errors.FirstName ?( 
                                    <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.FirstName}</p> 
                                ): null
                              }
                          </div>
                      </div> */}
                      <div className='col-md-4'>
                          <div className="form-group">
                              <Form.Label htmlFor='MiddleName'>Middle name</Form.Label>
                              <input className="form-control" id='MiddleName' value={data.MiddleName} name="MiddleName" required type="text" placeholder="Enter middle name" 
                                  onChange={on_submit.handleChange} onBlur={on_submit.handleBlur}
                              />
                              {                              
                                on_submit.touched.MiddleName &&  on_submit.errors.MiddleName ?( 
                                    <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.MiddleName}</p> 
                                ): null
                              }
                          </div>
                      </div>
                      <div className='col-md-4'>
                          <div className="form-group">
                              <Form.Label htmlFor='LastName'>Last name <span className='text-danger'>*</span></Form.Label>
                              <input className="form-control" id='LastName' defaultValue={data.LastName} name="LastName" required type="text" placeholder="Enter last name" 
                                  onChange={on_submit.handleChange} onBlur={on_submit.handleBlur}
                              />
                              {                              
                                  on_submit.touched.LastName &&  on_submit.errors.LastName ?( 
                                      <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.LastName}</p> 
                                  ): null
                              }
                          </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <Form.Group>
                          <Form.Label htmlFor='Gender'>Gender <span className='text-danger'>*</span></Form.Label>
                          <select className='form-control' value={genderId} onChange={handleGenderChange} required={true} name="Gender">
                          {
                              gender.map((dt) => {
                                  return(
                                      <option key={dt.Id} value={dt.Id}>
                                          {dt.GenName}
                                      </option>
                                  )
                              })
                          }
                          </select>
                          {                              
                            errors.Gender.required ? <p style={{fontSize:'14px'}} className='text-danger'>Field is required</p> : null
                          }
                        </Form.Group>
                      </div>
                      <div className='col-md-6'>
                        <Form.Group>
                          <Form.Label htmlFor='BloodGroup'>Blood group <span className='text-danger'>*</span></Form.Label>
                          <select className='form-control' value={bloodGroupId} onChange={handleBloodChange} required={true} name="BloodGroup">
                            {
                              bloodGroup.map(dt => <option key={dt.Id} value={dt.Id}>{dt.Name}</option>)
                            }
                          </select>
                          {                              
                            errors.BloodGroup.required ? <p style={{fontSize:'14px'}} className='text-danger'>Field is required</p> : null
                          }
                        </Form.Group>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-4'>
                        <div className="form-group">
                          <Form.Label htmlFor='email'>Email <span className='text-danger'>*</span></Form.Label>
                          <input className="form-control" id='email' defaultValue={data.PersonalEmail} name="PersonalEmail" required type="email" placeholder="Enter personal email" 
                            onChange={on_submit.handleChange} onBlur={on_submit.handleBlur} />
                          {                              
                            on_submit.touched.PersonalEmail  &&  on_submit.errors.PersonalEmail  ?( 
                                <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.PersonalEmail }</p> 
                            ): null
                          }
                        </div>
                      </div>
                      <div className='col-md-4'>
                        <div className="form-group">
                          <Form.Label htmlFor='Mob'>Mobile no 1 <span className='text-danger'>*</span></Form.Label>
                          <input className="form-control" id='Mob' defaultValue={data.Mob} name="Mob" required type="text" placeholder="Enter mobile no" 
                            onChange={on_submit.handleChange} onBlur={on_submit.handleBlur} />
                          {                              
                            on_submit.touched.Mob  &&  on_submit.errors.Mob  ?( 
                                <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.Mob }</p> 
                            ): null
                          }
                        </div>
                      </div>
                      <div className='col-md-4'>
                        <div className="form-group">
                          <Form.Label htmlFor='Mob1'>Mobile no 2 <span className='text-danger'>*</span></Form.Label>
                          <input className="form-control" id='Mob1' defaultValue={data.Mob1} name="Mob1" required type="text" placeholder="Enter mobile no" 
                            onChange={on_submit.handleChange} onBlur={on_submit.handleBlur} />   
                          {                              
                            on_submit.touched.Mob1  &&  on_submit.errors.Mob1  ?( 
                                <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.Mob1 }</p> 
                            ): null
                          }
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className="form-group">
                          <Form.Label htmlFor='DateOfBirth'>DOB <span className='text-danger'>*</span></Form.Label>
                          <InputGroup>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker value={data.DateOfBirth} onChange={setDatevalue} style={{height:'41px'}} renderInput={(params) => <TextField {...params} />}/>
                            </LocalizationProvider>
                          </InputGroup>                        
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className="form-group">
                          <Form.Label htmlFor='Age'>Age <span className='text-danger'>*</span></Form.Label>
                          <input className="form-control" id='Age' name="Age" required type="number" value={data.Age} min={18} placeholder="Enter age" 
                          onMouseEnter={calculateAge} onChange={on_submit.handleChange} onBlur={on_submit.handleBlur} />
                          {                              
                            on_submit.touched.Age &&  on_submit.errors.Age ?( 
                                <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.Age}</p> 
                            ): null
                          }
                        </div>
                      </div>
                    </div>
                  </section>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          {/* FAMILY */}
          <div className='mb-4'>
            <Accordion defaultActiveKey="2" className="demo-accordion accordionjs m-0">
              <Accordion.Item eventKey="2" className="acc_section ">
                <Accordion.Header className="acc_head">Family Information</Accordion.Header>
                <Accordion.Body>
                  <section>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className="form-group">
                          <Form.Label htmlFor='FatherName'>Father name <span className='text-danger'>*</span></Form.Label>
                          <input className="form-control" id='FatherName' defaultValue={data.FatherName} name="FatherName" required type="text" placeholder="Enter father name" 
                            onChange={on_submit.handleChange}
                            onBlur={on_submit.handleBlur}
                          />
                          {                              
                            on_submit.touched.FatherName  &&  on_submit.errors.FatherName  ?( 
                                <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.FatherName }</p> 
                            ): null
                          }
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className="form-group">
                          <Form.Label htmlFor='FatherOccupation'>Father occupation <span className='text-danger'>*</span></Form.Label>
                          <input className="form-control" id='FatherOccupation' defaultValue={data.FatherOccupation} name="FatherOccupation" required type="text" placeholder="Enter father occupation" 
                            onChange={on_submit.handleChange}
                            onBlur={on_submit.handleBlur}
                          />
                          {                              
                            on_submit.touched.FatherOccupation  &&  on_submit.errors.FatherOccupation  ?( 
                                <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.FatherOccupation }</p> 
                            ): null
                          }
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className="form-group">
                          <Form.Label htmlFor='MotherName'>Mother name <span className='text-danger'>*</span></Form.Label>
                          <input className="form-control" id='MotherName' defaultValue={data.MotherName} name="MotherName" required type="text" placeholder="Enter mother name" 
                            onChange={on_submit.handleChange}
                            onBlur={on_submit.handleBlur}
                          />
                          {                              
                            on_submit.touched.MotherName  &&  on_submit.errors.MotherName  ?( 
                                <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.MotherName }</p> 
                            ): null
                          }
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className="form-group">
                          <Form.Label htmlFor='MotherOccupation'>Mother occupation <span className='text-danger'>*</span></Form.Label>
                          <input className="form-control" id='MotherOccupation' defaultValue={data.MotherOccupation} name="MotherOccupation" required type="text" placeholder="Enter mother occupation " 
                            onChange={on_submit.handleChange}
                            onBlur={on_submit.handleBlur}
                          />
                          {                              
                            on_submit.touched.MotherOccupation  &&  on_submit.errors.MotherOccupation  ?( 
                                <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.MotherOccupation }</p> 
                            ): null
                          }
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-3'>
                        <Form.Group>
                          <Form.Label htmlFor='MaritalStatus'>Marital status <span className='text-danger'>*</span></Form.Label>
                          <select className='form-control' value={martialId} onChange={handleMartialChange} required={true} name="MaritalStatus">
                            {
                              marital.map(dt => <option key={dt.Id} value={dt.Id}>{dt.Name}</option>)
                            }
                          </select>
                          {                              
                            errors.MaritalStatus.required ? <p style={{fontSize:'14px'}} className='text-danger'>Field is required</p> : null
                          }
                        </Form.Group>
                      </div>
                      {
                        selectedMarital && selectedMarital === 2 ? (
                        <>
                          <div className='col-md-3'>
                            <div className="form-group">
                              <Form.Label htmlFor='HusbandorWifeName'>Husband or wife name </Form.Label>
                              <input className="form-control" id='HusbandorWifeName' defaultValue={data.HusbandorWifeName} name="HusbandorWifeName" required type="text" placeholder="Enter husband or wife name " 
                                onChange={on_submit.handleChange}
                                onBlur={on_submit.handleBlur}
                              />
                              {                              
                                on_submit.touched.HusbandorWifeName &&  on_submit.errors.HusbandorWifeName ?( 
                                    <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.HusbandorWifeName}</p> 
                                ): null
                              }
                            </div>
                          </div>
                          <div className='col-md-3'>
                            <div className="form-group">
                              <Form.Label htmlFor='HusbandorWifeOccupation'>Husband or wife occupation </Form.Label>
                              <input className="form-control" id='HusbandorWifeOccupation' defaultValue={data.HusbandorWifeOccupation} name="HusbandorWifeOccupation" required type="text" placeholder="Enter husband or wife occupation " 
                                onChange={on_submit.handleChange}
                                onBlur={on_submit.handleBlur}
                              />
                              {                              
                                on_submit.touched.HusbandorWifeOccupation && on_submit.errors.HusbandorWifeOccupation ?( 
                                    <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.HusbandorWifeOccupation}</p> 
                                ): null
                              }
                            </div>
                          </div>
                          <div className='col-md-3'>
                            <div className="form-group">
                              <Form.Label htmlFor='NoOfChildrens'>No of childrens </Form.Label>
                              <input className="form-control" id='NoOfChildrens' defaultValue={data.NoOfChildrens} name="NoOfChildrens" required type="text" placeholder="Enter no of childrens" 
                                onChange={on_submit.handleChange}
                                onBlur={on_submit.handleBlur}
                              />
                              {                              
                                on_submit.touched.NoOfChildrens &&  on_submit.errors.NoOfChildrens ?( 
                                    <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.NoOfChildrens}</p> 
                                ): null
                              }
                            </div>
                          </div>
                        </>
                        ) : ''
                      }
                    </div>
                  </section>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          {/* ADDRESS */}
          <div className='mb-4'>
            <Accordion defaultActiveKey="3" className="demo-accordion accordionjs m-0">
              <Accordion.Item eventKey="3" className="acc_section ">
                <Accordion.Header className="acc_head">Address Details</Accordion.Header>
                <Accordion.Body>
                  <section>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className="form-group">
                          <Form.Label>Permenent address <span className='text-danger'>*</span></Form.Label>
                          <textarea className="form-control mb-4" defaultValue={data.PermenentAddress} name="PermenentAddress" required placeholder="Enter permenent address" rows={4}
                          onChange={handlePermanentAddressChange}
                          onBlur={on_submit.handleBlur}
                          ></textarea>
                          {
                            errors.PermenentAddress.required ? <p style={{fontSize:'14px'}} className='text-danger'>Field is required</p> : ''
                          }
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-4'>
                          <div className="form-group">
                            Same as permenent address?   
                              <div className="material-switch pull-right">
                                  <input id="isSameAddress" name="isSameAddress" checked={sameAddress} type="checkbox" 
                                    onChange={handleSameAddressChange}
                                    onBlur={on_submit.handleBlur}
                                  />
                                  <label htmlFor="isSameAddress" className="label-success"></label>
                              </div>
                          </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className="form-group">
                          <Form.Label>Present address <span className='text-danger'>*</span></Form.Label>
                          <textarea className="form-control mb-4" value={data.presentAddress} disabled={sameAddress} name="PresentAddress" required placeholder="Enter present address" rows={4}
                            onChange={(event) => setPresentAddress(event.target.value)}
                            onBlur={on_submit.handleBlur}
                          ></textarea>
                          {
                            errors.PresentAddress.required ? <p style={{fontSize:'14px'}} className='text-danger'>Field is required</p> : ''
                          }
                        </div>
                      </div>
                    </div>
                  </section>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          {/* KYC */}
          <div className='mb-4'>
            <Accordion defaultActiveKey="4" className="demo-accordion accordionjs m-0">
              <Accordion.Item eventKey="4" className="acc_section ">
                <Accordion.Header className="acc_head">KYC Details</Accordion.Header>
                <Accordion.Body>
                  <section>
                    <div className='row'>
                      <div className='col-md-5'>
                          <div className="form-group">
                              <Form.Label htmlFor='AadharNumber'>Aadhar number <span className='text-danger'>*</span></Form.Label>
                              <input className="form-control" id='AadharNumber' defaultValue={data.AadharNumber} name="AadharNumber" required type="text" placeholder="Enter Aadhar number" 
                                onChange={on_submit.handleChange}
                                onBlur={on_submit.handleBlur}
                              />
                              {                              
                                  on_submit.touched.AadharNumber  &&  on_submit.errors.AadharNumber  ?( 
                                      <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.AadharNumber }</p> 
                                  ): null
                              }
                          </div>
                      </div>
                      <div className='col-md-3'>
                          <div className="form-group">
                              <Form.Label htmlFor='PanNumber'>Pan number <span className='text-danger'>*</span></Form.Label>
                              <input className="form-control" id='PanNumber' defaultValue={data.PanNumber} name="PanNumber" required type="text" placeholder="Enter Pan number " 
                                onChange={on_submit.handleChange}
                                onBlur={on_submit.handleBlur}
                              />
                              {                              
                                  on_submit.touched.PanNumber &&  on_submit.errors.PanNumber  ?( 
                                      <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.PanNumber }</p> 
                                  ): null
                              }
                          </div>
                      </div>
                      <div className='col-md-4'>
                          <div className="form-group">
                              <Form.Label htmlFor='PassportNumber'>Passport number</Form.Label>
                              <input className="form-control" id="PassportNumber" defaultValue={data.PassportNumber} name="PassportNumber" required type="text" placeholder="Enter passport number" 
                                onChange={on_submit.handleChange}
                                onBlur={on_submit.handleBlur}
                              />
                              {                              
                                  on_submit.touched.PassportNumber &&  on_submit.errors.PassportNumber ?( 
                                      <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.PassportNumber}</p> 
                                  ): null
                              }
                          </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-2'>
                        <div className="form-group">
                          <Form.Label><br></br></Form.Label>
                          Have Vehicle ? <span className='text-danger'>*</span> 
                            <div className="material-switch pull-right">
                                <input id="isVehicle" name="IsVehicleHave" type="checkbox"
                                  onChange={handleVichleCheckboxChange}
                                />
                                <label htmlFor="isVehicle" className="label-success"></label>
                            </div>
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className="form-group">
                        <Form.Label><br></br></Form.Label>
                          have License ? <span className='text-danger'>*</span>
                            <div className="material-switch pull-right">
                                <input id="isLicense" name="IsLicenseHave" checked={isLicence} type="checkbox"
                                  onChange={handleLicenceCheckboxChange}
                                  onBlur={on_submit.handleBlur}
                                />
                                <label htmlFor="isLicense" className="label-success"></label>   
                            </div>
                        </div>
                      </div>
                      {
                        isLicence ? (<>
                          <div className='col-md-3'>
                            <div className="form-group">
                              <Form.Group>
                                <Form.Label>Licence type</Form.Label>
                                <select className='form-control' name='LicenceType' onChange={handleLicenceTypeChange} value={licenceTypeId}>
                                  {
                                    licenceType.map(dt => <option key={dt.id} value={dt.value}>{dt.label}</option>)
                                  }
                                </select>
                                {                              
                                  on_submit.touched.LicenceType  &&  on_submit.errors.LicenceType  ?( 
                                    <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.LicenceType }</p> 
                                  ): null
                                }
                              </Form.Group>
                            </div>
                          </div> 
                          <div className='col-md-4'>
                            <div className="form-group">
                              <Form.Label htmlFor='LicenceNumber'>Licence number</Form.Label>
                              <input className="form-control" id='LicenceNumber' defaultValue={data.FirstName} name="LicenceNumber" required type="text" placeholder="Enter licence number" 
                                onChange={on_submit.handleChange}
                                onBlur={on_submit.handleBlur}
                              />
                              {                              
                                on_submit.touched.LicenceNumber  &&  on_submit.errors.LicenceNumber  ?( 
                                    <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.LicenceNumber }</p> 
                                ): null
                              }
                            </div>
                          </div>
                        </>) : ''
                      } 
                    </div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <Form.Group>
                          <Form.Label className="form-label mt-0">Select Resume <span className='text-danger'>*</span></Form.Label>
                          <Form.Control type="file" name='FileURI' onChange={fileHandle} accept=".pdf"
                            onBlur={on_submit.handleBlur}
                          />
                          {                              
                            on_submit.touched.FileURI  &&  on_submit.errors.FileURI  ?( 
                                <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.FileURI }</p> 
                            ): null
                          }
                        </Form.Group>
                      </div>
                    </div>
                  </section>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          {/* ADDITIONAL */}
          <div className='mb-4'>
            <Accordion defaultActiveKey="5" className="demo-accordion accordionjs m-0">
              <Accordion.Item eventKey="5" className="acc_section ">
                <Accordion.Header className="acc_head">Additional Details</Accordion.Header>
                <Accordion.Body>
                  <section>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className="form-group">
                          <Form.Label>Special skils </Form.Label>
                          <textarea className="form-control mb-4" defaultValue={data.FirstName} name="SpecialSkills" required placeholder="Enter special skills" rows={4}
                            onChange={on_submit.handleChange}
                            onBlur={on_submit.handleBlur}
                          ></textarea>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className="form-group">
                          <Form.Label>Remarks </Form.Label>
                          <textarea className="form-control mb-4" defaultValue={data.FirstName} name="Remarks" required placeholder="Enter remarks" rows={4}
                            onChange={on_submit.handleChange}
                            onBlur={on_submit.handleBlur} 
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className="form-group">
                            <Form.Label htmlFor='ExpectedSal'>Expected Salary <span className='text-danger'>*</span></Form.Label>
                            <input className="form-control" id='ExpectedSal' defaultValue={data.FirstName} name="ExpectedSal" required type="text" placeholder="Enter expected salary" 
                              onChange={on_submit.handleChange}
                              onBlur={on_submit.handleBlur}
                            />
                            {                              
                                on_submit.touched.ExpectedSal  &&  on_submit.errors.ExpectedSal  ?( 
                                    <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.ExpectedSal }</p> 
                                ): null
                            }
                        </div>
                      </div>
                      <div className='col-md-3'>
                          <div className="form-group">
                            <Form.Label><br></br></Form.Label>
                            Ready to relocate  ? <span className='text-danger'>*</span>
                            <div className="material-switch pull-right">
                                <input id="ReadyToRelocate" name="ReadyToRelocate" type="checkbox" 
                                  onChange={handleRelocateCheckboxChange}
                                />
                                <label htmlFor="ReadyToRelocate" className="label-success"></label>
                            </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          {
            !loading ?  (
              <div className="submit text-end">
                  <button className='btn btn-md btn-danger' onClick={on_submit.handleReset}>
                      Close
                  </button> {  }

                  <button className='btn btn-md btn-success' onClick={on_submit.handleSubmit} type="submit">
                    Save Changes
                  </button>
              </div>
            )  : (<Loader />)
          }
        </div>
    </>
  )
}
