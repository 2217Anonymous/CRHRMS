import React, { useEffect, useState } from 'react'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import { Badge,Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { GENDERSTATUS } from '../../services/api/Master'
import { ToastLeft } from '../../services/notification/Notification'
import Datatable from '../../components/Helper/Datatable'
import { isAuthenticated } from '../../services/Auth'
import { checkPermission } from '../../services/Permission'
import AuthError from '../../components/authentication/errorPage/AuthError/AuthError'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGenderData } from '../../Redux/slice/Master/Gender'
import GenderModel from './models/GenderModel'

export const COLUMNS = [
    {
      Header: "GENDER",
      accessor: "GENNAME",
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
    const gender_list = useSelector((state) => state.gender.genderList.Data)

    useEffect(() => {
        const statusClick = (pk) => {
            GENDERSTATUS(pk).then(res => {
                getGenderList()
                const type = res.data.result
                const msg = res.data.Msg 
                if(res.data.result === 'success'){
                    ToastLeft(msg,type)
                    dispatch(fetchGenderData())
                }
                else if(res.data.result === 'Failed'){
                    ToastLeft(msg,type)
                }
            }).catch((error) => {
                ToastLeft(error.message,"Failed");
            })
        }

        const getGenderList = (() => {
            if(gender_list){
                const tableData = gender_list.map((res) => ({
                    GENNAME     : res.GenName,
                    STATUS      : res.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">De Active</Badge> ,
                    ACTION      : (<>
                        {
                          checkPermission('Genders_Edit') ? (
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
        getGenderList()
    },[gender_list,dispatch])
      
    useEffect(() => {
        dispatch(fetchGenderData())
    },[dispatch])

    if(!isAuthenticated()){
        navigate('/')
    }
  return (
    <>
        <PageHeader titles="Gender" active="Gender" items={['Pages']} />
        <ToastContainer />
        <Row>
            <Col xl={12}>
                <Card>
                    <Card.Header>
                        <Card.Title>Gender</Card.Title>
                        <GenderModel isOpen={isModalOpen} onClose={closeModal} />

                        {
                            checkPermission('Genders_Edit') ? <button style={{float:'right'}} className='d-flex ms-auto mx-2 btn btn-outline-success' onClick={openModal}>Add Gender</button> : ''
                        }
                    </Card.Header>
                    <Card.Body>
                    {
                            checkPermission('Genders_List') ? <Datatable data={DATATABLE} col={COLUMNS} /> : <AuthError />
                    }
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>
  )
}
