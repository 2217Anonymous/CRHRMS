import React, { useEffect, useState } from 'react'
import { Badge, OverlayTrigger, Tooltip, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserData } from '../../services/storage/Storage';
import { checkPermission } from '../../services/Permission';
import { GETUSERLIST, UPDATE_USER_STATUS } from '../../services/api/Users';
import { ToastLeft } from '../../services/notification/Notification';
import { isAuthenticated } from '../../services/Auth';
import PageHeader from '../../layouts/PageHeader/PageHeader';
import Datatable from '../../components/Helper/Datatable';
import AuthError from '../../components/authentication/errorPage/AuthError/AuthError';

const authToken = getUserData()

export const COLUMNS = [
    {
      Header: "ProfilePic",
      accessor: "ProfilePic",
      className: "text-center wd-15p border-bottom-0",
    },
    {
      Header: "Name",
      accessor: "Name",
      className: "text-center wd-15p border-bottom-0",
    },
    {
      Header: "UserName",
      accessor: "UserName",
      className: "text-center wd-15p border-bottom-0 ",
    },
    {
      Header: "Role",
      accessor: "Role",
      className: "text-center wd-15p border-bottom-0 ",
    },
    {
      Header: "Status",
      accessor: "Status",
      className: "text-center wd-15p border-bottom-0 ",
    },
    {
      Header: "Action",
      accessor: "Action",
      className: "text-center wd-15p border-bottom-0 ",
    },
];
  
export default function Users() {

    const navigate = useNavigate()
    const [DATATABLE,setDATATABLE] = useState([])

    useEffect(() => {
        axios.interceptors.request.use(
            config => {
                config.headers.authorization = `Bearer ${authToken}`;
                return config;
            },
            error => {
                return Promise.reject(error);
        })
        checkPermission("Users_List") ?  UserList() : alert("you don't have permission for this operation.","Failed")
    },[])

    const statusClick = (pk) => {
        UPDATE_USER_STATUS(pk).then(res => {
            UserList()
        }).catch((error) => {
            ToastLeft(error.message,"Failed");
        })
    }

    const UserList = (() => {
        GETUSERLIST().then((res) => {
            const data = res.data.Data
            const tableData = data.map((res) => ({
                ProfilePic  : res.ProfilePic ? (<img className="avatar brround cover-image" alt='user12' src={require("../../assets/images/users/avatar.png")} />) : (<img className="avatar  brround cover-image" alt='user12' src={require("../../assets/images/users/avatar.png")} />),
                Name        : res.Name,
                UserName    : res.UserName,
                Role        : res.Role,
                Status      : res.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">De Active</Badge> ,
                Action      : (<>
                                {
                                    checkPermission("Users_Edit") ? (<>
                                        <Link to={`/edituser/${res.ParamStr}`} ><OverlayTrigger placement="top" overlay={<Tooltip >Edit</Tooltip>}><span className="fe fe-edit me-2 text-primary"></span></OverlayTrigger></Link> 
                                        {
                                            res.IsActive ? <Link onClick={() => statusClick(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >De active</Tooltip>}><span className="zmdi zmdi-eye me-2 text-primary"></span></OverlayTrigger></Link>
                                            : <Link onClick={() => statusClick(res.Id)}><OverlayTrigger placement="top" overlay={<Tooltip >Active</Tooltip>}><span className="zmdi zmdi-eye-off me-2 text-danger"></span></OverlayTrigger></Link>
                                        }
                                    </>): ''
                                }
                            </>)
            }))
            setDATATABLE(tableData)
        }).catch((error) => {
            ToastLeft(error.message,"Failed");
        })
    })

    if(!isAuthenticated()){
        navigate('/')
    }

  return (
    <>
        <PageHeader titles="Users" active="Module" items={['Home']} />
        <Card>
            <Card.Header>
                <Card.Title as="h3">Users List</Card.Title>
                    <div style={{float:'right'}} className='d-flex ms-auto mx-2'>
                        {
                            checkPermission('Users_List') ? (<>
                                <div style={{marginRight:'20px'}}>  
                                     <Link to={'/usercard'} className='btn btn-primary'>User Card</Link>
                                </div>
                            </>) : ''
                        }
                        {
                            checkPermission('Users_Add') ? (<>
                                <div>
                                    <Link to={'/newuser'} className='btn btn-success'>Add New User <b>+</b></Link>{ }
                                </div>
                            </>) : ''
                        }
                    </div>   
            </Card.Header>
            <Card.Body className="pb-0">
                {
                    checkPermission('Users_List') ? <Datatable data={DATATABLE} col={COLUMNS} /> : <AuthError />
                }
                <hr></hr>
            </Card.Body>
        </Card>       
    </>
  )
}

