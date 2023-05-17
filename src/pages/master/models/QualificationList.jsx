import React, { useEffect, useState } from 'react'
import { Badge, Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { QUALIFICATIONSTATUS } from '../../../services/api/Master'
import { ToastLeft } from '../../../services/notification/Notification'
import Datatable from '../../../components/Helper/Datatable'
import { isAuthenticated } from '../../../services/Auth'
import { useDispatch, useSelector } from 'react-redux'
import { fetchQualificationData } from '../../../Redux/slice/Master/Qualification'
import { checkPermission } from '../../../services/Permission'
import AuthError from '../../../components/authentication/errorPage/AuthError/AuthError'

export const COLUMNS = [
    {
      Header: "QUALIFICATION",
      accessor: "QUALIFICATION",
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

export default function QualificationList() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [show, setShow] = useState(false);
    const [DATATABLE,setDATATABLE] = useState([])
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const qualificationList = useSelector((state) => state.qualification.qualificationList.Data)
    
    useEffect(() => {
        dispatch(fetchQualificationData())
    },[dispatch])

    useEffect(() => {
        const statusClick = (pk) => {
            QUALIFICATIONSTATUS(pk).then(res => {
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

        const getQualification = (() => {
            if (qualificationList) {
                const tableData = qualificationList.map((res) => ({
                    QUALIFICATION : res.Qualification,
                    DESCRIPTION : res.Description,
                    STATUS      : res.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">De Active</Badge> ,
                    ACTION      : (<>
                    {
                        checkPermission('Qualifications_Edit') ? (
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
        getQualification()
    },[qualificationList])

    if(!isAuthenticated()){
        navigate('/')
    }
  return (
    <Card>
        <Card.Header>
            <Card.Title>Qualification</Card.Title>
            {
                checkPermission('Qualifications_Add') ? <button style={{float:'right'}} className='d-flex ms-auto mx-2 btn btn-success' onClick={handleShow}>Add Qualification</button> : ''
            }
        </Card.Header>
        <Card.Body>
            {
                checkPermission('Qualifications_List') ?<Datatable data={DATATABLE} col={COLUMNS} />:<AuthError/>
            }
        </Card.Body>
    </Card>
  )
}
