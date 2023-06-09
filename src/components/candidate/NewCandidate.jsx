import React, { useEffect, useState } from 'react'
import { Accordion,Card,Form, InputGroup } from 'react-bootstrap';
import PageHeader from '../../layouts/PageHeader/PageHeader';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { getComId } from '../../services/storage/Storage';
import Loader from '../../services/loader/Loader';
import { GETRESUMEMASTERID, NEWCANDIDATE } from '../../services/api/Hrms';
import { isAuthenticated } from '../../services/Auth';
import { Link, useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';
import { ToastLeft } from '../../services/notification/Notification';
import { ToastContainer } from 'react-toastify';
import { checkPermission } from '../../services/Permission';
import AuthError from '../authentication/errorPage/AuthError/AuthError';
import { useDispatch, useSelector } from 'react-redux';
import GenderModel from '../../pages/master/models/GenderModel';
import BloodModel from '../../pages/master/models/BloodModel';
import MaritalModel from '../../pages/master/models/MaritalModel';
import { fetchGenderData } from '../../Redux/slice/Master/Gender';
import { fetchBloodGroupData } from '../../Redux/slice/Master/BloodGroup';
import { fetchMaritalData } from '../../Redux/slice/Master/Marital';

export default function NewEmployee() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
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
  const salutOption  = [
      { value: "Mr", label: "Mr" },
      { value: "Miss", label: "Miss" },
      { value: "Mrs", label: "Mrs" },
  ];
  const [selectedSalut,setSelectedSault] = useState('')

  //LICIENCE TYPE
  const licenceType = [
      { value: "Two wheeler only", label: "Two wheeler only" },
      { value: "Two/Four wheeler only", label: "Two/Four wheeler only" },
      { value: "Batch ", label: "Batch " },
      { value: "Heavy", label: "Heavy" },
  ];
  const [selectedLicenceType,setSeletedLicienceType] = useState('')
  
  //GENDER
  const [selectedGender,setSelectedGender] = useState()
  
  //MARITAL
  const [selectedMarital,setSelectedMarital] = useState()

  //BLOOD GROUP
  const [selectedBlood,setSelectedBlood] = useState()

  //RESUME
  const [resume,setResume] = useState('')
  const fileHandle = (e) => {
    setResume(e.target.files[0])
  }

  //GET API
  const [gender,setGender]    = useState()
  const [bloodGroup,setBlood] = useState()
  const [marital,setMarital]  = useState()
  const gender_list     = useSelector((state) => state.gender.genderList.Data)
  const bloodGroupList  = useSelector((state) => state.bloodGroup.bloodGroupList.Data)
  const matrial_list    = useSelector((state) => state.marital.maritalList.Data)

  useEffect(() => {
    const getGender = (() => {
        if (gender_list) {
            const drobValue = gender_list.filter(dt => dt.IsActive).map((res) => ({
                value : res.Id,
                label : res.GenName                    
            }))
            setGender(drobValue)
        }
    })
    const getBlood = (() => {
        if (bloodGroupList) {
            const drobValue = bloodGroupList.filter(dt => dt.IsActive).map((res) => ({
                value : res.Id,
                label : res.Name                    
            }))
            setBlood(drobValue)
        }
    })
    const getMarital = (() => {
        if (matrial_list) {
            const drobValue = matrial_list.filter(dt => dt.IsActive).map((res) => ({
                value : res.Id,
                label : res.Name                    
            }))
            setMarital(drobValue)
        }
    })

    getGender()
    getBlood()
    getMarital()
  },[gender_list,bloodGroupList,matrial_list,dispatch])
  

  const getMasterId = () => {
    GETRESUMEMASTERID().then(res => {
      setMasterId(res.data.Data.Id)
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
    FirstName               : Yup.string().required("Please enter required fields"),
    LastName                : Yup.string().required("Please enter required fields"),
    FatherName              : Yup.string().required("Please enter required fields"),
    FatherOccupation        : Yup.string().required("Please enter required fields"),
    MotherName              : Yup.string().required("Please enter required fields"),
    MotherOccupation        : Yup.string().required("Please enter required fields"),
    AadharNumber            : Yup.string().required("Please enter required fields"),
    PanNumber               : Yup.string().required("Please enter required fields"),
    PersonalEmail           : Yup.string().required("Please enter required fields"),
    Mob                     : Yup.string().required("Please enter required fields"),
    Mob1                    : Yup.string().required("Please enter required fields"),
    ExpectedSal             : Yup.string().required("Please enter required fields"),
  })

  //Submit Data
  const onSubmit = values => {
    let errors    = initialStateErrors
    let hasError  = false

    const dob = Datevalue.$y + "/" + parseInt(Datevalue.$M + 1) + "/" + Datevalue.$D
    const additional = {
      CompId          : getComId(),
      Master_Id       : masterId,
      Salut           : selectedSalut.value,
      Gender          : selectedGender.value,
      BloodGroup      : selectedBlood.value,
      MaritalStatus   : selectedMarital.value,
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

    if(selectedGender.value === "" || null || undefined ){
      errors.Gender.required = true
      hasError = true
    }
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
      getMasterId()
  },[])

  const [isGenderModalOpen, setIsGenderModalOpen]   = useState(false);
  const [isBloodModalOpen, setIsBloodModalOpen]     = useState(false);
  const [isMaritalModalOpen, setIsMaritalModalOpen] = useState(false);

  const openGenderModal   = () => setIsGenderModalOpen(true);
  const openBloodModal    = () => setIsBloodModalOpen(true);
  const openMaritalModal  = () => setIsMaritalModalOpen(true);
  const closeGenderModal  = () => setIsGenderModalOpen(false);
  const closeBloodModal   = () => setIsBloodModalOpen(false);
  const closeMaritalModal = () => setIsMaritalModalOpen(false);

  useEffect(() => {
    dispatch(fetchGenderData())  
    dispatch(fetchBloodGroupData())  
    dispatch(fetchMaritalData())  
  },[dispatch])

  if(!isAuthenticated()){
    navigate('/')
  }

  return (
    <>
    <PageHeader titles="New Candidate" active="Candidate" items={['Company']} />
    <ToastContainer />
    
    <GenderModel  isOpen={isGenderModalOpen}  onClose={closeGenderModal} />
    <BloodModel   isOpen={isBloodModalOpen}   onClose={closeBloodModal} />
    <MaritalModel isOpen={isMaritalModalOpen} onClose={closeMaritalModal} />

    <Card>
      <Card.Header className='d-sm-flex justify-content-between align-items-center d-block'>
        <Card.Title className='mb-3 mb-sm-0'>New Candidate</Card.Title>
        {
          checkPermission('Candidates_List') ? <Link to={'/candidates'} style={{float:'right'}} className='d-flex ms-auto mx-2 btn btn-success'>Candidate List</Link> : ''
        }
      </Card.Header>
      <Card.Body>
      {
        checkPermission('Candidates_Add') ? (<>
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
                              <Select classNamePrefix="Select" name='Salut' value={selectedSalut} onChange={setSelectedSault} options={salutOption} placeholder='Salut' />
                              <input className="form-control" id='FirstName' name="FirstName" required type="text" placeholder="Enter first name" 
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
                      <div className='col-md-4'>
                          <div className="form-group">
                              <Form.Label htmlFor='MiddleName'>Middle name</Form.Label>
                              <input className="form-control" id='MiddleName' name="MiddleName" required type="text" placeholder="Enter middle name" 
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
                              <input className="form-control" id='LastName' name="LastName" required type="text" placeholder="Enter last name" 
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
                          <Select options={gender} id="Gender" required value={selectedGender} onChange={setSelectedGender} placeholder='choose one' name='Gender' classNamePrefix='Select'/>
                          <small id="emailHelp" className="form-text text-muted">If want to add a new gender? <span onClick={openGenderModal} style={{cursor: 'pointer'}}>Click here</span></small>
                          {                              
                            errors.Gender.required ? <p style={{fontSize:'14px'}} className='text-danger'>Field is required</p> : null
                          }
                        </Form.Group>
                      </div>
                      <div className='col-md-6'>
                        <Form.Group>
                          <Form.Label htmlFor='BloodGroup'>Blood group <span className='text-danger'>*</span></Form.Label>
                          <Select options={bloodGroup} id='BloodGroup' value={selectedBlood} onChange={setSelectedBlood} name='BloodGroup' placeholder='choose one' classNamePrefix='Select' />
                          <small id="emailHelp" className="form-text text-muted">If want to add a new blood group? <span onClick={openBloodModal} style={{cursor: 'pointer'}}>Click here</span></small>
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
                          <input className="form-control" id='email' name="PersonalEmail" required type="email" placeholder="Enter personal email" 
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
                          <input className="form-control" id='Mob' name="Mob" required type="text" placeholder="Enter mobile no" 
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
                          <input className="form-control" id='Mob1' name="Mob1" required type="text" placeholder="Enter mobile no" 
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
                              <DatePicker value={Datevalue} onChange={setDatevalue} style={{height:'41px'}} renderInput={(params) => <TextField {...params} />}/>
                            </LocalizationProvider>
                          </InputGroup>                        
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className="form-group">
                          <Form.Label htmlFor='Age'>Age <span className='text-danger'>*</span></Form.Label>
                          <input className="form-control" id='Age' name="Age" required type="number" value={age} min={18} placeholder="Enter age" 
                          onMouseEnter={calculateAge}  onChange={on_submit.handleChange} onBlur={on_submit.handleBlur} />
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
                          <input className="form-control" id='FatherName' name="FatherName" required type="text" placeholder="Enter father name" 
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
                          <input className="form-control" id='FatherOccupation' name="FatherOccupation" required type="text" placeholder="Enter father occupation" 
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
                          <input className="form-control" id='MotherName' name="MotherName" required type="text" placeholder="Enter mother name" 
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
                          <input className="form-control" id='MotherOccupation' name="MotherOccupation" required type="text" placeholder="Enter mother occupation " 
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
                          <Select options={marital} id='MaritalStatus' value={selectedMarital} onChange={setSelectedMarital} name='MaritalStatus' placeholder='choose one' classNamePrefix='Select' />
                          <small id="emailHelp" className="form-text text-muted">If want to add a new marital? <span onClick={openMaritalModal} style={{cursor: 'pointer'}}>Click here</span></small>
                          {                              
                            errors.MaritalStatus.required ? <p style={{fontSize:'14px'}} className='text-danger'>Field is required</p> : null
                          }
                        </Form.Group>
                      </div>
                      {
                        selectedMarital.label === 'Married' ? (
                        <>
                          <div className='col-md-3'>
                            <div className="form-group">
                              <Form.Label htmlFor='HusbandorWifeName'>Husband or wife name </Form.Label>
                              <input className="form-control" id='HusbandorWifeName' name="HusbandorWifeName" required type="text" placeholder="Enter husband or wife name " 
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
                              <input className="form-control" id='HusbandorWifeOccupation' name="HusbandorWifeOccupation" required type="text" placeholder="Enter husband or wife occupation " 
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
                              <input className="form-control" id='NoOfChildrens' name="NoOfChildrens" required type="text" placeholder="Enter no of childrens" 
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
                          <textarea className="form-control mb-4" name="PermenentAddress" required placeholder="Enter permenent address" rows={4}
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
                          <textarea className="form-control mb-4" value={presentAddress} disabled={sameAddress} name="PresentAddress" required placeholder="Enter present address" rows={4}
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
                              <input className="form-control" id='AadharNumber' name="AadharNumber" required type="text" placeholder="Enter Aadhar number" 
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
                              <input className="form-control" id='PanNumber' name="PanNumber" required type="text" placeholder="Enter Pan number " 
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
                              <input className="form-control" id="PassportNumber" name="PassportNumber" required type="text" placeholder="Enter passport number" 
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
                                <Select options={licenceType} value={selectedLicenceType} onChange={setSeletedLicienceType} placeholder='choose one' name='LicenceType' classNamePrefix='Select'
                                  onBlur={on_submit.handleBlur}
                                />
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
                              <input className="form-control" id='LicenceNumber' name="LicenceNumber" required type="text" placeholder="Enter licence number" 
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
                          <textarea className="form-control mb-4" name="SpecialSkills" required placeholder="Enter special skills" rows={4}
                            onChange={on_submit.handleChange}
                            onBlur={on_submit.handleBlur}
                          ></textarea>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className="form-group">
                          <Form.Label>Remarks </Form.Label>
                          <textarea className="form-control mb-4" name="Remarks" required placeholder="Enter remarks" rows={4}
                            onChange={on_submit.handleChange}
                            onBlur={on_submit.handleBlur} 
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className="form-group">
                            <Form.Label htmlFor='ExpectedSal'>Expected  <span className='text-danger'>*</span></Form.Label>
                            <input className="form-control" id='ExpectedSal' name="ExpectedSal" required type="text" placeholder="Enter expected salary" 
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
        </>) : <AuthError />
      }
      </Card.Body>
    </Card>
    </>
  )
}
