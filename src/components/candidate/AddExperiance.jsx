import React, { useEffect, useState } from 'react'
import { Col, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Datatable from '../Helper/Datatable';
import { ADDEXPERIENCE, DELETEEXPERIENCE, GETEXPERIENCE } from '../../services/api/Hrms';
import { Link } from 'react-router-dom';
import { ToastLeft } from '../../services/notification/Notification';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { enGB } from 'date-fns/locale';
import { format } from 'date-fns';
import { Collapse, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Loader from '../../services/loader/Loader';

export const COLUMNS = [
    {
      Header: "COMPANY Name",
      accessor: "CompanyName",
      className: "text-center wd-15p border-bottom-0",
    },
    {
      Header: "DESIGNATION",
      accessor: "Designation",
      className: "text-center wd-15p border-bottom-0 ",
  
    },
    {
      Header: "WORK FROM",
      accessor: "WorkFrom",
      className: "text-center wd-15p border-bottom-0 ",
    },
    {
      Header: "WORK TO",
      accessor: "WorkTo",
      className: "text-center wd-15p border-bottom-0 ",
    },
    {
      Header: "EXPERIANCE",
      accessor: "YearsOfExperiance",
      className: "text-center wd-15p border-bottom-0 ",
    },
    {
      Header: "SALARY",
      accessor: "SalaryPerMonth",
      className: "text-center wd-15p border-bottom-0 ",
    },
    {
      Header: "ACTION",
      accessor: "ACTION",
      className: "text-center wd-15p border-bottom-0 ",
    },
];

export default function AddExperiance(props) {
    const [data,setData] = useState([])

    //ERRORS
    const initialStateErrors = {
        WorkFrom    : { required:false },
        WorkTo      : { required:false },
    }

    // Initial collapsed card
    const [InitialExpanded, setInitialExpanded] = useState(false);
    const InitialHandleExpandClick = () => {
        setInitialExpanded(!InitialExpanded);
    };
    const [Initialshow, setInitialShow] = useState(true);
    const [loading,setLoading] = useState(false)
    const [errors,setErrors] = useState(initialStateErrors)

    //Date picker
    const [fromDatevalue, setFromDatevalue] = useState(null);
    const [toDatevalue, setToDatevalue] = useState(null);

    const getExperience = () => {
        GETEXPERIENCE(props.id).then(res => {
        const dt = res.data.Data
        const tableData = dt.map((res) => ({
            CompanyName         : res.CompanyName,
            Designation         : res.Designation,
            WorkFrom            : res.WorkFrom.slice(0,10),
            WorkTo              : res.WorkTo.slice(0,10),
            YearsOfExperiance   : res.YearsOfExperiance + ' Years',
            SalaryPerMonth      : 'Rs ' + res.SalaryPerMonth,
            ACTION              : <Link onClick={() => deleteExperience(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >Delete</Tooltip>}><span className="fe fe-trash me-2 text-danger"></span></OverlayTrigger></Link>
        }))
            setData(tableData)
        }).catch(err => {
            ToastLeft(err.message,"Failed");
        })
    }

    let deleteExperience = async (id) =>{
        DELETEEXPERIENCE(id).then(res => {
            getExperience()
        }).catch(err => {

        })
    }  

    //Initial values
    const initialValues = {
        companyName         : "",
        designation         : "",
        yearsOfExperiance   : "",
        salaryPerMonth      : "",
    }
    
    //Validation
    const validationSchema = Yup.object({
        companyName          : Yup.string().required("Please enter required fields"),
        designation          : Yup.string().required("Please enter required fields"),
        yearsOfExperiance    : Yup.string().required("Please enter required fields"),
        salaryPerMonth       : Yup.string().required("Please enter required fields"),
    })

    const onSubmit = values => {
        let errors      = initialStateErrors
        let hasError    = false
        const WorkFrom  = fromDatevalue ? format(fromDatevalue, 'yyyy-MM-dd') : '';
        const WorkTo    = toDatevalue ? format(toDatevalue, 'yyyy-MM-dd') : '';

        const additional = {
            workFrom    : WorkFrom,
            workTo      : WorkTo,
            empParamStr : props.id
        }
        
        if(WorkFrom === "" || null || undefined ){
            errors.WorkFrom.required = true
            hasError = true
        }
        if(WorkTo === "" || null || undefined ){
            errors.WorkTo.required = true
            hasError = true
        }

        const data = {...values,...additional}
        if(!hasError){
            ADDEXPERIENCE(data).then((res) => {
                const type = res.data.result
                const msg = res.data.Msg 
                if(res.data.result === 'success'){
                    ToastLeft(msg,type)
                    setLoading(false)
                    getExperience()
                    handleReset()
                    setInitialExpanded(false)
                }
                else if(res.data.result === 'Failed'){
                    ToastLeft(msg,type)
                    setLoading(true)
                }
            })
            
        }
        setErrors({...errors}) 
    }

    const handleReset = () => {
        on_submit.resetForm()
        setFromDatevalue(null)
        setToDatevalue(null)
    }

    //FORM SUBMISSION
    const on_submit = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    })

    useEffect(() => {
        getExperience()
    },[])
  return (
    <>
    <Col xl={12} md={12}>
      {Initialshow ? <>
          <div className="card-options d-flex justify-content-end">
            <button className='btn btn-sm btn-outline-success' onClick={InitialHandleExpandClick}> Add New Experiance <i className={`fe ${InitialExpanded ? 'fe-chevron-up' : 'fe-chevron-down'}`}></i></button>
          </div>
        
        <Collapse in={InitialExpanded} timeout={2000}>
            <form onSubmit={on_submit.handleSubmit}>
                <div className='row'>
                    <div className='col-md-6'>
                        <Form.Label>Company Name</Form.Label>
                        <input
                        type="text"
                        name="companyName"
                        required
                        value={on_submit.values.companyName}
                        placeholder="Enter a companyname..."
                        className="form-control mb-2"
                        onChange={on_submit.handleChange} 
                        onBlur={on_submit.handleBlur} />   
                        {                              
                            on_submit.touched.companyName  &&  on_submit.errors.companyName  ?( 
                                <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.companyName }</p> 
                            ): null
                        }
                    </div>
                    <div className='col-md-6'>
                        <Form.Label>Designation</Form.Label>
                        <input
                        type="text"
                        name="designation"
                        required
                        value={on_submit.values.designation}
                        placeholder="Enter a designation..."
                        className="form-control mb-2"
                        onChange={on_submit.handleChange} 
                        onBlur={on_submit.handleBlur} />   
                        {                              
                            on_submit.touched.designation  &&  on_submit.errors.designation  ?( 
                                <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.designation }</p> 
                            ): null
                        }
                    </div> 
                </div>
                
                <div className='row'>
                    <div className='col-md-6'>
                        <Form.Label>Year Of Experience</Form.Label>
                        <input
                        type="text"
                        name="yearsOfExperiance"
                        required
                        value={on_submit.values.yearsOfExperiance}
                        placeholder="Enter a year of experience..."
                        className="form-control mb-2"
                        onChange={on_submit.handleChange} 
                        onBlur={on_submit.handleBlur} />   
                        {                              
                            on_submit.touched.yearsOfExperiance  &&  on_submit.errors.yearsOfExperiance  ?( 
                                <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.yearsOfExperiance }</p> 
                            ): null
                        }
                    </div>
                    <div className='col-md-6'>
                        <Form.Label>Salary Per Month</Form.Label>
                        <input type="text" name="salaryPerMonth" required value={on_submit.values.salaryPerMonth} placeholder="Enter a salary per month..." className="form-control mb-2"
                        onChange={on_submit.handleChange} 
                        onBlur={on_submit.handleBlur} />   
                        {                              
                            on_submit.touched.salaryPerMonth  &&  on_submit.errors.salaryPerMonth  ?( 
                                <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.salaryPerMonth }</p> 
                            ): null
                        }
                    </div> 
                </div>

                <div className='row'>
                    <div className='col-md-6'>
                        <div className="form-group">
                          <Form.Label htmlFor='DateOfBirth'>From Date <span className='text-danger'>*</span></Form.Label>
                            <InputGroup>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                                <DatePicker value={fromDatevalue} onChange={setFromDatevalue} style={{height:'41px'}} renderInput={(params) => <TextField {...params} />}/>
                                </LocalizationProvider>
                            </InputGroup> 
                        </div>
                        {                              
                            errors.WorkFrom.required ? <p style={{fontSize:'14px'}} className='text-danger'>Field is required</p> : null
                        }
                    </div>
                    <div className='col-md-6'>
                        <div className="form-group">
                          <Form.Label htmlFor='DateOfBirth'>To Date <span className='text-danger'>*</span></Form.Label>
                          <InputGroup>
                          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                              <DatePicker value={toDatevalue} onChange={setToDatevalue} renderInput={(params) => <TextField {...params} />}/>
                            </LocalizationProvider>
                          </InputGroup>                        
                        </div>
                        {                              
                            errors.WorkTo.required ? <p style={{fontSize:'14px'}} className='text-danger'>Field is required</p> : null
                        }
                    </div>
                </div>

                {
                    !loading ?  (
                    <div className="submit text-end">
                        <button className='btn btn-md btn-danger' onClick={handleReset}>
                            Close
                        </button> {  }
                        <button className='btn btn-md btn-success' type="submit">
                            Save Changes
                        </button>
                    </div>
                    )  : (<Loader />)
                }
            </form>
        </Collapse>
        </>: null}
    </Col>
    <br></br>
    <div className="row">
        <div className='col-md-12 '>
            <Datatable data={data} col={COLUMNS} />
        </div>
    </div> 
    </>
  )
}


