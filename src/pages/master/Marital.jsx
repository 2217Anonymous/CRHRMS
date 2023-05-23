import React, { useEffect, useState } from 'react'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import { Badge, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { NARITALSTATUS } from '../../services/api/Master'
import { ToastLeft } from '../../services/notification/Notification'
import { checkPermission } from '../../services/Permission'
import Datatable from '../../components/Helper/Datatable'
import { isAuthenticated } from '../../services/Auth'
import AuthError from '../../components/authentication/errorPage/AuthError/AuthError'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMaritalData } from '../../Redux/slice/Master/Marital'
import MaritalModel from './models/MaritalModel'

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

export default function Marital() {
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
    const matrial_list = useSelector((state) => state.gender.genderList.Data)

    useEffect(() => {
        const statusClick = (pk) => {
            NARITALSTATUS(pk).then(res => {
                getMaritalList()
                const type = res.data.result
                const msg = res.data.Msg 
                if(res.data.result === 'success'){
                    ToastLeft(msg,type)
                    dispatch(fetchMaritalData())
                }
                else if(res.data.result === 'Failed'){
                    ToastLeft(msg,type)
                }
            }).catch((error) => {
                ToastLeft(error.message,"Failed");
            })
        }

        const getMaritalList = (() => {
            if(matrial_list){
                const tableData = matrial_list.map((res) => ({
                    NAME        : res.Name,
                    STATUS      : res.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">De Active</Badge> ,
                    ACTION      : (<>
                      {
                        checkPermission('Marital Status_Edit') ? (
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
        getMaritalList()
    },[matrial_list,dispatch])
      
    useEffect(() => {
        dispatch(fetchMaritalData())
    },[dispatch])

    if(!isAuthenticated()){
        navigate('/')
    }
  return (
    <>
        <PageHeader titles="Marital" active="Marital" items={['Pages']} />
        <ToastContainer />

        <Row>
            <Col xl={12}>
                <Card>
                    <Card.Header>
                        <Card.Title>Marital</Card.Title>
                        <MaritalModel isOpen={isModalOpen} onClose={closeModal} />

                        {
                            checkPermission('Marital Status_Add') ? <button style={{float:'right'}} className='d-flex ms-auto mx-2 btn btn-outline-success' onClick={openModal}>Add Marital Status</button> : ''
                        }
                    </Card.Header>
                    <Card.Body>
                    {
                        checkPermission('Marital Status_List') ? <Datatable data={DATATABLE} col={COLUMNS} /> : <AuthError/>
                    }
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>
  )
}