import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from "react-select";
import { ToastContainer } from 'react-toastify';
import { getUserData } from '../../services/storage/Storage';
import { activeSubModuleList, insertModuleOperation, operationList } from '../../services/api/Utility';
import { ToastLeft } from '../../services/notification/Notification';
import { isAuthenticated } from '../../services/Auth';
import PageHeader from '../../layouts/PageHeader/PageHeader';
import Loader from '../../services/loader/Loader';

const authToken = getUserData()

export default function InsertModuleOperation() {  

  const navigate = useNavigate()

    const [module,setModule] = useState([])
    const [operation,setOperation] = useState([])
    const [option,setOption] = useState([])

    const [insertModule,setInsertModule] = useState({moduleId:''})
    const [selected, setSelected] = useState([]);

    
    const [loading,setLoading] = useState(true)

    const [displayValue,getValue] = useState()

    const initialStateErrors = {
        moduleId      : {required:false},
        operationId   : {required:false},
        custom_Errors : null,
    }

    const [errors,setErrors] = useState(initialStateErrors)

    const getSubModule = () => {
        activeSubModuleList().then((res) => {
            setModule(res.data.Data)
        })
    }
 
    const getOperation = (() => {
        try {
            operationList().then((res) => {
                const data = res.data.Data
                const drobValue = data.map((res) => ({
                    value : res.Id,
                    label : res.Name
                }))
                setOption(drobValue)
                setOperation(data)
            })
        } catch (error) {
            console.log(error);
        }
    })
    
    const handleInput = (e) => {
        const inputData = {...insertModule,[e.target.name] : e.target.value}
        if(inputData.moduleId !== "" ) errors.moduleId.required = false
        setInsertModule(inputData);
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const hasError = false

        if(insertModule === ""){
            errors.moduleId.required = true
            hasError = true        
        }
        if(operation === ""){
            errors.operationId.required = true
            hasError = true
        }
        if(!hasError){
            setLoading(false)
            const selectedValue = selected.map(dt => dt.value);
            insertModuleOperation(insertModule,selectedValue).then((res) => {
                const type = res.data.result
                const msg = res.data.Msg 
                if(res.data.result === 'success'){
                  ToastLeft(msg,type)
                  setLoading(true)
                }
                else if(res.data.result === 'Failed'){
                  ToastLeft(msg,type)
                  setLoading(true)
                }
            }).catch((error) => {
                ToastLeft(error.message,"Failed");
            })
        }
        setErrors(errors)
    }

    useEffect(() => {
        axios.interceptors.request.use(
            config => {
                config.headers.authorization = `Bearer ${authToken}`;
                return config;
            },
            error => {
                return Promise.reject(error);
        })
        getSubModule()
        getOperation()
    },[])
      
    if(!isAuthenticated()){
      navigate('/')
    }
    
  return (
    <>
    <div>
        <ToastContainer />
        {/* <!-- ROW-1 OPEN --> */}
        <Row>
            <Col xl={6}>
                <Card>
                    <Card.Header>
                        <Card.Title as="h3">Add Module</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Form.Group>
                            <Form.Label>Module Name</Form.Label>
                            <select className='form-control' onChange={handleInput} required={true} name="moduleId" >
                                <option value="">Select Module Name</option>
                                {
                                    module.map(res => (
                                        <option key={res.Id} value={res.Id}>{res.SubModuleName}</option>
                                    ))  
                                }
                            </select>
                            {/* {                              
                              errors.moduleId ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.moduleId}</p> : null
                            } */}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Operation Name</Form.Label>
                            <Select
                                value={selected}
                                onChange={setSelected}
                                labelledBy="Select"
                                disableSearch={true}
                                options={option}
                                isMulti
                                name='Operation'
                            />
                        </Form.Group>
                        {/* {                              
                          errors.indexing ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.Operation}</p> : null
                        } */}
                    </Card.Body>
                    <Card.Footer className="text-end">
                    { loading ? (
                      <><button onClick={handleSubmit} type='submit' className="btn btn-success me-2">Save</button>
                      <button type='reset' className="btn btn-danger me-2">Cancel</button></>) : (<Loader />) }
                    </Card.Footer>
                </Card>
            </Col>
        </Row>
        {/* <!-- ROW-1 CLOSED --> */}
    </div>
    </>
  )
}

const GlobalResFilter = ({ filter, setFilter }) => {
    return (
      <span className="d-flex ms-auto">
        <input
          value={filter || ""}
          onChange={(e) => setFilter(e.target.value)}
          className="form-control mb-4"
          placeholder="Search..."
        />
      </span>
    );
};
