import React, { useEffect, useState } from 'react'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import { Badge, Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Datatable from '../Helper/Datatable'
import { GETCANDIDATE } from '../../services/api/Hrms'
import { getUserData } from '../../services/storage/Storage'
import { ToastLeft } from '../../services/notification/Notification'
import axios from 'axios'

const authToken = getUserData()

export const col = [
  {
    Header: "NAME",
    accessor: "Name",
    className: "text-center wd-15p border-bottom-0",
  },
  {
    Header: "GENDER",
    accessor: "Gender",
    className: "text-center wd-15p border-bottom-0",
  },
  {
    Header: "DOB",
    accessor: "DateOfBirth",
    className: "text-center wd-15p border-bottom-0",
  },
  {
    Header: "AGE",
    accessor: "Age",
    className: "text-center wd-15p border-bottom-0",
  },
  {
    Header: "BLOOD GROUP",
    accessor: "BloodGroup",
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
  },
];

export default function EmployeeList() {
  const [datatable,setDatatable] = useState([])
  const [loading,setLoading] = useState(false)

  const getEmployee = () => {
    GETCANDIDATE().then((res) => {
      const data = res.data.Data
      const tableData = data.map((res) => ({
        Name        : res.FirstName,
        Gender      : res.Gender,
        DateOfBirth : res.DateOfBirth,
        Age         : res.Age,
        BloodGroup  : res.BloodGroup,
        status      : res.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">De Active</Badge> ,
        action      : (<>
                          <Link to={`/updatecandidate/${res.ParamStr}`} ><OverlayTrigger placement="top" overlay={<Tooltip >Edit</Tooltip>}><span className="fe fe-edit me-2 text-primary"></span></OverlayTrigger></Link> 
                      </>)
      }))
        setDatatable(tableData)
      }).catch((error) => {
        ToastLeft(error.message,"Failed");
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
    getEmployee()
  },[])

  return (
    <>
      <PageHeader titles="Candidate" active="Hrme" items={['Candidate']} />
      <Card>
          <Card.Body className="pb-0">
              <div className='d-flex flex-row justify-content-end'>
                  <div>
                      <Link to={'/newcandidate'} className='btn btn-sm btn-success'>Add New Candidate <b>+</b></Link>{ }
                  </div>
              </div>
              <br />
              <Datatable data={datatable} col={col} />
          </Card.Body>
      </Card>  
    </>   
  )
}
