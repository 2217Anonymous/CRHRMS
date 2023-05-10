import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Col } from 'react-bootstrap';
// import { ToastLeft } from '../../../service/Notification';
import { ToastContainer } from 'react-toastify';
import { useFormik } from 'formik';
import * as yup from 'yup'
// import Loader from '../../../Layouts/Loader/Loader';
// import Loader from '../../../service/Loader';
// import { Forgot } from '../../../service/Api/LoginApi';


const ForgotPassword = () => {

  const Navigate = useNavigate()
  const [customError,setCustomError] = useState(null)
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState({
    success : false,
    failed  : false,
    warning : false
   })

  // const on_submit =  useFormik({
    // onChange={on_submit.handleChange}  
  //   initialValues : {
  //     useremail : '',
  //   },
  //   validationSchema:yup.object({
  //         useremail : yup.string()
  //     .strict()
  //     .trim()
  //     .email()
  //     .required("email is required"),
  //   }),
  //   onSubmit:(userInputData) => {
  //     setLoading(false)
  //     Forgot(userInputData).then((res) => {
  //       setError({
  //         success : false
  //       })
  //       const type = res.data.result
  //       const msg = res.data.Msg 
  //       if(res.data.result === 'success'){
  //         ToastLeft(msg,type)
  //         setLoading(true)
  //       }
  //       else if(res.data.result === 'Failed'){
  //         ToastLeft(msg,type)
  //         setLoading(true)
  //       }
  //     }).catch((error) => {
  //       ToastLeft(error.message,"Failed");
  //     })
  //   }
  // })
  return (
  <div>
    {/* <!-- CONTAINER OPEN --> */} 
    <ToastContainer />
    <Col className="col-login mx-auto mt-9">
      <div className="text-center">
        <img src={require("../../../assets/logo/Cr-Full-Dark.png")} style={{width:'250px'}} className="header-brand-img" alt="" />
      </div>
    </Col>
    {/* <!-- CONTAINER OPEN --> */}
    <div className="container-login100">
      <div className="wrap-login100 p-6"> 
        <div className="login100-form">
          <span className="login100-form-title pb-5">
            Forgot Password
          </span>
          <p className="text-muted">Enter the email address registered on your account</p>
          <div className="wrap-input100 validate-input input-group" data-bs-validate="Valid email is required: ex@abc.xyz">
            <Link to="#" className="input-group-text bg-white text-muted">
              <i className="zmdi zmdi-email" aria-hidden="true"></i>
            </Link>
            <input className="input100 border-start-0 ms-0 form-control" name="useremail" type="email" placeholder="Email" />
          </div>
            {/* {                              
              on_submit.errors.useremail ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.useremail}</p> : null
            } */}

            {/* onClick={on_submit.handleSubmit} */}
          <div className="submit">
            { loading ? <Link className="btn btn-success d-grid" >Submit</Link> : "" }
          </div>
          <div className="text-center mt-4">
            <p className="text-dark mb-0 mx-2">Have Password?<Link className="text-primary ms-1" to={`/`}>Send me Back</Link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
)
};

export default ForgotPassword;
