import React, { useState } from 'react'
import { Card, Form, InputGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Password } from '../../../Data/Authenticatepage/DataAuthentication';
import { useFormik } from 'formik';
import * as yup from 'yup'
import { ToastLeft } from '../../../service/Notification';
import Loader from '../../../service/Loader';
import { ChangePassword } from '../../../service/Api/LoginApi';
import { ToastContainer } from 'react-toastify';

export default function Changepassword(props) {
  const [loading,setLoading] = useState(true)
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordShown(!isPasswordShown);
  };
  const userId = props.userDt.Id
  const on_submit =  useFormik({
    initialValues : {
        current_password  : '',
        password          : '',
        confirm_password  : ''
    },
    validationSchema:yup.object({
      current_password:yup.string()
        .min(8,"Password must Minimum 8 Charactors")
        .required("Enter your current password"),
      password:yup.string()
        .min(8,"Password must Minimum 8 Charactors")
        .required("Enter your new password"),
      confirm_password:yup.string()
        .oneOf([yup.ref("password"),null],"Confrim password and password must be same")
        .required("Enter your confirm password")
    }),
    onSubmit:(userInputData) => {
      setLoading(false)
      ChangePassword(userInputData,userId).then((res) => {
        const type = res.data.result
        const msg = res.data.Msg 
        if(res.data.result === 'success'){
          ToastLeft(msg,type)
          setLoading(true)
        }
        else if(res.data.result === 'Failed'){
          ToastLeft(msg,type)
          setLoading(true)
        }
      }).catch((error) => {
        ToastLeft(error.message,"Failed");
      })
    }
})
  return (
    <>
        <ToastContainer />
        <Card>
          <Card.Header>
            <Card.Title as="h3">Change Password</Card.Title>
          </Card.Header>
          <Card.Body>
            <Password handle={on_submit.handleChange} name="current_password" placeholder="Current password"/>
            {                              
              on_submit.errors.current_password ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.current_password}</p> : null
            }
            
            <Form.Group>
              <InputGroup className="wrap-input100 validate-input" id="Password-toggle">
                  <InputGroup.Text id="basic-addon2" onClick={togglePasswordVisibility} className="bg-white p-0">
                      <Link to='#' className='bg-white text-muted p-3'><i className={`zmdi ${isPasswordShown ? 'zmdi-eye' : 'zmdi-eye-off'} text-muted`} aria-hidden="true" ></i></Link>
                  </InputGroup.Text>
                  <Form.Control className="input100 border-start-0 ms-0" type={(isPasswordShown) ? 'text' : "password"} name="password" onChange={on_submit.handleChange} placeholder='Enter new password' />
              </InputGroup>
            </Form.Group>
            {                              
              on_submit.errors.password ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.password}</p> : null
            }

            <Form.Group>
              <InputGroup className="wrap-input100 validate-input" id="Password-toggle">
                  <InputGroup.Text id="basic-addon2" onClick={togglePasswordVisibility} className="bg-white p-0">
                      <Link to='#' className='bg-white text-muted p-3'><i className={`zmdi ${isPasswordShown ? 'zmdi-eye' : 'zmdi-eye-off'} text-muted`} aria-hidden="true" ></i></Link>
                  </InputGroup.Text>
                  <Form.Control className="input100 border-start-0 ms-0" type={(isPasswordShown) ? 'text' : "password"} name="confirm_password" onChange={on_submit.handleChange} placeholder='Enter confirm password' />
              </InputGroup>
            </Form.Group>

            {                              
              on_submit.errors.confirm_password ? <p style={{fontSize:'14px'}} className='text-danger'>{on_submit.errors.confirm_password}</p> : null
            }

          </Card.Body>
          <Card.Footer className="text-end">
            <div className="submit">
              { loading ? <Link className="btn btn-success d-grid" onClick={on_submit.handleSubmit}>Submit</Link> : <Loader /> }
            </div>      
          </Card.Footer>
        </Card> 
    </>
  )
}
