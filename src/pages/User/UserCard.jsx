import React, { useEffect, useState } from 'react'
import { Badge, Card, Col, Collapse, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { getUserData } from '../../services/storage/Storage';
import { GETUSERLIST, UPDATE_USER_STATUS } from '../../services/api/Users';
import { ToastLeft } from '../../services/notification/Notification';
import PageHeader from '../../layouts/PageHeader/PageHeader';
import { isAuthenticated } from '../../services/Auth';
import { checkPermission } from '../../services/Permission';
import AuthError from '../../components/authentication/errorPage/AuthError/AuthError';


const authToken = getUserData()

export default function UserCard() {
    const [userData,setData] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        axios.interceptors.request.use(
            config => {
                config.headers.authorization = `Bearer ${authToken}`;
                return config;
            },
            error => {
                return Promise.reject(error);
        })
        UserList()
    },[])


    const UserList = (() => {
        GETUSERLIST().then((res) => {
            const data = res.data.Data
            console.log(data);
            setData(data)
        }).catch((error) => {
            ToastLeft(error.message,"Failed");
        })
    })

    const statusClick = (pk) => {
        UPDATE_USER_STATUS(pk).then(res => {
            UserList()
        }).catch((error) => {
            ToastLeft(error.message,"Failed");
        })
    }

    if(!isAuthenticated()){
        navigate('/')
      }
  return (
    <>
        <PageHeader titles="USERS" active="Users" items={['Apps']} />
        <Row className="row-cols-4">
        {
            checkPermission('Users_List') ? (
            <>
                {
                    userData.map((dt) => {
                        return <Col xl={4} sm={6} md={6} key={dt.Id}>
                                <Card className="border p-0">
                                    <Card.Header>
                                        <Card.Title>{dt.UserName}</Card.Title>
                                    </Card.Header>
                                    <Card.Body className="text-center">
                                        {
                                            dt.ProfilePic ? <img className="avatar-xxl brround cover-image" src={require("../../assets/images/users/15.jpg")} alt="user15" /> 
                                            : <img className="avatar-xxl brround cover-image" src={require("../../assets/images/users/avatar.png")} alt="user15" />
                                        }

                                        <h4 className="mb-0 mt-3">{dt.Name.toUpperCase()}</h4>
                                        <Card.Text>{dt.UserName.toLowerCase()}</Card.Text>
                                    </Card.Body>
                                    <Card.Footer className="text-center">
                                        <Row className="user-social-detail">
                                            {
                                                checkPermission('Users_Edit') ? (<>
                                                    <div className="social-profile me-4 rounded text-center">
                                                        <Link to={`/edituser/${dt.ParamStr}`}><i className="fa fa-edit"></i></Link>
                                                    </div>
                                                
                                                    <div className="social-profile me-4 rounded text-center">
                                                    {
                                                        dt.IsActive ? <Link to="#" onClick={() => statusClick(dt.Id)}><i className="fe fe-check-circle text-success"></i></Link> 
                                                        : <Link to="#" onClick={() => statusClick(dt.Id)}><i className="fe fe-x-circle text-danger"></i></Link>
                                                    }
                                                    </div>
                                                </> ) : ""
                                            }
                                            
                                            <div className="social-profile rounded me-4 text-center">
                                            {
                                                dt.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">Dactive</Badge>
                                            }
                                            </div>
                                        </Row>
                                    </Card.Footer>
                                </Card>
                            </Col>
                    })
                }
            </>) : <Card>
                        <Card.Body><AuthError /></Card.Body>
                    </Card>
        }
        
        </Row>
 
    </>
  )
}
