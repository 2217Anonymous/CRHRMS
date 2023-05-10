import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, InputGroup, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Datatable from '../Helper/Datatable';
import { ADDEXPERIENCE, DELETEEXPERIENCE, DELETELANGUAGE, GETEXPERIENCE } from '../../services/api/Hrms';
import { Link } from 'react-router-dom';
import { ToastLeft } from '../../services/notification/Notification';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Collapse, TextField } from '@mui/material';
import { date } from 'yup';
import moment from 'moment/moment';

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

    // Initial collapsed card
    const [InitialExpanded, setInitialExpanded] = useState(false);
    const InitialHandleExpandClick = () => {
        setInitialExpanded(!InitialExpanded);
    };
    const [Initialshow, setInitialShow] = useState(true);

    //Date picker
    const [fromDatevalue, setFromDatevalue] = useState(null);
    const [toDatevalue, setToDatevalue] = useState(null);

    const [addFormData, setAddFormData] = useState({
        language  : "",
        readSkill : "",
        writeSkill: "",
        speakSkill: "",
    });

    const getExperience = () => {
        GETEXPERIENCE(props.id).then(res => {
        const dt = res.data.Data
        const tableData = dt.map((res) => ({
            CompanyName         : res.CompanyName,
            Designation         : res.Designation,
            WorkFrom            : res.WorkFrom,
            WorkTo              : res.WorkTo,
            YearsOfExperiance   : res.YearsOfExperiance,
            SalaryPerMonth      : res.SalaryPerMonth,
            ACTION              : <Link onClick={() => deleteLanguage(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >Delete</Tooltip>}><span className="fe fe-trash me-2 text-primary"></span></OverlayTrigger></Link>
        }))
            setData(tableData)
        }).catch(err => {
            ToastLeft(err.message,"Failed");
        })
    }

    let deleteLanguage = async (id) =>{
        DELETEEXPERIENCE(id).then(res => {
            getExperience()
        }).catch(err => {

        })
    }  

    const handleAddFormChange = (event) => {
        event.preventDefault();
        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;
        const newFormData = { ...addFormData };
        newFormData[fieldName] = fieldValue;
        setAddFormData(newFormData);
    };

    const handleAddFormSubmit = (event) => {
        event.preventDefault();
       // const WorkFrom  = fromDatevalue.$y + "/" + parseInt(fromDatevalue.$M + 1) + "/" + fromDatevalue.$D
       // const WorkTo    = toDatevalue.$y + "/" +  parseInt(toDatevalue.$M + 1) + "/" + toDatevalue.$D
        let WorkFrom = JSON.stringify(fromDatevalue.$d)
        WorkFrom = WorkFrom.slice(1,11)

        let WorkTo = JSON.stringify(toDatevalue.$d)
        console.log(WorkTo);
        console.log(toDatevalue.$d);
        WorkTo = WorkTo.slice(0,11)
        console.log(WorkTo);
        var a = new Date("Thu May 04 2023 00:00:00 GMT+0530 (India Standard Time)")
        let b = JSON.stringify(a)
        b = b.slice(1,11)
        console.log(b);
        const newExperiance = {
            companyName         : addFormData.companyName,
            designation         : addFormData.designation,
            workFrom            : WorkFrom,
            workTo              : WorkTo,
            yearsOfExperiance   : addFormData.yearsOfExperiance,
            salaryPerMonth      : addFormData.salaryPerMonth,
        };

        ADDEXPERIENCE(props.id,newExperiance).then(res => {
            const type = res.data.result
            const msg = res.data.Msg 
            if(res.data.result === 'success'){
                ToastLeft(msg,type)
                getExperience()
            }
            else if(res.data.result === 'Failed'){
                ToastLeft(msg,type)
            }
        })
    };

    useEffect(() => {
        getExperience()
    },[])
  return (
    <>
    <Col xl={12} md={12}>
      {Initialshow ? <>
          <div className="card-options d-flex justify-content-end">
            <button className='btn btn-sm btn-success' onClick={InitialHandleExpandClick}> Add New Experiance <i className={`fe ${InitialExpanded ? 'fe-chevron-up' : 'fe-chevron-down'}`}></i></button>
          </div>
        
        <Collapse in={InitialExpanded} timeout={2000}>
            <Form onSubmit={handleAddFormSubmit}>
                <div className='row'>
                    <div className='col-md-6'>
                        <Form.Label>Company Name</Form.Label>
                        <input
                        type="text"
                        name="companyName"
                        required
                        placeholder="Enter a companyname..."
                        onChange={handleAddFormChange}
                        className="form-control mb-2"
                        />
                    </div>
                    <div className='col-md-6'>
                        <Form.Label>Designation</Form.Label>
                        <input
                        type="text"
                        name="designation"
                        required
                        placeholder="Enter a designation..."
                        onChange={handleAddFormChange}
                        className="form-control mb-2"
                        />
                    </div> 
                </div>
                
                <div className='row'>
                    <div className='col-md-6'>
                        <Form.Label>Year Of Experience</Form.Label>
                        <input
                        type="text"
                        name="yearsOfExperiance"
                        required
                        placeholder="Enter a year of experience..."
                        onChange={handleAddFormChange}
                        className="form-control mb-2"
                        />
                    </div>
                    <div className='col-md-6'>
                        <Form.Label>Salary Per Month</Form.Label>
                        <input type="text" name="salaryPerMonth" required placeholder="Enter a salary per month..." onChange={handleAddFormChange} className="form-control mb-2"/>
                    </div> 
                </div>

                <div className='row'>
                    <div className='col-md-6'>
                        <div className="form-group">
                          <Form.Label htmlFor='DateOfBirth'>From Date <span className='text-danger'>*</span></Form.Label>
                            <InputGroup>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker value={fromDatevalue} onChange={setFromDatevalue} style={{height:'41px'}} renderInput={(params) => <TextField {...params} />}/>
                                </LocalizationProvider>
                            </InputGroup> 
                        </div>
                    </div>
                    <div className='col-md-6'>
                        <div className="form-group">
                          <Form.Label htmlFor='DateOfBirth'>To Date <span className='text-danger'>*</span></Form.Label>
                          <InputGroup>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker value={toDatevalue} onChange={setToDatevalue} renderInput={(params) => <TextField {...params} />}/>
                            </LocalizationProvider>
                          </InputGroup>                        
                        </div>
                    </div>
                </div>

                <Button variant="" className="btn btn-primary me-2" type="submit">Add</Button>
            </Form>
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


