import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Col, Form, InputGroup } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { useFormik } from 'formik';
import * as yup from 'yup'
// import Loader from '../../../service/Loader';
// import { Password } from '../../../Data/Authenticatepage/DataAuthentication';
// import { Reset } from '../../../service/Api/LoginApi';
// import { ToastLeft } from '../../../service/Notification';


export default function Resetpassword() {
    const { code } = useParams()
    console.log(code);
    const Navigate = useNavigate()
    const [loading,setLoading] = useState(true)
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const togglePasswordVisibility = () => {
      setIsPasswordShown(!isPasswordShown);
    };

    //  const on_submit =  useFormik({
    //     initialValues : {
    //         newPassword : '',
    //         confirmPassword : ''
    //     },
    //     validationSchema:yup.object({
    //         newPassword:yup.string()
    //         .min(8,"Password must Minimum 8 Charactors")
    //         .required("Enter your new password"),

    //        confirmPassword:yup.string()
    //         .required("Enter your confirm password")
    //         .oneOf([yup.ref('newPassword'),null],"Confirm password and password must be same")
    //     }),
    //     onSubmit:(userInputData) => {
    //         setLoading(false)
    //         Reset(userInputData,code).then((res) => {
    //           const type = res.data.result
    //           const msg = res.data.Msg 
    //           if(res.data.result === 'success'){
    //             ToastLeft(msg,type)
    //             setLoading(true)
    //           }
    //           else if(res.data.result === 'Failed'){
    //             ToastLeft(msg,type)
    //             setLoading(true)
    //             Navigate('/forgotpassword')
    //           }
    //         }).catch((error) => {
    //             ToastLeft(error.message,"Failed");
    //         })
    //     }
    // })
  return (
    <>
    <div>

        <Col className="col-login mx-auto mt-9">
            <div className="text-center">
                <img src={require("../../../assets/logo/Cr-Full-Dark.png")} style={{width:'250px'}} className="header-brand-img" alt="" />
            </div>
        </Col>
        <ToastContainer />

        <div className="container-login100">
            <div className="wrap-login100 p-6">  
                <div className="login100-form">
                    <span className="login100-form-title pb-5">
                        Reset Password
                    </span>
                    <p className="text-muted">Enter the your new password registered on your account</p>
                    {/* <Password handle={on_submit.handleChange} name="newPassword" placeholder="New password"/> */}
                    {/* {                              
                        on_submit.errors.newPassword ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.newPassword}</p> : null
                    } */}
                    <Form.Group>
                        <InputGroup className="wrap-input100 validate-input" id="Password-toggle">
                            <InputGroup.Text id="basic-addon2" onClick={togglePasswordVisibility} className="bg-white p-0">
                                <Link to='#' className='bg-white text-muted p-3'><i className={`zmdi ${isPasswordShown ? 'zmdi-eye' : 'zmdi-eye-off'} text-muted`} aria-hidden="true" ></i></Link>
                            </InputGroup.Text>
                            <Form.Control className="input100 border-start-0 ms-0" type={(isPasswordShown) ? 'text' : "password"} name="confirmPassword"  placeholder='Enter confirm password' />
                        </InputGroup>
                    </Form.Group>
                    {/* {                              
                        on_submit.errors.confirmPassword ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.confirmPassword}</p> : null
                    } */}
                    <div className="submit">
                        { loading ? <Link className="btn btn-success d-grid">Submit</Link> : "" }
                    </div>
                    <div className="text-center mt-4">
                        <p className="text-dark mb-0 mx-2">Forgot It?<Link className="text-primary ms-1" to={`/`}>Send me Back</Link></p>
                    </div>
                </div>
            </div>
        </div>
    </div> 
    </>
  )
}
