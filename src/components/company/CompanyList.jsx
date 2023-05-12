import React from 'react'
import { Badge, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import Datatable from '../Helper/Datatable'
import { COMPANY_LIST, COMPANY_STATUS } from '../../services/api/Company'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ToastLeft } from '../../services/notification/Notification'
import { useEffect } from 'react'
import axios from 'axios'
import { getUserData } from '../../services/storage/Storage'
import { isAuthenticated } from '../../services/Auth'
import { checkPermission } from '../../services/Permission'
import AuthError from '../authentication/errorPage/AuthError/AuthError'

const authToken = getUserData()

export const col = [
    {
      Header: "COMPANY",
      accessor: "compName",
      className: "text-center wd-15p border-bottom-0",
    },
    {
      Header: "MOBILE",
      accessor: "mobileNo",
      className: "text-center wd-15p border-bottom-0",
    },
    {
      Header: "EMAIL",
      accessor: "email",
      className: "text-center wd-15p border-bottom-0",
    },
    {
      Header: "ADDRESS",
      accessor: "address",
      className: "text-center wd-15p border-bottom-0",
    },
    {
      Header: "IS CRM",
      accessor: "isCrmhave",
      className: "text-center wd-15p border-bottom-0",
    },
    {
      Header: "STATUS",
      accessor: "status",
      className: "text-center wd-15p border-bottom-0 ",
    },
    {
        Header: "ACTION",
        accessor: "action",
        className: "text-center wd-15p border-bottom-0 ",
    }
];
export default function CompanyList() {
    
    const [datatable,setDatatable] = useState([])
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()

    const statusClick = (id) => {
        COMPANY_STATUS(id).then((res) => {
            getCompanyList()
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

    const getCompanyList = (() => {
        COMPANY_LIST().then((res) => {
            const data = res.data.Data
            const tableData = data.map((res) => ({
                compName    : res.CompName,
                mobileNo    : res.MobileNo,
                email       : res.Email,
                address     : `${res.Address}, ${res.CityName} - ${res.Postcode},${res.StateName},${res.CountryName},`,
                isCrmhave   : res.IsCrmhave ? <Badge bg="success">Yes</Badge> : <Badge bg="danger">No</Badge>,
                status      : res.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">De Active</Badge> ,
                action      : (<>
                                {
                                    checkPermission('Companies_Edit') ? (
                                        <>
                                            <Link to={`/editcompany/${res.ParamStr}`} ><OverlayTrigger placement="top" overlay={<Tooltip >Edit</Tooltip>}><span className="fe fe-edit me-2 text-primary"></span></OverlayTrigger></Link>
                                            {
                                                res.IsActive ? <Link onClick={() => statusClick(res.ParamStr)}><OverlayTrigger placement="top" overlay={<Tooltip >De active</Tooltip>}><span className="zmdi zmdi-eye me-2 text-primary"></span></OverlayTrigger></Link>
                                                : <Link onClick={() => statusClick(res.ParamStr)}><OverlayTrigger placement="top" overlay={<Tooltip >Active</Tooltip>}><span className="zmdi zmdi-eye-off me-2 text-danger"></span></OverlayTrigger></Link> 
                                            }
                                        </>
                                    ) : ''
                                }
                            </>)
            }))
            setDatatable(tableData)
        }).catch((error) => {
            ToastLeft(error.message,"Failed");
        })
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
        getCompanyList()
    },[])

    if(!isAuthenticated()){
        navigate('/')
    }

  return (
    <>
    <PageHeader titles="" active="company" items={['Home']} />
    <Row>
          <Col xl={12}>
              <ToastContainer />
              <Card>
                    <Card.Header>
                        <Card.Title as="h3">Company List</Card.Title>
                        {
                            checkPermission('Companies_Add') ? <Link to={'/newcompany'} style={{float:'right'}} className='d-flex ms-auto mx-2 btn btn-success'>Add company</Link> : ''
                        }
                    </Card.Header>
                    <Card.Body>
                    {
                        checkPermission('Companies_List') ? <Datatable data={datatable} col={col} /> : <AuthError />
                    }
                    </Card.Body>
              </Card>
          </Col>
      </Row>
  </>
  )
}
