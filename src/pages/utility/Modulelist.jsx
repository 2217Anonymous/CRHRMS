import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Table, Button, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTable, useSortBy, useGlobalFilter, usePagination, } from "react-table";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup'
import { ToastContainer } from 'react-toastify';
import { getUserData } from '../../services/storage/Storage';
import { addModule, moduleList, moduleStatus } from '../../services/api/Utility';
import { ToastLeft } from '../../services/notification/Notification';
import { isAuthenticated } from '../../services/Auth';
import PageHeader from '../../layouts/PageHeader/PageHeader';
import Loader from '../../services/loader/Loader';
import Datatable from '../../components/Helper/Datatable';


const authToken = getUserData()

export const COLUMNS = [
    {
      Header: "NAME",
      accessor: "NAME",
      className: "text-center wd-15p border-bottom-0",
    },
    {
      Header: "DESCRIPTION",
      accessor: "DESCRIPTION",
      className: "text-center wd-15p border-bottom-0 ",
  
    },
    {
      Header: "INDEXING",
      accessor: "INDEXING",
      className: "text-center wd-15p border-bottom-0 ",
    },
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
  

export default function Modulelist() {  

    const navigate = useNavigate()
    const [loading,setLoading] = useState(true)
    const [DATATABLE,setDATATABLE] = useState([])


    const getmoduleList = (() => {
        moduleList().then((res) => {
            const data = res.data.Data
            const tableData = data.map((res) => ({
              NAME        : res.ModuleName,
              DESCRIPTION : res.Description,
              INDEXING    : res.Indexing,
              STATUS      : res.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">De Active</Badge> ,
              ACTION      : res.IsActive ? <Link onClick={() => statusClick(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >De active</Tooltip>}><span className="zmdi zmdi-eye me-2 text-primary"></span></OverlayTrigger></Link>
              : <Link onClick={() => statusClick(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >Active</Tooltip>}><span className="zmdi zmdi-eye-off me-2 text-danger"></span></OverlayTrigger></Link>
            }))
            setDATATABLE(tableData)
        })
    })

    const statusClick = (pk) => {
        moduleStatus(pk).then(res => {
            getmoduleList()
        })
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

        getmoduleList()
    },[])
      
    const on_submit =  useFormik({
      initialValues : {
        moduleName : '',
        describe : '',
        indexing : '',
        Icon:''
      },
      validationSchema:yup.object({
        moduleName : yup.string()
        .strict()
        .trim()
        .required("module name is required")
        .min(3,"Minimum 3 Charactors")
        .max(16,"Maximum 16 Charactors"),
        indexing : yup.number()
        .required("index number is required")
        .min(1),
        Icon : yup.string()
        .required("Icon is required")
      }),
      onSubmit:(userInputData) => {
        setLoading(true)
          addModule(userInputData).then((res) => {
            console.log(res);
            getmoduleList()
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
    })
    
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
            <div className="form-group">
                <Form.Label>Module Name</Form.Label>
                <input className="form-control" onChange={on_submit.handleChange} name="moduleName" required type="text" placeholder="Enter module name" />
                {                              
                  on_submit.errors.moduleName ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.moduleName}</p> : null
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
                <Form.Label>Icon</Form.Label>
                <input className="form-control" onChange={on_submit.handleChange} name="Icon" required type="text" placeholder="Enter icon class" />
                {                              
                  on_submit.errors.Icon ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.Icon}</p> : null
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

