import React, { useEffect, useState } from 'react'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import { Badge, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { DESIGNATIONSTATUS } from '../../services/api/Master'
import { ToastLeft } from '../../services/notification/Notification'
import { checkPermission } from '../../services/Permission'
import { ToastContainer } from 'react-toastify'
import Datatable from '../../components/Helper/Datatable'
import { isAuthenticated } from '../../services/Auth'
import AuthError from '../../components/authentication/errorPage/AuthError/AuthError'
import { useDispatch, useSelector } from 'react-redux'
import DesignationModel from './models/DesignationModel'
import { fetchDesignationData } from '../../Redux/slice/Master/Designation'

export const COLUMNS = [
    {
      Header: "DEPARTMENT",
      accessor: "DEPARTMENT",
      className: "text-center wd-15p border-bottom-0",
    },
    {
      Header: "DESIGNATION",
      accessor: "DESIGNATION",
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

export default function Gender() {
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

    const designationList = useSelector((state) => state.designation.designationList.Data)
    
    useEffect(() => {
        const statusClick = (pk) => {
            DESIGNATIONSTATUS(pk).then(res => {
                getDesignationList()
                const type = res.data.result
                const msg = res.data.Msg 
                if(res.data.result === 'success'){
                    ToastLeft(msg,type)
                    dispatch(fetchDesignationData())
                }
                else if(res.data.result === 'Failed'){
                    ToastLeft(msg,type)
                }
            }).catch((error) => {
                ToastLeft(error.message,"Failed");
            })
        }

        const getDesignationList = (() => {
            if(designationList){
                const tableData = designationList.map((res) => ({
                    DEPARTMENT  : res.DeptName,
                    DESIGNATION : res.DesignName,
                    DESCRIPTION : res.Description,
                    STATUS      : res.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">De Active</Badge> ,
                    ACTION      : (<>
                    {
                      checkPermission('Designations_Edit') ? (
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

        getDesignationList()
    },[designationList,dispatch])

    useEffect(() => {
        dispatch(fetchDesignationData())
    },[dispatch])

    if(!isAuthenticated()){
        navigate('/')
    }
  return (
    <>
        <PageHeader titles="Designation" active="Designation" items={['Pages']} />
        <ToastContainer />
        <Row>
            <Col xl={12}>
                <Card>
                    <Card.Header>
                        <Card.Title>Designation</Card.Title>
                        <DesignationModel isOpen={isModalOpen} onClose={closeModal} />
                        {
                            checkPermission('Designations_Add') ? <button style={{float:'right'}} className='d-flex ms-auto mx-2 btn btn-outline-success' onClick={openModal}>Add Designation</button> : ''
                        }
                    </Card.Header>
                    <Card.Body>
                    {
                        checkPermission('Designations_List') ? <Datatable data={DATATABLE} col={COLUMNS} />: <AuthError />
                    }
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>
  )
}
