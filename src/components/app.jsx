import React, { Fragment, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import * as  SwitcherData from "../Data/Pages/SwitcherData/SwitcherData";
import BacktoTop from '../layouts/Backtotop/Backtotop';
import Footer from '../layouts/Footer/Footer';
import Header from '../layouts/Header/Header';
import Rightside from '../layouts/Rightside/Rightside';
import { Sidebar }  from '../layouts/Sidebar/Sidebar';
import Switcher from '../layouts/Switcher/Switcher';
import { getUserData } from '../services/storage/Storage';
import axios from 'axios';
import { isAuthenticated } from '../services/Auth';

const App = () => {

  document.querySelector("body").classList.add( 'app', 'sidebar-mini', 'ltr','light-mode');
  document.querySelector("body").classList.remove('login-img', 'landing-page', 'horizontal');
  useEffect(() => {
    const authToken = getUserData()
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
    Navigate('/')
  }
  return(

  <Fragment>
    {/* <ErrorBoundary fallback={ErrorFallbackComponent}> */}
        <div className='horizontalMenucontainer' >
          <Switcher />
          <div className="page">
            <div className="page-main">
              <Header />
              <div className="sticky" style={{ paddingTop: "-74px" }}>
                <Sidebar />
              </div>
              <div className="jumps-prevent" style={{ paddingTop: "74px" }}></div>
              <div className="main-content app-content mt-0" onClick={() => SwitcherData.responsiveSidebarclose()}>
                <div className="side-app">
                  <div className="main-container container-fluid">
                    <Outlet />
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
          <Rightside />
          <BacktoTop />
        </div>
    {/* </ErrorBoundary> */}
  </Fragment>
)
};

export default App;
