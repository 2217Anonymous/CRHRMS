import React, { useEffect, useState } from 'react'
import { Badge, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import { ToastLeft } from '../../services/notification/Notification'
import { checkPermission } from '../../services/Permission'
import Datatable from '../../components/Helper/Datatable'
import { isAuthenticated } from '../../services/Auth'
import AuthError from '../../components/authentication/errorPage/AuthError/AuthError'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWorktypeData } from '../../Redux/slice/Master/WorkType'
import { WORKSTATUS } from '../../services/api/Master'
import WorkTypeModel from './models/WorkTypeModel'

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

export default function WorkType() {
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

    const worktype_list = useSelector((state) => state.qualification.qualificationList.Data)

    useEffect(() => {
        const statusClick = (pk) => {
            WORKSTATUS(pk).then(res => {
                const type = res.data.result
                const msg = res.data.Msg 
                if(res.data.result === 'success'){
                    ToastLeft(msg,type)
                    dispatch(fetchWorktypeData())
                }
                else if(res.data.result === 'Failed'){
                    ToastLeft(msg,type)
                }
            }).catch((error) => {
                ToastLeft(error.message,"Failed");
            })
        }

        const getWorkList = (() => { 
            if(worktype_list){
                const tableData = worktype_list.map((res) => ({
                    NAME        : res.Name,
                    DESCRIPTION : res.Description,
                    STATUS      : res.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">De Active</Badge> ,
                    ACTION      : (<>
                        {
                          checkPermission('Worktype_Edit') ? (
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
        getWorkList()
    },[worktype_list,dispatch])
    
    useEffect(() => {
        dispatch(fetchWorktypeData())
    },[dispatch])

    if(!isAuthenticated()){
        navigate('/')
    }
  return (
    <>
        <PageHeader titles="WorkType" active="WorkType" items={['Pages']} />
        <ToastContainer/>
        <Row>
            <Col xl={12}>
                <Card>
                    <Card.Header>
                        <Card.Title>WorkType</Card.Title>
                        <WorkTypeModel isOpen={isModalOpen} onClose={closeModal} />

                        {
                            checkPermission('Worktype_Add') ? <button style={{float:'right'}} className='d-flex ms-auto mx-2 btn btn-outline-success' onClick={openModal}>Add Worktype</button> : ''
                        }
                    </Card.Header>
                    <Card.Body>
                    {
                        checkPermission('Worktype_List') ? <Datatable data={DATATABLE} col={COLUMNS} /> : <AuthError />
                    }
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>
  )
}