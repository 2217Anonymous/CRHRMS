import React, { Fragment, useEffect, useState } from 'react';
import { Badge, Button, Form, Modal } from 'react-bootstrap';
import { ADDLANGUAGE, GETLANGUAGE } from '../../../services/api/Hrms';

// Add New Row with Edit Table
export const Savetable = (props) => {
  const [modalShow, setModalShow] = useState(false);
  const [data,setData] = useState([])
  const getLanguage = () => {
    GETLANGUAGE(props.id).then(res => {
      const dt = res.data.Data
      const tableData = dt.map((res) => ({
        id         : res.Id,
        language   : res.Language,
        readSkill  : res.ReadSkill ? <Badge bg="success">True</Badge> : <Badge bg="danger">False</Badge>,
        writeSkill : res.WriteSkill ? <Badge bg="success">True</Badge> : <Badge bg="danger">False</Badge> ,   
        speakSkill : res.SpeakSkill ? <Badge bg="success">True</Badge> : <Badge bg="danger">False</Badge>, 
      }))
      setData(tableData)
    })
  }

  const [contacts, setContacts] = useState(data);
  const [language, setLanguage] = useState(data);

  const [addFormData, setAddFormData] = useState({
    language  : "",
    readSkill : "",
    writeSkill: "",
    speakSkill: "",
  });

  const [editFormData, setEditFormData] = useState({
    language  : "",
    readSkill : "",
    writeSkill: "",
    speakSkill: "",
  });

  const [editContactId, setEditContactId] = useState(null);
  const [editLanguageId, setEditLanguageId] = useState(null);

  const handleAddFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  };

  const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

  const handleAddFormSubmit = (event) => {
    event.preventDefault();
    const newLanguage = {
      language    : addFormData.language,
      writeSkill  : addFormData.writeSkill,
      readSkill   : addFormData.readSkill,
      speakSkill  : addFormData.speakSkill,
    };

    console.log(newLanguage);

    ADDLANGUAGE(props.id,newLanguage).then(res => {
      console.log(res.data); 
    })

    const newContacts = [...contacts, newLanguage];
    setContacts(newContacts);
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();

    const editedContact = {
      id: editContactId,
      fullName: editFormData.fullName,
      position: editFormData.position,
      start: addFormData.start,
      salary: editFormData.salary,
      email: editFormData.email,
    };

    const newContacts = [...contacts];

    const index = contacts.findIndex((contact) => contact.id === editContactId);

    newContacts[index] = editedContact;

    setContacts(newContacts);
    setEditContactId(null);
  };

  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.id);

    const formValues = {
      fullName: contact.fullName,
      position: contact.position,
      start: contact.start,
      salary: contact.salary,
    };

    setEditFormData(formValues);
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleDeleteClick = (contactId) => {
    const newContacts = [...contacts];

    const index = contacts.findIndex((contact) => contact.id === contactId);

    newContacts.splice(index, 1);

    setContacts(newContacts);
  };

  useEffect(() => {
    getLanguage()
  },[])
  return (
    <div className="app-container table-responsive">
      <pre>{JSON.stringify(data)}</pre>
      <form onSubmit={handleEditFormSubmit}>
        <Button
          variant=""
          className="btn btn-primary mb-3"
          onClick={() => setModalShow(true)}
        >
          Add New Row
        </Button>
        <table id="delete-datatable" className="table table-bordered text-nowrap border-bottom">
          <thead>
            <tr>
              <th>Language</th>
              <th>Write</th>
              <th>Read</th>
              <th>Speak</th>
            </tr>
          </thead>
          <tbody>
            {data.map((data) => (
              <Fragment key={data.id}>
              {
                editContactId === data.id ? (
                  <EditableRow editFormData={editFormData} handleEditFormChange={handleEditFormChange} handleCancelClick={handleCancelClick} />
                ) : (
                  <ReadOnlyRow data={data} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick}/>
                )
              }
              </Fragment>
            ))}
          </tbody>
        </table>
      </form>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
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
  );
};
const EditableRow = ({
  editFormData,
  handleEditFormChange,
  handleCancelClick,

}) => {
  return (
    <tr>
      <td>
      <input
        type="text"
        name="language"
        required
        placeholder="Enter a language..."
        onChange={handleEditFormChange}
        className="form-control mb-2"
      />
      </td>
      <td>
        {
          true ? <Badge bg="success">Success</Badge> : <Badge bg="danger">Danger</Badge>
        }
      </td>
      <td>
        {
          true ? <Badge bg="success">Success</Badge> : <Badge bg="danger">Danger</Badge>
        }
      </td>
      <td>
        {
          true ? <Badge bg="success">Success</Badge> : <Badge bg="danger">Danger</Badge>
        }
      </td>
      <td>
        <Button variant="" className="btn btn-primary me-1" type="submit">
          Save
        </Button>
        <Button variant="" className="btn btn-danger me-1" onClick={handleCancelClick} >
          Cancel
        </Button>
      </td>
    </tr>
  );
};
const ReadOnlyRow = ({ data, handleEditClick, handleDeleteClick }) => {
  return (
    <tr>
      <td>{data.language}</td>
      <td>{data.readSkill}</td>
      <td>{data.writeSkill}</td>
      <td>{data.speakSkill}</td>
      <td>
        <Button
          variant=""
          className="btn btn-primary me-1"
          type="button"
          onClick={(event) => handleEditClick(event, data)}
        >
          Edit
        </Button>
        <Button
          variant=""
          className="btn btn-danger me-1"
          type="button"
          onClick={() => handleDeleteClick(data.id)}
        >
          Delete
        </Button>
      </td>
    </tr>
  );
};


