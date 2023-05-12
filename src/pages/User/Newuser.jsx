import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useFormik } from 'formik';
import * as yup from 'yup'
import axios from 'axios';
import { getComId, getUserData } from '../../services/storage/Storage';
import { NEW_USER } from '../../services/api/Users';
import { ToastLeft } from '../../services/notification/Notification';
import PageHeader from '../../layouts/PageHeader/PageHeader';
import Loader from '../../services/loader/Loader';
import { isAuthenticated } from '../../services/Auth';
import Select from 'react-select';
import { checkPermission } from '../../services/Permission';
import AuthError from '../../components/authentication/errorPage/AuthError/AuthError';

export default function NewUser() {
  const authToken = getUserData()
  const profileRef = useRef(null);
  const navigate = useNavigate()

  //PASSWORD VISSIBLE
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const togglePasswordVisibility = () => {
      setIsPasswordShown(!isPasswordShown);
  };

  //PROFILE
  const [image,setImage] = useState("")
  const [loading,setLoading] = useState(false)
  const handleImageClick = () => {
    profileRef.current.click();
  }
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file)
  }

  //Role
  const Role  = [
        { value: "Super admin", label: "Super admin" },
        { value: "Admin", label: "Admin" },
        { value: "Manager", label: "Manager" },
        { value: "Employee", label: "Employee" },
  ];
  const [selectedRole,setSelectedRole] = useState()

  const initialValues = {
    name      : '',
    username  : '',
    password  : '',
  }

  const validationSchema = yup.object({
    name : yup.string()
    .required("Name is required")
    .min(3,"Minimum 3 Charactors"),

    username : yup.string()
    .required("index number is required")
    .min(3,"Minimum 3 Charactors"),

    password : yup.string()
    .required("Password is required")
    .min(8,"Minimum 8 Charactors"),
  })

  const onSubmit = userInputData => {
    console.log(selectedRole.value);
    console.log(getComId());
    NEW_USER(userInputData,getComId(),selectedRole.value).then((res) => {
      console.log(res);
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
  }).catch((error) => {
    ToastLeft(error.message,"Failed");
  }).finally(() => {
    setLoading(false)
  })
  }

  const on_submit =  useFormik({
    initialValues,
    validationSchema,
    onSubmit,
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
  },[])

  if(!isAuthenticated()){
    navigate('/')
  }

  return (
    <>
        <PageHeader titles="Users" active="Module" items={['Home']} />
        <Row>
        {
          !checkPermission('Users_Add') ? (<>
            <Col xl={4}>
              <Card>
                <Card.Header>
                  <Card.Title>User Register</Card.Title>
                </Card.Header>
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
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={8}>
                <ToastContainer />
                <Card>
                    <Card.Header>
                        <Card.Title as="h3">New User Register</Card.Title>
                    </Card.Header>
                    <Card.Body>
                         <div className="form-group">
                            <Form.Label>Name</Form.Label>
                            <input onChange={on_submit.handleChange} className="form-control" name="name" required type="text" placeholder="Enter your name" />
                            {                              
                              on_submit.touched.name && on_submit.errors.name ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.name}</p> : null
                            }
                        </div> 

                        <div className="form-group">
                            <Form.Label>User Name</Form.Label>
                            <input onChange={on_submit.handleChange} className="form-control" name="username" required type="text" placeholder="Enter username" />
                            {                              
                              on_submit.touched.username && on_submit.errors.username ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.username}</p> : null
                            }
                        </div> 

                       <Form.Group>
                            <InputGroup className="wrap-input100 validate-input" id="Password-toggle">
                                <InputGroup.Text id="basic-addon2" onClick={togglePasswordVisibility} className="bg-white p-0">
                                    <Link to='#' className='bg-white text-muted p-3'><i className={`zmdi ${isPasswordShown ? 'zmdi-eye' : 'zmdi-eye-off'} text-muted`} aria-hidden="true" ></i></Link>
                                </InputGroup.Text>
                                <Form.Control onChange={on_submit.handleChange} className="input100 border-start-0 ms-0" type={(isPasswordShown) ? 'text' : "password"} name="password" placeholder='Enter new password' />
                            </InputGroup>
                        </Form.Group>
                        {                              
                          on_submit.touched.password && on_submit.errors.password ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.password}</p> : null
                        } 

                        <Form.Group>
                          <Form.Label htmlFor='Gender'>Role <span className='text-danger'>*</span></Form.Label>
                          <Select options={Role} id="Gender" required value={selectedRole} onChange={setSelectedRole} placeholder='choose one' name='Gender' classNamePrefix='Select'/>
                          {/* {                              
                            errors.Gender.required ? <p style={{fontSize:'14px'}} className='text-danger'>Field is required</p> : null
                          } */}
                        </Form.Group>

                    </Card.Body>
                    <Card.Footer className="text-end">
                        <div className="submit">
                            { !loading ? <Link className="btn btn-success d-grid" onClick={on_submit.handleSubmit}>Submit</Link> : <Loader /> }
                        </div>      
                    </Card.Footer>
                </Card>
            </Col>
          </>) : <>
          <Card>
            <Card.Body><AuthError /></Card.Body>
          </Card>
          </>
        }
        </Row>
    </>
  )
}
