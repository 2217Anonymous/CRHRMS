import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Card, Col, Form, InputGroup, Nav, Row, Tab } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup'
import { ToastContainer } from 'react-toastify';
import { getUserData } from '../../services/storage/Storage';
import { GET_USER, UPDATE_USER } from '../../services/api/Users';
import { ToastLeft } from '../../services/notification/Notification';
import PageHeader from '../../layouts/PageHeader/PageHeader';
import { checkPermission } from '../../services/Permission';
import Loader from '../../services/loader/Loader';
import Permission from './Permission';
import { isAuthenticated } from '../../services/Auth';

const authToken = getUserData()

export default function EditUser() {

    const {Param} = useParams()

    const profileRef = useRef(null);
    const navigate = useNavigate()

    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const togglePasswordVisibility = () => {
      setIsPasswordShown(!isPasswordShown);
    };

    const [image,setImage] = useState("")
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(true)
    const [updateId,setUpdateId] = useState()

    const handleImageClick = () => {
        profileRef.current.click();
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log(file);
        setImage(file)
    }

    const getUser = () =>{
        GET_USER(Param).then((res) => {
        setData(res.data.Data)
        setUpdateId(res.data.Data.Id)
    }).catch((error) => {
      ToastLeft(error.message,"Failed");
    })
  }

    const on_submit =  useFormik({
      initialValues : {
        name      : '',
        username  : '',
        password  : '',
      },
      validationSchema:yup.object({
        name : yup.string().required("Name is required").min(3,"Minimum 3 Charactors"),
        username : yup.string().required("index number is required").min(3,"Minimum 3 Charactors"),
      }),
      onSubmit:(userInputData) => {
        setLoading(false)
        try {
          UPDATE_USER(userInputData,updateId).then((res) => {
            const type = res.data.result
            const msg = res.data.Msg 
            if(res.data.result === 'success'){
              ToastLeft(msg,type)
              setLoading(true)
              navigate('/userlist',{replace:true})
            }
            else if(res.data.result === 'Failed'){
              ToastLeft(msg,type)
              setLoading(true)
            }
        })
        } catch (error) {
          console.log(error);
        }
      }
    })        

    useEffect(() => {
      axios.interceptors.request.use(
          config => {
              config.headers.authorization = `Bearer ${authToken}`;
              return config;
          },
          error => {
              return Promise.reject(error);
      })
      getUser()
      // getPermissionData()
  },[])

  if(!isAuthenticated()){
    navigate('/')
  }
  return (
    <>
      <ToastContainer />
      <PageHeader titles="Edit user" active="User" items={['Home']} />
      <Card>
        <Card.Header>
          <Card.Title as="h3" className="mb-0">Edit user</Card.Title>
        </Card.Header>
        <Card.Body className="pt-4">
        <Row>
        <Col sm={12}>
          <div className="panel panel-success">
              <Tab.Container id="left-tabs-example" defaultActiveKey="editUser">
                <Nav variant="pills" className='panel-tabs nav-tabs panel-success'>
                  <Nav.Item>
                    <Nav.Link eventKey="editUser"><i className="fe fe-user me-1"></i>User</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="permission"><i className="fe fe-settings me-1"></i>Permission</Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content>
                  <Tab.Pane eventKey="editUser">
                    <Row>
                      <Col xl={4}>
                        <Card>
                          <Card.Body>
                            <div className="text-center chat-image mb-5">
                                <div className="avatar avatar-xxl chat-profile mb-3 brround">
                                  <div onClick={handleImageClick}>
                                      {
                                          image ? (<img className="brround rounded-circle cover-image" style={{maxWidth:'100%'}} alt='user12' src={URL.createObjectURL(image)} />) 
                                          : (<img className="brround rounded-circle cover-image" style={{maxWidth:'100%'}} alt='user12' src={require("../../assets/images/users/avatar.png")} />)
                                      }  
                                      <input type = "file" ref={profileRef} onChange={handleImageChange} style={{display:'none'}}/>
                                  </div>
                                </div>
                                {
                                  checkPermission("Users_Edit") ? (
                                    <div className="submit">
                                      <Link className="btn btn-success btn-sm">Upload</Link>
                                    </div>
                                  ) : (
                                    <div className="submit">
                                      <Link className="btn btn-success btn-sm disabled">Upload</Link>
                                    </div>
                                  )
                                }          
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col xl={8}>
                          <ToastContainer />
                          <div className="form-group">
                              <Form.Label>Name</Form.Label>
                              <input className="form-control" name="name" defaultValue={data.Name} onChange={on_submit.handleChange} required type="text" placeholder="Enter your name" />
                              {                              
                                on_submit.touched.name && on_submit.errors.name ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.name}</p> : null
                              }
                          </div> 
                          <div className="form-group">
                              <Form.Label>User Name</Form.Label>
                              <input onChange={on_submit.handleChange} className="form-control" defaultValue={data.UserName} name="username" required type="text" placeholder="Enter username" />
                              {                              
                                on_submit.touched.username && on_submit.errors.username ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.username}</p> : null
                              }
                          </div> 
                          <div className="text-end">
                            
                                <div className="submit">
                                    { loading ? (<><Link to={'/userlist'} className="btn btn-danger me-2">Cancel</Link>
                                                    <button onClick={on_submit.handleSubmit} type='submit' className="btn btn-success me-2">Save</button>
                                                </>) : (<Loader />)
                                    }
                                </div>  
                                {/* ) : (
                                  <button type='submit' className="btn btn-success disabled me-2">Save</button>
                                )
                            }     */}
                          </div>
                      </Col>
                    </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey="permission">
                    <Permission uid={Param} />
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
          </div>   
        </Col>
      </Row> 
        </Card.Body>
      </Card>

    </>
  )
}
