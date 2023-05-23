import React, { useEffect, useState } from 'react'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import { Badge, Card, Col,OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import {  Link, useNavigate } from 'react-router-dom'
import { DOCUMENTSTATUS } from '../../services/api/Master'
import { ToastLeft } from '../../services/notification/Notification'
import { ToastContainer } from 'react-toastify'
import Datatable from '../../components/Helper/Datatable'
import { isAuthenticated } from '../../services/Auth'
import { checkPermission } from '../../services/Permission'
import AuthError from '../../components/authentication/errorPage/AuthError/AuthError'
import DocumentModel from './models/DocumentModel'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDocumentData } from '../../Redux/slice/Master/Document'

export const COLUMNS = [
    {
      Header: "DOCUMENT NAME",
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

export default function Document() {
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

    const document_list = useSelector((state) => state.document.documentList.Data)

    useEffect(() => {
        const statusClick = (pk) => {
            DOCUMENTSTATUS(pk).then(res => {
                getDocumentList()
                const type = res.data.result
                const msg = res.data.Msg 
                if(res.data.result === 'success'){
                    ToastLeft(msg,type)
                    dispatch(fetchDocumentData())
                }
                else if(res.data.result === 'Failed'){
                    ToastLeft(msg,type)
                }
            }).catch((error) => {
                ToastLeft(error.message,"Failed");
            })
        }

        const getDocumentList = (() => {
            if(document_list){
                const tableData = document_list.map((res) => ({
                    NAME          : res.Name,
                    DESCRIPTION   : res.Description,
                    STATUS        : res.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">De Active</Badge> ,
                    ACTION        : (<>
                      {
                        checkPermission('Employee Documents_Add') ? (
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
        getDocumentList()
    },[document_list,dispatch])

    useEffect(() => {
        dispatch(fetchDocumentData())
    },[dispatch])

    if(!isAuthenticated()){
        navigate('/')
    }
  return (
    <>
        <PageHeader titles="Documents" active="Documents" items={['Master']} />
        <ToastContainer />
        <Row>
            <Col xl={12}>
                <Card>
                    <Card.Header>
                        <Card.Title>Document</Card.Title>
                        <DocumentModel isOpen={isModalOpen} onClose={closeModal} />
                         {
                            checkPermission('Employee Documents_Add') ?<button style={{float:'right'}} className='d-flex ms-auto mx-2 btn btn-outline-success' onClick={openModal}>Add Document</button> : "" 
                        } 
                    </Card.Header>
                    <Card.Body>
                        {
                            checkPermission('Employee Documents_List') ?<Datatable data={DATATABLE} col={COLUMNS} />:<AuthError />
                         }
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>
  )
}
