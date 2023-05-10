import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, InputGroup } from 'react-bootstrap';
// import { storeAdminData } from '../../../service/Storage';


const AdminLogin = () => {
    const password = useRef()
    const navigate = useNavigate()
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const togglePasswordVisibility = () => {
      setIsPasswordShown(!isPasswordShown);
    };

    const handleSubmit = () => {
        if(password.current.value === "Falcon_4817") {
            // storeAdminData("Falcon_4817")
            navigate("/sortscript")
        }
    }
  return (
  <div>
    {/* <!-- CONTAINER OPEN --> */}
    <div className="container-login100 mt-9">
      <div className="wrap-login100 p-6">
        <Form className="login100-form validate-form">
          <div className="text-center mb-4">
            <img src={require("../../../assets/logo/Cr-Full-Dark.png")} style={{width:'250px'}} className="header-brand-img" alt="" />
            <h5 className='mt-6'>Please enter your admin password</h5>
          </div>
          <Form.Group>
              <InputGroup className="wrap-input100 validate-input" id="Password-toggle">
                  <InputGroup.Text id="basic-addon2" onClick={togglePasswordVisibility} className="bg-white p-0">
                      <Link to='#' className='bg-white text-muted p-3'><i className={`zmdi ${isPasswordShown ? 'zmdi-eye' : 'zmdi-eye-off'} text-muted`} aria-hidden="true" ></i></Link>
                  </InputGroup.Text>
                  <Form.Control className="input100 border-start-0 ms-0" type={(isPasswordShown) ? 'text' : "password"} name="confirm_password" placeholder='Enter confirm password' ref={password} />
              </InputGroup>
            </Form.Group>

          <div className="container-login100-form-btn pt-0">
            <Link onClick={handleSubmit} className="login100-form-btn btn-primary">
              Unlock
            </Link>
          </div>    
        </Form>
      </div>
    </div>
    {/* <!-- CONTAINER CLOSED --> */}
  </div>
)
};

export default AdminLogin;
