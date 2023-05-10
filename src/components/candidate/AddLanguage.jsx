import React, { useEffect, useState } from 'react'
import { Badge, Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Datatable from '../Helper/Datatable';
import { ADDLANGUAGE, DELETELANGUAGE, GETLANGUAGE } from '../../services/api/Hrms';
import { Link } from 'react-router-dom';
import { ToastLeft } from '../../services/notification/Notification';

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
    const [modalShow, setModalShow] = useState(false);
    const [data,setData] = useState([])

    const [addFormData, setAddFormData] = useState({
        language  : "",
        readSkill : "",
        writeSkill: "",
        speakSkill: "",
    });

    const getLanguage = () => {
        GETLANGUAGE(props.id).then(res => {
        const dt = res.data.Data
        const tableData = dt.map((res) => ({
            LANGUAGE    : res.Language,
            READ        : res.ReadSkill ? <Badge bg="success">True</Badge> : <Badge bg="danger">False</Badge>,
            WRITE       : res.WriteSkill ? <Badge bg="success">True</Badge> : <Badge bg="danger">False</Badge> ,   
            SPEAK       : res.SpeakSkill ? <Badge bg="success">True</Badge> : <Badge bg="danger">False</Badge>, 
            ACTION      : <Link onClick={() => deleteLanguage(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >Delete</Tooltip>}><span className="fe fe-trash me-2 text-primary"></span></OverlayTrigger></Link>
        }))
            setData(tableData)
        }).catch(err => {
            ToastLeft(err.message,"Failed");
        })
    }

    let deleteLanguage = async (id) =>{
        DELETELANGUAGE(id).then(res => {
            getLanguage()
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
        const newLanguage = {
        language    : addFormData.language,
        writeSkill  : addFormData.writeSkill,
        readSkill   : addFormData.readSkill,
        speakSkill  : addFormData.speakSkill,
        };

        ADDLANGUAGE(props.id,newLanguage).then(res => {
            const type = res.data.result
            const msg = res.data.Msg 
            if(res.data.result === 'success'){
                ToastLeft(msg,type)
                setModalShow(false)
                getLanguage()
            }
            else if(res.data.result === 'Failed'){
                ToastLeft(msg,type)
            }
            setModalShow(false)
            getLanguage() 
        }).catch(err => {
            ToastLeft(err.message,"Failed");
        })
    };

    useEffect(() => {
        getLanguage()
    },[])

  return (
    <>
    <pre>{JSON.stringify(data)}</pre>
     <div className="row">
      <div className='col-md-12 '>
        <Button variant="" className="btn btn-primary mb-3" onClick={() => setModalShow(true)} >
          Add New Language
        </Button>
        <br />
        <Datatable data={data} col={COLUMNS} />
      </div>

      <Modal show={modalShow} onHide={() => setModalShow(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">Add New Language</Modal.Title>
          <Button
            variant=""
            className="btn btn-close"
            onClick={() => setModalShow(false)}
          >
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddFormSubmit}>
            <div className='row'>
              <div className='col-md-12'>
                <Form.Label>Language</Form.Label>
                <input
                  type="text"
                  name="language"
                  required
                  placeholder="Enter a language..."
                  onChange={handleAddFormChange}
                  className="form-control mb-2"
                />
                {addFormData.language}
              </div>
            </div>
            <div className='row'>
              <div className='col-md-3'>
                <div className="form-group">
                  <Form.Label><br></br></Form.Label>
                  Read ? <span className='text-danger'>*</span>
                  <div className="material-switch pull-right">
                      <input id="readSkill" onChange={handleAddFormChange} name="readSkill" type="checkbox" />
                      <label htmlFor="readSkill" className="label-success"></label>
                  </div>
                </div>
              </div>
              <div className='col-md-3'>
                <div className="form-group">
                  <Form.Label><br></br></Form.Label>
                  write ? <span className='text-danger'>*</span>
                  <div className="material-switch pull-right">
                      <input id="writeSkill" onChange={handleAddFormChange} name="writeSkill" type="checkbox" />
                      <label htmlFor="writeSkill" className="label-success"></label>
                  </div>
                </div>
              </div>
              <div className='col-md-3'>
                <div className="form-group">
                  <Form.Label><br></br></Form.Label>
                  Speak ? <span className='text-danger'>*</span>
                  <div className="material-switch pull-right">
                      <input id="speakSkill" onChange={handleAddFormChange} name="speakSkill" type="checkbox" />
                      <label htmlFor="speakSkill" className="label-success"></label>
                  </div>
                </div>
              </div>
            </div>
            
            <Button variant="" className="btn btn-primary me-2" type="submit">
              Add
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-primary"
            onClick={() => setModalShow(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div> 
    </>
  )
}
