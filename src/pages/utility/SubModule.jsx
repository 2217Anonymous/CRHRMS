import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Table, Button, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTable, useSortBy, useGlobalFilter, usePagination, } from "react-table";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup'
import { ToastContainer } from 'react-toastify';
import { getUserData } from '../../services/storage/Storage';
import { activeModuleList, addSubModule, subModuleList, subModuleStatus } from '../../services/api/Utility';
import { ToastLeft } from '../../services/notification/Notification';
import { isAuthenticated } from '../../services/Auth';
import Loader from '../../services/loader/Loader';
import Datatable from '../../components/Helper/Datatable';

const authToken = getUserData()

export const COLUMNS = [
  {
    Header: "MODULE NAME",
    accessor: "MODULENAME",
    className: "text-center wd-15p border-bottom-0",
  },
  {
    Header: "SUB MODULE NAME",
    accessor: "SUB_MODULENAME",
    className: "text-center wd-15p border-bottom-0",
  },
  {
    Header: "DESCRIPTION",
    accessor: "DESCRIPTION",
    className: "text-center wd-15p border-bottom-0 ",
  },
  // {
  //   Header: "INDEXING",
  //   accessor: "INDEXING",
  //   className: "text-center wd-15p border-bottom-0 ",
  // },
  {
    Header: "STATUS",
    accessor: "STATUS",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "ACTION",
    accessor: "ACTION",
    className: "text-center wd-15p border-bottom-0 ",
  },
];

export default function SubModule() {  
   const navigate = useNavigate()

    const [module,setModule] = useState([])
    const [loading,setLoading] = useState(true)
    const [DATATABLE,setDATATABLE] = useState([])

    const getModule = () => {
        activeModuleList().then((res) => {
            setModule(res.data.Data)
        }).catch((error) => {
          ToastLeft(error.message,"Failed");
        })
    }

    const getSubModule = (() => {
        subModuleList().then((res) => {
          const data = res.data.Data
          const tableData = data.map((res) => ({
            MODULENAME     : res.ModuleName,
            SUB_MODULENAME : res.SubModuleName,
            DESCRIPTION : res.Description,
            STATUS      : res.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">De Active</Badge> ,
            ACTION      : res.IsActive ? <Link onClick={() => statusClick(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >De active</Tooltip>}><span className="zmdi zmdi-eye me-2 text-primary"></span></OverlayTrigger></Link>
            : <Link onClick={() => statusClick(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >Active</Tooltip>}><span className="zmdi zmdi-eye-off me-2 text-danger"></span></OverlayTrigger></Link>
          }))
          setDATATABLE(tableData)
        }).catch((error) => {
          ToastLeft(error.message,"Failed");
        })  
    })

    const statusClick = (pk) => {
        subModuleStatus(pk).then(res => {
          getSubModule()
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

    const on_submit =  useFormik({
      initialValues : {
        moduleName : '',
        subModuleName : '',
        describe : '',
        indexing : '',
        path : ""
      },
      validationSchema:yup.object({
        moduleName : yup.string()
        .required(),

        subModuleName : yup.string()
        .strict()
        .trim()
        .required("module name is required")
        .min(3,"Minimum 3 Charactors")
        .max(16,"Maximum 16 Charactors"),
  
        indexing : yup.number()
        .required("index number is required")
        .min(1),

        path : yup.string()
        .required("Path is required")
      }),
      onSubmit:(userInputData) => {
        setLoading(true)
          addSubModule(userInputData).then((res) => {
            getSubModule()
          }).catch((error) => {
            ToastLeft(error.message,"Failed");
          })
      }
    })

    useEffect(() => {
        axios.interceptors.request.use(
            config => {
                config.headers.authorization = `Bearer ${authToken}`;
                return config;
            },
            error => {
                return Promise.reject(error);
        })
        getModule()
        getSubModule()
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
        <Col xl={3}>
            <Form.Group>
                <Form.Label>Module Name</Form.Label>
                <select className='form-control' onChange={on_submit.handleChange} required={true} name="moduleName" >
                    <option value="">Select Module Name</option>
                    {
                        module.map(res => (
                            <option key={res.Id} value={res.Id}>{res.ModuleName}</option> 
                        ))  
                    }
                </select>
                {                              
                  on_submit.errors.moduleName ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.moduleName}</p> : null
                }  
            </Form.Group>
            <div className="form-group">
                <Form.Label>Sub Module Name</Form.Label>
                <input className="form-control" onChange={on_submit.handleChange} name="subModuleName" required type="text" placeholder="Enter operation name" />
                {                              
                  on_submit.errors.subModuleName ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.subModuleName}</p> : null
                }    
            </div>
            <div className="form-group">
                <Form.Label>Description</Form.Label>
                <textarea className="form-control mb-4" onChange={on_submit.handleChange} name="describe" required placeholder="Enter description" rows={4}></textarea>
            </div>
            <div className="form-group">
                <Form.Label>Index No</Form.Label>
                <input className="form-control" onChange={on_submit.handleChange} name="indexing" required type="number" placeholder="Enter index no" />
                {                              
                  on_submit.errors.indexing ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.indexing}</p> : null
                }
            </div>
            <div className="form-group">
                <Form.Label>Path</Form.Label>
                <input className="form-control" onChange={on_submit.handleChange} name="path" required type="text" placeholder="Enter index no" />
                {                              
                  on_submit.errors.path ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.path}</p> : null
                }
            </div>
            <div className="text-end">
              { loading ? (
              <><button onClick={on_submit.handleSubmit} type='submit' className="btn btn-success me-2">Save</button>
              <button type='reset' className="btn btn-danger me-2">Cancel</button></>) : (<Loader />) }
            </div>
          </Col>
          <Col xl={9}>
            <Datatable data={DATATABLE} col={COLUMNS} />
          </Col>
        </Row>
        {/* <!-- ROW-1 CLOSED --> */}
    </div>
    </>
  )
}

