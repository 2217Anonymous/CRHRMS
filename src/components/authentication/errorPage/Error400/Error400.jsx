import React from 'react';
import { Link } from 'react-router-dom';

// const SwitcherIcons = () => {

//     //leftsidemenu
//     document.querySelector(".demo_changer").classList.add("active");
//     document.querySelector(".demo_changer").style.right = "0px";
    
// }

// const RemoveSwitcherIcon= () => {
//     //leftsidemenu
//     document.querySelector(".demo_changer").classList.remove("active");
//     document.querySelector(".demo_changer").style.right = "-270px";
// }
const Error400 = () => {
    return (
    <div style={{backgroundColor:'#e34047'}}>
        {/* <!-- PAGE --> */}
        <>
            <div className="page">
                {/* <!-- PAGE-CONTENT OPEN --> */}
                <div className="page-content error-page error2 text-white">
                    <div className="container text-center">
                        <div className="error-template">
                            <h1 className="display-1 mb-2">404</h1>
                            <div className="m-5">
                                <span className="fs-20">
                                    OOPS! Page not found
                                </span>
                                <p>Sorry, an error has occured, Requested page not found!</p>
                            </div>
                            <div className="text-center">
                                <Link className="btn btn-secondary mt-5 mb-5" to={`/`}> <i className="fa fa-long-arrow-left"></i> Back to Home </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- PAGE-CONTENT OPEN CLOSED --> */}
            </div>
            {/* <!-- End PAGE --> */}
            {/* <div className="dropdown float-end custom-layout">
                <div className="demo-icon nav-link icon mt-4">
                    <i className="fe fe-settings fa-spin text_primary" ></i>
                </div>
            </div> */}
        </>
    </div>
)
};

export default Error400;
