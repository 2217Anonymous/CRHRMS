import React, { useEffect, useState } from 'react'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import { Badge, Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Datatable from '../Helper/Datatable'
import { GETCANDIDATE } from '../../services/api/Hrms'
import { getUserData, setHistory } from '../../services/storage/Storage'
import { ToastLeft } from '../../services/notification/Notification'
import axios from 'axios'
import { checkPermission } from '../../services/Permission'
import AuthError from '../authentication/errorPage/AuthError/AuthError'

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
        DateOfBirth : res.DateOfBirth.slice(0,10),
        Age         : res.Age,
        BloodGroup  : res.BloodGroup,
        status      : res.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">De Active</Badge> ,
        action      : (<>
                        {
                          checkPermission('Candidates_Edit') ? (<>
                            <Link to={`/updatecandidate/${res.ParamStr}`} ><OverlayTrigger placement="top" overlay={<Tooltip >Edit</Tooltip>}><span className="fe fe-edit me-2 text-primary"></span></OverlayTrigger></Link>
                            {
                              checkPermission('Candidates_View') ? <Link to={`/JoiningEntry/${res.ParamStr}`} onClick={() => {setHistory(res.Id)}} ><OverlayTrigger placement="top" overlay={<Tooltip >View</Tooltip>}><span className="fe fe-eye me-2 text-info"></span></OverlayTrigger></Link> : ''
                            }
                           </>) : ''
                        }    
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
          <Card.Header>
            <Card.Title as="h3">Candidate List</Card.Title>
              {
                checkPermission('Candidates_Add') ? <Link to={'/newcandidate'} style={{float:'right'}} className='d-flex ms-auto mx-2 btn btn-success'>Add New Candidate</Link> : ''
              }
          </Card.Header>
          <Card.Body className="pb-0">
              {
                checkPermission('Candidates_List') ? <Datatable data={datatable} col={col} /> : <AuthError />
              }
              <hr></hr>
          </Card.Body>
      </Card>  
    </>   
  )
}
