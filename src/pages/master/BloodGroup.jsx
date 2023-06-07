import React, { useEffect, useState } from 'react'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import { Badge, Card, Col,OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { ToastLeft } from '../../services/notification/Notification'
import { BLOODSTATUS } from '../../services/api/Master'
import Datatable from '../../components/Helper/Datatable'
import { checkPermission } from '../../services/Permission'
import AuthError from '../../components/authentication/errorPage/AuthError/AuthError'
import { isAuthenticated } from '../../services/Auth'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBloodGroupData } from '../../Redux/slice/Master/BloodGroup'
import BloodModel from './models/BloodModel'

export const COLUMNS = [
    {
      Header: "NAME",
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

export default function Blood() {
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

    const bloodGroupList = useSelector((state) => state.bloodGroup.bloodGroupList.c)

    useEffect(() => {
        dispatch(fetchBloodGroupData())
    },[dispatch])

    useEffect(() => {
        const statusClick = (pk) => {
            BLOODSTATUS(pk).then(res => {
                dispatch(fetchBloodGroupData())
                const type = res.data.result
                const msg = res.data.Msg 
                if(res.data.result === 'success'){
                    ToastLeft(msg,type)
                }
                else if(res.data.result === 'Failed'){
                    ToastLeft(msg,type)
                }
            }).catch((error) => {
                ToastLeft(error.message,"Failed");
            })
        }

        const getBloodList = (() => {
            if(bloodGroupList) {
                const tableData = bloodGroupList.map((res) => ({
                NAME        : res.Name,
                STATUS      : res.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">De Active</Badge> ,
                ACTION      : (<>
                    {
                        checkPermission('Blood Group_Edit') ? (
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
        getBloodList()
    },[bloodGroupList,dispatch])


    if(!isAuthenticated()){
        navigate('/')
    }

  return (
    <>
        <PageHeader titles="" active="Blood Group" items={['Pages']} />
        <ToastContainer />
        <Row>
            <Col xl={12}>
                <Card>
                    <Card.Header>
                        <Card.Title>Blood Group</Card.Title>
                        <BloodModel isOpen={isModalOpen} onClose={closeModal} />

                        {
                            checkPermission('Blood Group_Add') ? <button style={{float:'right'}} className='d-flex ms-auto mx-2 btn btn-outline-success' onClick={openModal}>Add Blood Group</button> : ''
                        }
                    </Card.Header>
                    <Card.Body>
                        {
                            checkPermission('Blood Group_List') ? (<>
                                <Datatable data={DATATABLE} col={COLUMNS} />
                            </>) : <AuthError />
                        }
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>
  )
}
