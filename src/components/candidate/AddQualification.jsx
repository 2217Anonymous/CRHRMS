import React, { useEffect, useState } from 'react'
import { Badge, Col, Collapse, Form, FormControl, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Datatable from '../Helper/Datatable';
import { ADDQUALIFICATION, DELETEQUALIFICATION, GETCANDIDATEQUALIFICATION } from '../../services/api/Hrms';
import { Link } from 'react-router-dom';
import { ToastLeft } from '../../services/notification/Notification';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { GETQUALIFICATION } from '../../services/api/Master';
import Loader from '../../services/loader/Loader';
import QualificationModel from '../../pages/master/models/QualificationModel';
import { fetchQualificationData } from '../../Redux/slice/Master/Qualification';
import { useDispatch, useSelector } from 'react-redux';

export const COLUMNS = [
    {
      Header: "COURSE NAME",
      accessor: "COURSENAME",
      className: "text-center wd-15p border-bottom-0 ",
  
    },
    {
      Header: "MEDIUM",
      accessor: "MEDIUM",
      className: "text-center wd-15p border-bottom-0 ",
    },
    {
      Header: "INSTITUTION",
      accessor: "INSTITUTION",
      className: "text-center wd-15p border-bottom-0 ",
    },
    {
      Header: "YEAR OF PASSING",
      accessor: "YEAROFPASSING",
      className: "text-center wd-15p border-bottom-0 ",
    },
    {
      Header: "GRADE OR PERCENTAGE",
      accessor: "GRADEORPERCENTAGE",
      className: "text-center wd-15p border-bottom-0 ",
    },
    {
      Header: "ACTION",
      accessor: "ACTION",
      className: "text-center wd-15p border-bottom-0 ",
    },
];

export default function AddQualification(props) {
    //ERRORS
    const initialStateErrors = {
        CourseId     : { required:false },
    }

    //STATE MANAGEMENT
    const [Initialshow, setInitialShow] = useState(true);
    const [loading,setLoading] = useState(false)
    const [data,setData] = useState([])
    const [errors,setErrors] = useState(initialStateErrors)

    // Initial collapsed card
    const [InitialExpanded, setInitialExpanded] = useState(false);
    const InitialHandleExpandClick = () => {
        setInitialExpanded(!InitialExpanded);
    };

    //QUALIFICATION
    const [courseId,setCourseId] = useState()
    const [selectedCourseId,setSelectedCourseId] = useState()
    
    const dispatch = useDispatch()
    const qualificationList = useSelector((state) => state.qualification.qualificationList.Data)
    useEffect(() => {
        const getQualification = (() => {
            if (qualificationList) {
                const drobValue = qualificationList.filter(dt => dt.IsActive).map((res) => ({
                    value : res.Id,
                    label : res.Qualification                    
                }))
                setCourseId(drobValue)
            }
        })

        getQualification()
    },[qualificationList,dispatch])

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        dispatch(fetchQualificationData())
    },[dispatch])

    //GET QUALIFICATION
    const getCandidateQualification = (() => {
        GETCANDIDATEQUALIFICATION(props.id).then(res => {
            const dt = res.data.Data
            const tableData = dt.map((res) => ({
                COURSENAME          : res.Qualification,
                MEDIUM              : res.Medium,
                INSTITUTION         : res.Institution,
                YEAROFPASSING       : res.YearOfPassing,
                GRADEORPERCENTAGE   : res.GradeOrPercentage + ' %',
                ACTION              : <Link onClick={() => deleteQualification(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >Delete</Tooltip>}><span className="fe fe-trash me-2 text-danger"></span></OverlayTrigger></Link>
                }))
                setData(tableData)
            })
    })

    //DELETE QUALIFICATION
    const deleteQualification = ((id) => {
        const shouldDelete = window.confirm('Are you sure you want to delete this item?');
        if(shouldDelete){
            DELETEQUALIFICATION(id).then(res => {
                getCandidateQualification()
            })
        }
    })

    //Initial values
    const initialValues = {
        medium              : "",
        institution         : "",
        yearOfPassing       : "",
        gradeOrPercentage   : "",
    }

    //Validation
    const validationSchema = Yup.object({
        medium              : Yup.string().required("Please enter required fields"),
        institution         : Yup.string().required("Please enter required fields"),
        yearOfPassing       : Yup.string().required("Please enter required fields"),
        gradeOrPercentage   : Yup.string().required("Please enter required fields"),    
    })

    const onSubmit = values => {
        let errors    = initialStateErrors
        let hasError  = false
        const additional = {
            courceId    : selectedCourseId.value,
            courseName  : selectedCourseId.label,
            empParamStr : props.id
        }
        if(selectedCourseId.value === "" || null || undefined ){
            errors.CourseId.required = true
            hasError = true
        }
        const data = {...values,...additional}
        if(!hasError){
            ADDQUALIFICATION(data).then((res) => {
                const type = res.data.result
                const msg = res.data.Msg 
                if(res.data.result === 'success'){
                    ToastLeft(msg,type)
                    setLoading(false)
                    getCandidateQualification()
                    handleReset()
                    setInitialExpanded(false)
                }
                else if(res.data.result === 'Failed'){
                    ToastLeft(msg,type)
                    setLoading(true)
                }
            }).catch(err => {
    
            }).finally(() => {
                setLoading(false)
            })
            
        }
        setErrors({...errors}) 
    }

    const handleReset = () => {
        on_submit.resetForm()
        setSelectedCourseId(null)
    }

    //FORM SUBMISSION
    const on_submit = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    })

    useEffect(() => {   
        getCandidateQualification()
    },[])  
    
  return (
    <>
        <Col xl={12} md={12}>
            {Initialshow ? <>
                <div className="card-options d-flex justify-content-end">
                    <button className='btn btn-sm  btn-outline-success' onClick={InitialHandleExpandClick}> Add New Language <i className={`fe ${InitialExpanded ? 'fe-chevron-up' : 'fe-chevron-down'}`}></i></button>
                </div>
                <QualificationModel isOpen={isModalOpen} onClose={closeModal} />
                <Collapse in={InitialExpanded} timeout={2000}>
                    <form onSubmit={on_submit.handleSubmit}>
                        <div className='row'>
                            <div className='col-md-11'>
                                <Form.Group>
                                    <Form.Label>Select Course</Form.Label>
                                    <Select options={courseId} id='CourseId' value={selectedCourseId} onChange={setSelectedCourseId} name='MaritalStatus' placeholder='choose one' classNamePrefix='Select' />
                                    <small id="emailHelp" className="form-text text-muted">If want to add a new qualification? <span onClick={openModal} style={{cursor: 'pointer'}}>Click here</span></small>
                                    {                              
                                        errors.CourseId.required ? <p style={{fontSize:'14px'}} className='text-danger'>Field is required</p> : null
                                    }
                                </Form.Group>
                            </div>
                            
                        </div>
                        <div className='row'>
                            <div className='col-md-6'>
                                <Form.Label htmlFor='Medium'>Medium</Form.Label>
                                <input className="form-control" value={on_submit.values.medium} id='Medium' name="medium" required type="text" placeholder="Enter Medium" 
                                 onChange={on_submit.handleChange} onBlur={on_submit.handleBlur} />   
                                {                              
                                    on_submit.touched.medium  &&  on_submit.errors.medium  ?( 
                                        <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.medium }</p> 
                                    ): null
                                }
                            </div>
                            <div className='col-md-6'>
                                <Form.Label htmlFor='institution'>Institution</Form.Label>
                                <input className="form-control" value={on_submit.values.institution} id='institution' name="institution" required type="text" placeholder="Enter institution name" 
                                onChange={on_submit.handleChange} onBlur={on_submit.handleBlur} />   
                                    {                              
                                        on_submit.touched.institution  &&  on_submit.errors.institution  ?( 
                                            <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.institution }</p> 
                                        ): null
                                    }
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-6'>
                                <Form.Label htmlFor='yearOfPassing'>Year Of Passing</Form.Label>
                                <input className="form-control" value={on_submit.values.yearOfPassing} id='yearOfPassing' name="yearOfPassing" required type="text" placeholder="Enter year Of Passing" 
                                  onChange={on_submit.handleChange} onBlur={on_submit.handleBlur} />   
                                    {                              
                                        on_submit.touched.yearOfPassing  &&  on_submit.errors.yearOfPassing  ?( 
                                            <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.yearOfPassing }</p> 
                                        ): null
                                    }
                            </div>
                            <div className='col-md-6'>
                                <Form.Label htmlFor='gradeOrPercentage'>Grade Or Percentage</Form.Label>
                                <input className="form-control" value={on_submit.values.gradeOrPercentage} id='gradeOrPercentage' name="gradeOrPercentage" required type="text" placeholder="Enter grade or percentage name" 
                                  onChange={on_submit.handleChange} onBlur={on_submit.handleBlur} />   
                                    {                              
                                        on_submit.touched.gradeOrPercentage  &&  on_submit.errors.gradeOrPercentage  ?( 
                                            <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.gradeOrPercentage }</p> 
                                        ): null
                                    }
                            </div>
                        </div>
                        <br></br>
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
            <div className='col-md-12'>
                <Datatable data={data} col={COLUMNS} />
            </div>
        </div> 
    </>
  )
}
