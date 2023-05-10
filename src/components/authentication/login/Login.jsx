import React, { useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import {  Button, Col, NavLink } from 'react-bootstrap';
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { Password } from '../../../Data/Authenticatepage/DataAuthentication'; 
import { ToastContainer } from 'react-toastify';
import { useFormik } from 'formik';
import * as yup from 'yup'
import { ToastLeft } from '../../../services/notification/Notification';
import { Authenticate } from '../../../services/api/LoginApi';
import { storeCompanyId, storePermission, storeUserData, storeUserId, storeUserMenu } from '../../../services/storage/Storage';
import Loader from '../../../services/loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminStatus } from '../../../Redux/slice/GetAdminSlice';
import { addUserToServer } from '../../../Redux/slice/UserSlice';
import { isAuthenticated } from '../../../services/Auth';
import secureLocalStorage from 'react-secure-storage';

export default function Login() {
  //STATE MANAGEMENT
  const [userData,setUserData] = useState([])
  const [animation5,setanimation5] = useState(false);
  const [loading,setLoading] = useState(true)
  
  //HOOK MANAGEMENT
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {adminStatus} = useSelector(state => state.adminStatus)

  //MODEL
  const show = () => {
    setanimation5(true);
  };

  const hide = () => {
    setanimation5(false)
  };
   
  //SUPERADMIN 
  const superadminValues = {
    name              : '',
    username          : '',
    password          : '',
    confirm_password  : '',
  }

  const superAdminValidation = yup.object({
    name : yup.string().required("Name is required"),
    username : yup.string().strict().trim().email().required("Email is required"),
    password:yup.string().min(8,"Password must Minimum 8 Charactors").required("Enter your new password"),
    confirm_password:yup.string().oneOf([yup.ref("password"),null],"Confrim password and password must be same").required("Enter your confirm password")
  })

  const superAdminSubmit = (adminInputData) => {
    setLoading(true)
    dispatch(addUserToServer(adminInputData)) 
  }

  const on_Register = useFormik({
    initialValues   : superadminValues,
    validationSchema: superAdminValidation,
    onSubmit        :superAdminSubmit
  })

  //LOGIN CHECK
  const initialValues = {
    username : '',
    password : ''
  }

  const validationSchema = yup.object({
    username : yup.string().strict().trim().email().required("email is required"),
    password : yup.string().required("password is required").strict().trim().min(8,"Minimum 8 Charactors").max(16,"Maximum 16 Charactors")
  })

  const onSubmit = (userInputData) => {
    setLoading(true)
    if(adminStatus.Msg === "Admin not registered")
    {
      show()
    }
    else
    {
      Authenticate(userInputData).then((res) => {
        if(res.data.result === 'success')
        {
          storeUserData(res.data.AccessToken)
          storeUserId(res.data.Data.Id)
          storeUserMenu(res.data.ModulePermission)
          storePermission(res.data.OperationPermission)
          storeCompanyId(res.data.Data.CompId)
          if(isAuthenticated())
          {
            setUserData(res)
            setLoading(false)
            return navigate(`/newcompany`)
          }
        }
        else{
          if(res.data.result === 'Failed')
          {
            ToastLeft(res.data.Msg,res.data.result)
          }
        }
      }).catch((error) => {
        ToastLeft(error.message,"Failed");
      })
    }
  }

  const on_submit =  useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  }) 

  useEffect(() => {
    dispatch(getAdminStatus())
  },[])

  if(isAuthenticated()){
    navigate('/newcompany')
  }

  return (
    <>
    
      <Rodal visible={animation5} onClose={hide} animation='rotate' height={550}>
        <div>It seems the super admin is not registered. Please enter the following details to register as super admin.</div>
        <hr />
        <div eventkey="Email" title="Email" className='p-0 pt-2'>    
          <div className="wrap-input100 validate-input input-group" data-bs-validate="Valid email is required: ex@abc.xyz">
            <Link to="#" className="input-group-text bg-white text-muted">
              <i className="fa fa-user text-muted" aria-hidden="true"></i>
            </Link>
            <input className="input100 border-start-0 form-control ms-0" name="name" type="text" onChange={on_Register.handleChange} placeholder="Enter your name" />
          </div>   
          {
              on_Register.errors.name ? <p style={{fontSize:'14px'}} className='text-danger'>{on_Register.errors.name}</p> : null
          }             
          <div className="wrap-input100 validate-input input-group" data-bs-validate="Valid email is required: ex@abc.xyz">
            <Link to="#" className="input-group-text bg-white text-muted">
              <i className="zmdi zmdi-email text-muted" aria-hidden="true"></i>
            </Link>
            <input className="input100 border-start-0 form-control ms-0" name="username" type="email" onChange={on_Register.handleChange} placeholder="Enter your username" />
          </div>
          {
              on_Register.errors.username ? <p style={{fontSize:'14px'}} className='text-danger'>{on_Register.errors.username}</p> : null
          }
          <Password handle={on_Register.handleChange} name="password" placeholder="password"/>
          {
            on_Register.errors.password ? <p style={{fontSize:'14px'}} className='text-danger'>{on_Register.errors.password}</p> : null
          }
          <Password handle={on_Register.handleChange} name="confirm_password" placeholder="confirm password"/>
          {
            on_Register.errors.confirm_password ? <p style={{fontSize:'14px'}} className='text-danger'>{on_Register.errors.confirm_password}</p> : null
          }
        </div>
        <hr />
        {
          loading ? (<><Button className="me-2" onClick={on_Register.handleSubmit} variant="primary"> Save Changes</Button>
                    <Button variant="default" onClick={hide}>Close</Button></>)
          : <Loader/>
        }
      </Rodal>

      <ToastContainer/>

      <div>
        {/* <!-- CONTAINER OPEN --> */}
        <Col className="col-login mx-auto mt-9">
          <div className="text-center">
            <img src={require("../../../assets/logo/Cr-Full-Dark.png")} style={{width:'250px'}} className="header-brand-img" alt="" />
          </div>
        </Col>
        <div className="container-login100 mt-5">
          <div className="wrap-login100 p-6">
            <form className="login100-form validate-form">
            <span className="login100-form-title pb-5">
            Sign up 
            </span>
              <div className="panel panel-primary">
                <div className="tab-menu-heading border-0">
                  <div className="tabs-menu1">
                      <div eventkey="Email" title="Email" className='p-0 pt-5'>    
                          <div className="wrap-input100 validate-input input-group" data-bs-validate="Valid email is required: ex@abc.xyz">
                            <Link to="#" className="input-group-text bg-white text-muted">
                              <i className="zmdi zmdi-email text-muted" aria-hidden="true"></i>
                            </Link>
                            <input className="input100 border-start-0 form-control ms-0" name="username" type="email" onChange={on_submit.handleChange} placeholder="Email" />
                          </div> 
                          {
                            on_submit.errors.username ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.username}</p> : null
                          }
                           <Password handle={on_submit.handleChange} name="password" placeholder="Password"/> 
                          {                              
                            on_submit.errors.password ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.password}</p> : null
                          } 
                          <div className="form-group">
                            <div className="form-check">
                              <input className="form-check-input" name='remenberme' type="checkbox" id="remenber" />
                              <label className="form-check-label" htmlFor="remenber">
                                Remenber Me
                              </label>
                            </div>
                          </div>
                          <div className="container-login100-form-btn">
                          {
                            loading ? <NavLink onClick={on_submit.handleSubmit} className="login100-form-btn btn-success">Login</NavLink>
                            : <Loader />
                          } 
                          </div>
                          <div className="text-center pt-3">
                            <p className="text-dark mb-0 fs-13 mx-3">Forgot Password?<Link to={`forgotpassword`} className="text-primary ms-1">Click Here</Link></p>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* // <!-- CONTAINER CLOSED --> */}
      </div>
    </>
  )
}
