import React, { useEffect, useState } from 'react'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import { Badge, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { DEPARTMENTSTATUS} from '../../services/api/Master'
import { ToastLeft } from '../../services/notification/Notification'
import { ToastContainer } from 'react-toastify'
import { checkPermission } from '../../services/Permission'
import Datatable from '../../components/Helper/Datatable'
import { isAuthenticated } from '../../services/Auth'
import AuthError from '../../components/authentication/errorPage/AuthError/AuthError'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDepartmentData } from '../../Redux/slice/Master/Department'
import DepartmentModel from './models/DepartmentModel'

export const COLUMNS = [
    {
      Header: "DEPARTMENT",
      accessor: "DEPARTMENT",
      className: "text-center wd-15p border-bottom-0",
    },
    {
      Header: "DESCRIPTION",
      accessor: "DESCRIPTION",
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

export default function Departments() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [DATATABLE,setDATATABLE] = useState([])

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const departmentList = useSelector((state) => state.department.departmentList.Data)
    
    useEffect(() => {
        const statusClick = (pk) => {
            DEPARTMENTSTATUS(pk).then(res => {
                const type = res.data.result
                const msg = res.data.Msg 
                if(res.data.result === 'success'){
                    dispatch(fetchDepartmentData())
                    ToastLeft(msg,type)
                }
                else if(res.data.result === 'Failed'){
                    ToastLeft(msg,type)
                }
            }).catch((error) => {
                ToastLeft(error.message,"Failed");
            })
        }

        const getDepartmentList = (() => {
            if (departmentList) {
                const tableData = departmentList.map((res) => ({
                  DEPARTMENT  : res.DeptName,
                  DESCRIPTION : res.Description,
                  STATUS      : res.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">De Active</Badge> ,
                  ACTION      : (<>
                    {
                      checkPermission('Departments_Edit') ? (
                          <>
                          {
                              res.IsActive ? <Link onClick={() => statusClick(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >De active</Tooltip>}><span className="zmdi zmdi-eye me-2 text-primary"></span></OverlayTrigger></Link>
                             : <Link onClick={() => statusClick(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >Active</Tooltip>}><span className="zmdi zmdi-eye-off me-2 text-danger"></span></OverlayTrigger></Link>
                          }
                          </>) : ''
                    }
                    </>)
                }))
                setDATATABLE(tableData)
            }
        })

        getDepartmentList()
    },[departmentList,dispatch])
    

    useEffect(() => {
        dispatch(fetchDepartmentData)
    },[dispatch])


    if(!isAuthenticated()){
        navigate('/')
    }
  return (
    <>
        <PageHeader titles="Departments" active="Departments" items={['Pages']} />
        <ToastContainer />
        <Row>
            <Col xl={12}>
                <Card>
                    <Card.Header>
                        <Card.Title>Departments</Card.Title>
                        <DepartmentModel isOpen={isModalOpen} onClose={closeModal} />
                        {
                            checkPermission('Departments_Add') ? <button style={{float:'right'}} className='d-flex ms-auto mx-2 btn btn-outline-success' onClick={openModal}>Add Department</button> : ''
                        }
                    </Card.Header>
                    <Card.Body>
                    {
                        checkPermission('Departments_List') ? <Datatable data={DATATABLE} col={COLUMNS} /> : <AuthError />
                    }
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>
  )
}
