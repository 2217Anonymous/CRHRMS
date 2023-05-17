import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup'
import { ToastContainer } from 'react-toastify';
import { getUserData } from '../../services/storage/Storage';
import { Link, useNavigate } from 'react-router-dom';
import { addOperation, operationList, operationStatus } from '../../services/api/Utility';
import { ToastLeft } from '../../services/notification/Notification';
import { isAuthenticated } from '../../services/Auth';
import PageHeader from '../../layouts/PageHeader/PageHeader';
import Loader from '../../services/loader/Loader';
import Datatable from '../../components/Helper/Datatable';

const authToken = getUserData()

export const COLUMNS = [
  {
    Header: "MODULE NAME",
    accessor: "NAME",
    className: "text-center wd-15p border-bottom-0",
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
export default function Operationlist() {  

    const navigate = useNavigate()
    const [loading,setLoading] = useState(true)
    const [DATATABLE,setDATATABLE] = useState([])

    const getOperation = (() => {
        operationList().then((res) => {
          const data = res.data.Data
          const tableData = data.map((res) => ({
            NAME        : res.Name,
            STATUS      : res.Status ? <Badge bg="success">Active</Badge> : <Badge bg="danger">De Active</Badge> ,
            ACTION      : res.Status ? <Link onClick={() => statusClick(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >De active</Tooltip>}><span className="zmdi zmdi-eye me-2 text-primary"></span></OverlayTrigger></Link>
            : <Link onClick={() => statusClick(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >Active</Tooltip>}><span className="zmdi zmdi-eye-off me-2 text-danger"></span></OverlayTrigger></Link>
          }))
          setDATATABLE(tableData)

      }).catch((error) => {
        ToastLeft(error.message,"Failed");
      })
    })

    const statusClick = (pk) => {
        operationStatus(pk).then(res => {
            getOperation()
        }).catch((error) => {
          ToastLeft(error.message,"Failed");
        })
    }

    const on_submit =  useFormik({
      initialValues : {
        operationName : '',
      },
      validationSchema:yup.object({
        operationName : yup.string()
        .strict()
        .trim()
        .required("module name is required")
        .min(3,"Minimum 3 Charactors")
        .max(50,"Maximum 50 Charactors"),
      }),
      onSubmit:(userInputData) => {
        setLoading(true)
          addOperation(userInputData).then((res) => {
            getOperation()
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
          <Col xl={3}>
            <div className="form-group">
                <Form.Label>Operation Name</Form.Label>
                <input className="form-control" onChange={on_submit.handleChange} name="operationName" required type="text" placeholder="Enter operation name" />
                {                              
                  on_submit.errors.operationName ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.operationName}</p> : null
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
