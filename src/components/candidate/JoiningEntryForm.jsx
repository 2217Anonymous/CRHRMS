import React, { useEffect, useState } from 'react'
import { Button, Card,Form, InputGroup } from 'react-bootstrap'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Loader from '../../services/loader/Loader';
import { ToastLeft } from '../../services/notification/Notification';
import { TextField } from '@mui/material';
import { isAuthenticated } from '../../services/Auth';
import { useNavigate } from 'react-router-dom';
import { GETBRANCHES, GETDEPARTMENTS, GETDESIGNATION, GETWORKTYPE } from '../../services/api/Master';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { enGB } from 'date-fns/locale';
import { format } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { JOINENTRY } from '../../services/api/Hrms';


export default function JoiningEntryForm(props) {
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
        setDept(res.data.Data)
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
        setDesg(res.data.Data)
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
        setWork(res.data.Data)
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
        setBranch(res.data.Data)
    })
    })
    //HANDLE WORKTYPE CHANGE
    const handleBranchChange = (event) => {
      setSelectedBranch(event.target.value);
    }

    //Date picker
    const [doj, setDoj] = useState(null);

    //Initial values
    const initialValues = {
      workEmail     : '',
      leaveCredits  : '',
      salary        : '',
      loginUrl      : '',
    }
  
    //Validation
    const validationSchema = Yup.object({
      workEmail     : Yup.string().required("Please enter required fields"),
      leaveCredits  : Yup.string().required("Please enter required fields"),
      salary        : Yup.string().required("Please enter required fields"),
    })
  
    const handleReset = (() => {
      on_submit.resetForm()
      setDoj(null)
      selectedDept(null)
      selectedDesg(null)
      selectedWork(null)
      selectedBranch(null)
    })

    //Submit Data
    const onSubmit = values => {
      let errors   = initialStateErrors
      let hasError = false
      const Doj  = doj ? format(doj, 'yyyy-MM-dd') : '';

      const additional = {
        empParamStr   : props.id,
        deptId        : parseInt(selectedDept),
        desigId       : parseInt(selectedDesg),
        dateOfJoining : Doj,
        workType      : parseInt(selectedWork),
        branchId      : parseInt(selectedBranch),
      }
  
      if(selectedDept === "" || null || undefined ){
        errors.deptId.required = true
        hasError = true
      }
      if(selectedDesg === "" || null || undefined ){
        errors.desigId.required = true
        hasError = true
      }
      if(selectedWork === "" || null || undefined ){
        errors.workType.required = true
        hasError = true
      }
      if(selectedBranch === "" || null || undefined ){
        errors.branchId.required = true
        hasError = true
      }
      if(Doj === "" || null || undefined ){
        errors.dateOfJoining.required = true
        hasError = true
      }

      const data = {...values,...additional}

      if(!hasError){  
        JOINENTRY(data).then((res) => {
          const type = res.data.result
          const msg  = res.data.Msg 
          if(res.data.result === 'success'){
              ToastLeft(msg,type)
              setLoading(false)
              handleReset()
          }
          else if(res.data.result === 'Failed'){
              ToastLeft(msg,type)
              setLoading(true)
          }
          setLoading(false)
        }).catch(err => ToastLeft(err,'Failed')).finally(setLoading(false))
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
            <div className="form-group">
              <Form.Label>Work Email <span className='text-danger'>*</span></Form.Label>
              <input type="text" name="workEmail" required placeholder="Enter work email..." className="form-control mb-2"
                value   ={on_submit.values.workEmail}
                onChange={on_submit.handleChange} 
                onBlur  ={on_submit.handleBlur} />   
                {                              
                    on_submit.touched.workEmail  &&  on_submit.errors.workEmail  ?( 
                        <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.workEmail }</p> 
                    ): null
                }
            </div>

            <div className="form-group">
              <Form.Label>Department <span className='text-danger'>*</span></Form.Label>
              <select className='form-control Select' onChange={handleDepartmentChange} required={true} name="deptId">
                  <option value="">Select department</option>  
                  {
                      dept.map((dt) => {
                          return(
                              <option key={dt.Id} value={dt.Id}>
                                  {dt.DeptName}
                              </option>
                          )
                      })
                  }
              </select>
              {                              
                errors.deptId.required ? <p style={{fontSize:'14px'}} className='text-danger'>Field is required</p> : null
              }
            </div>

            <div className="form-group">
              <Form.Label>Designation <span className='text-danger'>*</span></Form.Label>
              <select className='form-control Select' onChange={handleDesignationChange} required={true} name="desigId">
                  <option value="">Select designation</option>  
                  {
                      desg.map((dt) => {
                          return(
                              <option key={dt.Id} value={dt.Id}>
                                  {dt.DesignName}
                              </option>
                          )
                      })
                  }
              </select>
              {                              
                errors.desigId.required ? <p style={{fontSize:'14px'}} className='text-danger'>Field is required</p> : null
              }
            </div>

            <div className="form-group">
              <Form.Label htmlFor='DateOfBirth'>Date Of Joining <span className='text-danger'>*</span></Form.Label>
              <InputGroup>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                  <DatePicker value={doj} onChange={setDoj} renderInput={(params) => <TextField {...params} />}/>
                </LocalizationProvider>
              </InputGroup>   
              {                              
                errors.dateOfJoining.required ? <p style={{fontSize:'14px'}} className='text-danger'>Field is required</p> : null
              }               
            </div>

            <div className="form-group">
              <Form.Label>Work Type <span className='text-danger'>*</span></Form.Label>
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
                errors.workType.required ? <p style={{fontSize:'14px'}} className='text-danger'>Field is required</p> : null
              }
            </div>

            <div className="form-group">
              <Form.Label>Branch <span className='text-danger'>*</span></Form.Label>
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
                errors.branchId.required ? <p style={{fontSize:'14px'}} className='text-danger'>Field is required</p> : null
              }
            </div>

            <div className="form-group">
              <Form.Label>Leave Credits <span className='text-danger'>*</span></Form.Label>
              <input type="text" name="leaveCredits" required placeholder="Enter work email..." className="form-control mb-2"
                value   ={on_submit.values.leaveCredits}
                onChange={on_submit.handleChange} 
                onBlur  ={on_submit.handleBlur} />   
                {                              
                    on_submit.touched.leaveCredits  &&  on_submit.errors.leaveCredits  ?( 
                        <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.leaveCredits }</p> 
                    ): null
                }
            </div>

            <div className="form-group">
              <Form.Label>Salary <span className='text-danger'>*</span></Form.Label>
              <input type="text" name="salary" required placeholder="Enter salary..." className="form-control mb-2"
                value   ={on_submit.values.salary}
                onChange={on_submit.handleChange} 
                onBlur  ={on_submit.handleBlur} />   
                {                              
                    on_submit.touched.salary  &&  on_submit.errors.salary  ?( 
                        <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.salary }</p> 
                    ): null
                }
            </div>

            <div className="form-group">
              <Form.Label>Login Url</Form.Label>
              <input type="text" name="loginUrl" required placeholder="Enter login Url..." className="form-control mb-2"
                value   ={on_submit.values.loginUrl}
                onChange={on_submit.handleChange} 
                onBlur  ={on_submit.handleBlur} />   
            </div>
            <hr />
            {
            !loading ?  (
              <div className="submit text-end">
                  <button className='btn btn-md btn-danger' onClick={on_submit.handleReset}>
                      Close
                  </button> {  }

                  <Button variant="success" onClick={on_submit.handleSubmit}>
                    Save Changes
                  </Button>
              </div>
            )  : (<Loader />)
          }
        </Card.Body>
      </Card>
    </>
  )
}
