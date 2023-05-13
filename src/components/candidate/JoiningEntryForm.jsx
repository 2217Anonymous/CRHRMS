import React, { useEffect, useState } from 'react'
import { Card,Form, InputGroup } from 'react-bootstrap'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Loader from '../../services/loader/Loader';
import { ToastLeft } from '../../services/notification/Notification';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DatePicker from 'react-multi-date-picker';
import { TextField } from '@mui/material';
import { isAuthenticated } from '../../services/Auth';
import { useNavigate } from 'react-router-dom';
import { GETBRANCHES, GETDEPARTMENTS, GETDESIGNATION, GETWORKTYPE } from '../../services/api/Master';

export default function JoiningEntryForm() {
  const navigate = useNavigate()

    const [loading,setLoading] = useState(false)
    const initialStateErrors = {
      deptId        : { required:false },
      desigId       : { required:false },
      dateOfJoining : { required:false },
      workType      : { required:false },
      branchId      : { required:false },
    }
    const [errors,setErrors] = useState(initialStateErrors)

    //GET DATA
    //GET DEPARTMENT
    const [dept,setDept] = useState([])
    const [selectedDept,setSelectedDept] = useState()
    const getDepartment = (() => {
      GETDEPARTMENTS().then((res) => {
        const data = res.data.Data
        const drobValue = data.filter(dt => dt.IsActive === true).map((res) => ({
            value : res.Id,
            label : res.DeptName
        }))
        setDept(drobValue)
    })
    })
    //HANDLE DEPARTMENT CHANGE
    const handleDepartmentChange = (event) => {
      setSelectedDept(event.target.value);
      getDesignation(event.target.value)
    }

    //GET DESIGNATION
    const [desg,setDesg] = useState([])
    const [selectedDesg,setSelectedDesg] = useState()
    const getDesignation = (() => {
      GETDESIGNATION().then((res) => {
        const data = res.data.Data
        const drobValue = data.filter(dt => dt.IsActive === true).map((res) => ({
            value : res.Id,
            label : res.DesignName
        }))
        setDesg(drobValue)
    })
    })
    //HANDLE DESIGNATION CHANGE
    const handleDesignationChange = (event) => {
      setSelectedDesg(event.target.value);
    }

    //GET WORKTYPE
    const [work,setWork] = useState([])
    const [selectedWork,setSelectedWork] = useState()
    const getWorkType = (() => {
      GETWORKTYPE().then((res) => {
        const data = res.data.Data
        const drobValue = data.filter(dt => dt.IsActive === true).map((res) => ({
            value : res.Id,
            label : res.GenName
        }))
        setWork(drobValue)
    })
    })
    //HANDLE WORKTYPE CHANGE
    const handleWorkChange = (event) => {
      setSelectedWork(event.target.value);
    }

    //GET BRANCH
    const [branch,setBranch] = useState([])
    const [selectedBranch,setSelectedBranch] = useState()
    const getBranch = (() => {
      GETBRANCHES().then((res) => {
        const data = res.data.Data
        const drobValue = data.filter(dt => dt.IsActive === true).map((res) => ({
            value : res.Id,
            label : res.GenName
        }))
        setBranch(drobValue)
    })
    })
    //HANDLE WORKTYPE CHANGE
    const handleBranchChange = (event) => {
      setSelectedBranch(event.target.value);
    }

    //Date picker
    const [Datevalue, setDatevalue] = useState(null);

    //Initial values
    const initialValues = {
      workEmail     : '',
      leaveCredits  : '',
      salary        : '',
      loginUrl      : '',
    }
  
    //Validation
    const validationSchema = Yup.object({
      FirstName               : Yup.string().required("Please enter required fields"),
    })
  
    //Submit Data
    const onSubmit = values => {
      let errors    = initialStateErrors
      let hasError  = false
  
      //const dob = Datevalue.$y + "/" + parseInt(Datevalue.$M + 1) + "/" + Datevalue.$D
      const additional = {
        deptId        : '',
        desigId       : '',
        dateOfJoining : '',
        workType      : '',
        branchId      : '',
      }
      const data = {...values,...additional}
  
      // if(selectedGender.value === "" || null || undefined ){
      //   errors.Gender.required = true
      //   hasError = true
      // }
  
      if(!hasError){
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
      getDepartment()
      getDesignation()
      getWorkType()
      getBranch()
    },[])

    if(!isAuthenticated()){
      navigate('/')
    }
  return (
    <>
      <Card>
        <Card.Header>
            <Card.Title as="h3">Join Entry</Card.Title>
          </Card.Header>
        <Card.Body>
          <form onSubmit={on_submit.handleSubmit}>
            <div className="form-group">
              <Form.Label>Work Email</Form.Label>
              <input type="text" name="workEmail" required placeholder="Enter work email..." className="form-control mb-2"
                //value   ={on_submit.values.workEmail}
                onChange={on_submit.handleChange} 
                onBlur  ={on_submit.handleBlur} />   
                {                              
                    on_submit.touched.workEmail  &&  on_submit.errors.workEmail  ?( 
                        <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.workEmail }</p> 
                    ): null
                }
            </div>

            <div className="form-group">
              <Form.Label>Department</Form.Label>
              <select className='form-control Select' onChange={handleDepartmentChange} required={true} name="deptId">
                  <option value="">Select department</option>  
                  {
                      dept.map((dt) => {
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

            <div className="form-group">
              <Form.Label>Designation</Form.Label>
              <select className='form-control Select' onChange={handleDesignationChange} required={true} name="desigId">
                  <option value="">Select designation</option>  
                  {
                      desg.map((dt) => {
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

            <div className="form-group">
              <Form.Label htmlFor='DateOfBirth'>Date Of Joining <span className='text-danger'>*</span></Form.Label>
              <InputGroup>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker style={{height:'41px'}} value={Datevalue} onChange={setDatevalue} renderInput={(params) => <TextField {...params} />}/>
                </LocalizationProvider>
              </InputGroup>                        
            </div>

            <div className="form-group">
              <Form.Label>Work Type</Form.Label>
              <select className='form-control Select' onChange={handleWorkChange} required={true} name="workType">
                  <option value="">Select work type</option>  
                  {
                      work.map((dt) => {
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

            <div className="form-group">
              <Form.Label>Branch</Form.Label>
              <select className='form-control Select' onChange={handleBranchChange} required={true} name="branchId">
                  <option value="">Select branch</option>  
                  {
                      branch.map((dt) => {
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

            <div className="form-group">
              <Form.Label>Leave Credits</Form.Label>
              <input type="text" name="workEmail" required placeholder="Enter work email..." className="form-control mb-2"
                //value   ={on_submit.values.workEmail}
                onChange={on_submit.handleChange} 
                onBlur  ={on_submit.handleBlur} />   
                {                              
                    on_submit.touched.workEmail  &&  on_submit.errors.workEmail  ?( 
                        <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.workEmail }</p> 
                    ): null
                }
            </div>

            <div className="form-group">
              <Form.Label>Salary</Form.Label>
              <input type="text" name="workEmail" required placeholder="Enter salary..." className="form-control mb-2"
                //value   ={on_submit.values.workEmail}
                onChange={on_submit.handleChange} 
                onBlur  ={on_submit.handleBlur} />   
                {                              
                    on_submit.touched.workEmail  &&  on_submit.errors.workEmail  ?( 
                        <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.workEmail }</p> 
                    ): null
                }
            </div>
          </form>
        </Card.Body>
      </Card>
    </>
  )
}
