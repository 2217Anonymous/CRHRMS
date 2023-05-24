import React, { useEffect, useState } from 'react'
import { Badge, Col, Collapse, Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Datatable from '../Helper/Datatable';
import { ADDLANGUAGE, DELETELANGUAGE, GETLANGUAGE } from '../../services/api/Hrms';
import { Link } from 'react-router-dom';
import { ToastLeft } from '../../services/notification/Notification';
import Loader from '../../services/loader/Loader';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const COLUMNS = [
    {
      Header: "LANGUAGE",
      accessor: "LANGUAGE",
      className: "text-center wd-15p border-bottom-0",
    },
    {
      Header: "WRITE",
      accessor: "WRITE",
      className: "text-center wd-15p border-bottom-0 ",
  
    },
    {
      Header: "READ",
      accessor: "READ",
      className: "text-center wd-15p border-bottom-0 ",
    },
    {
      Header: "SPEAK",
      accessor: "SPEAK",
      className: "text-center wd-15p border-bottom-0 ",
    },
    {
      Header: "ACTION",
      accessor: "ACTION",
      className: "text-center wd-15p border-bottom-0 ",
    },
];

export default function AddLanguage(props) {
    // Initial collapsed card
    const [InitialExpanded, setInitialExpanded] = useState(false);
    const InitialHandleExpandClick = () => {
        setInitialExpanded(!InitialExpanded);
    };
    const [Initialshow, setInitialShow] = useState(true);
    const [loading,setLoading] = useState(false)   
    const [data,setData] = useState([])

    //READY TO RELOCATE
    const [isRead, setIsRead] = useState(false);
    const handleReadCheckboxChange = ((event) => {
        console.log(event.target.checked);
        setIsRead(event.target.checked); 
    })

    const [isWrite, setIsWrite] = useState(false);
    const handleWriteCheckboxChange = ((event) => {
        console.log(event.target.checked);
        setIsWrite(event.target.checked);
    })

    const [isSpeak, setIsSpeak] = useState(false);
    const handleSpeakCheckboxChange = ((event) => {
        console.log(event.target.checked);
        setIsSpeak(event.target.checked);
    })

    const getLanguage = () => {
        GETLANGUAGE(props.id).then(res => {
        const dt = res.data.Data
        const tableData = dt.map((res) => ({
            LANGUAGE    : res.Language,
            WRITE       : res.WriteSkill ? <Badge bg="success">True</Badge> : <Badge bg="danger">False</Badge>,   
            READ        : res.ReadSkill  ? <Badge bg="success">True</Badge> : <Badge bg="danger">False</Badge>,
            SPEAK       : res.SpeakSkill ? <Badge bg="success">True</Badge> : <Badge bg="danger">False</Badge>, 
            ACTION      : <Link onClick={() => deleteLanguage(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >Delete</Tooltip>}><span className="fe fe-trash me-2 text-danger"></span></OverlayTrigger></Link>
        }))
            setData(tableData)
        }).catch(err => {
            ToastLeft(err.message,"Failed");
        })
    }

    let deleteLanguage = async (id) =>{
        const shouldDelete = window.confirm('Are you sure you want to delete this item?');
        if(shouldDelete){
            DELETELANGUAGE(id).then(res => {
                getLanguage()
            }).catch(err => {
    
            })
        }
    }  

    //Initial values
    const initialValues = {
        language  : "",
    }

    //Validation
    const validationSchema = Yup.object({
        language    : Yup.string().required("Please enter required fields"),   
    })

    const handleReset = () => {
        on_submit.resetForm()
        setIsRead(false)
        setIsWrite(false)
        setIsSpeak(false)
    }

    const onSubmit = values => {
        console.log(isRead,isWrite,isSpeak);
        const additional = {
            readSkill   : isRead,
            writeSkill  : isWrite,
            speakSkill  : isSpeak,
            empParamStr : props.id
        }
        const data = {...values,...additional}

        ADDLANGUAGE(data).then((res) => {
            const type = res.data.result
            const msg = res.data.Msg 
            if(res.data.result === 'success'){
                ToastLeft(msg,type)
                setLoading(false)
                getLanguage()
                handleReset()
                setInitialExpanded(false)
            }
            else if(res.data.result === 'Failed'){
                ToastLeft(msg,type)
                setLoading(true)
            }
        }).catch(err => {}).finally(() => {
            setLoading(false)
        })
    }

    //FORM SUBMISSION
    const on_submit = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    })

    useEffect(() => {
        getLanguage()
    },[])

  return (
    <>
    <Col xl={12} md={12}>
      {Initialshow ? <>
          <div className="card-options d-flex justify-content-end">
            <button className='btn btn-sm btn-outline-success' onClick={InitialHandleExpandClick}> Add New Language <i className={`fe ${InitialExpanded ? 'fe-chevron-up' : 'fe-chevron-down'}`}></i></button>
          </div>
        
        <Collapse in={InitialExpanded} timeout={2000}>
            <form onSubmit={on_submit.handleSubmit}>
                <div className='row'>
                  <div className='col-md-6'>
                    <Form.Label>Language</Form.Label>
                    <input
                        type="text"
                        name="language"
                        required
                        value={on_submit.values.language}
                        placeholder="Enter a language..."
                        className="form-control mb-2"
                        onChange={on_submit.handleChange} onBlur={on_submit.handleBlur} />   
                        {                              
                            on_submit.touched.language  &&  on_submit.errors.language  ?( 
                                <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.language }</p> 
                            ): null
                        }
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-2'>
                    <div className="form-group">
                      <Form.Label><br></br></Form.Label>
                      Read ? <span className='text-danger'>*</span>
                      <div className="material-switch pull-right">
                            <input id="readSkill" checked={isRead} onChange={handleReadCheckboxChange} name="readSkill" type="checkbox" />
                          <label htmlFor="readSkill" className="label-success"></label>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-2'>
                    <div className="form-group">
                      <Form.Label><br></br></Form.Label>
                      write ? <span className='text-danger'>*</span>
                      <div className="material-switch pull-right">
                          <input id="writeSkill" checked={isWrite} onChange={handleWriteCheckboxChange} name="writeSkill" type="checkbox" />
                          <label htmlFor="writeSkill" className="label-success"></label>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-2'>
                    <div className="form-group">
                      <Form.Label><br></br></Form.Label>
                      Speak ? <span className='text-danger'>*</span>
                      <div className="material-switch pull-right">
                          <input id="speakSkill" checked={isSpeak} onChange={handleSpeakCheckboxChange} name="speakSkill" type="checkbox" />
                          <label htmlFor="speakSkill" className="label-success"></label>
                      </div>
                    </div>
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
      <div className='col-md-12 '>
        <Datatable data={data} col={COLUMNS} />
      </div>
    </div> 
    </>
  )
}
