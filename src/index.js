import React, { Fragment, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes,Route } from 'react-router-dom';
import "./index.scss";
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import store from './Redux/store/Store';
import Loader from './layouts/Loader/Loader';

const Sortscript      = lazy(() => import('./pages/Sortscript/Utility'));
const AdminLogin      = lazy(() => import('./components/authentication/admin/AdminLogin'));
const Login           = lazy(() => import('./components/authentication/login/Login'));
const ForgotPassword  = lazy(() => import('./components/authentication/forgotPassword/ForgotPassword'));
const ResetPassword   = lazy(() => import('./components/authentication/resetPassword/Resetpassword'));
const LockScreen      = lazy(() => import('./components/authentication/lockScreen/LockScreen'));
const Error400        = lazy(() => import('./components/authentication/errorPage/Error400/Error400'));

const App             = lazy(() => import('./components/app'));

// const Dashboard       = lazy(() => import('./pages/Dashboard/Dashboard'));
// const Userprofile     = lazy(() => import('./pages/profile/Userprofile'));

// //USERS
const UserList        = lazy(() => import('./pages/User/Users'))
const NewUser         = lazy(() => import('./pages/User/Newuser'))
const UserCard        = lazy(() => import('./pages/User/UserCard'))
const EditUser        = lazy(() => import('./pages/User/EditUser'))
const Permission      = lazy(() => import('./pages/User/Permission'));
const Test            = lazy(() => import('./pages/User/Perm'));

//COMPANY
const Company        = lazy(() => import('./pages/company/Company'));
const NewCompany     = lazy(() => import('./pages/company/NewCompany'));
const EditCompany    = lazy(() => import('./pages/company/EditCompany'));
const SmtpList       = lazy(() => import('./components/company/SmtpList'));

//HRMS
const Candidate       = lazy(() => import('./components/candidate/CandidateList'));
const NewCandidate    = lazy(() => import('./components/candidate/NewCandidate'));
const UpdateCandidate = lazy(() => import('./pages/candidate/EditCandidate'));
const JoiningEntry    = lazy(() => import('./pages/candidate/JoinEntry'));

//MASTER
const Gender          = lazy(() => import('./pages/master/Gender'));
const BloodGroup      = lazy(() => import('./pages/master/BloodGroup'));
const Branches        = lazy(() => import('./pages/master/Branches'));
const Department      = lazy(() => import('./pages/master/Department'));
const Designation     = lazy(() => import('./pages/master/Designation'));
const Marital         = lazy(() => import('./pages/master/Marital'));
const Qualification   = lazy(() => import('./pages/master/Qualification'));
const WorkType        = lazy(() => import('./pages/master/WorkType'));
const Document        = lazy(() => import('./pages/master/Document'));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Fragment>
      <BrowserRouter>
      <ToastContainer />
          <React.Suspense fallback=<Loader />>
            <Provider store={store}>
              <Routes>
                <Route index element={<Login />} />

                <Route path={`/`} element={<App />}>
                  <Route>
                    <Route path={`/sortscript`} element={<Sortscript />}></Route>
                  </Route>

                  <Route>
                    <Route path={'/companies'} element={<Company />}></Route>
                    <Route path={'/newcompany'} element={<NewCompany />}></Route>
                    <Route path={'/editcompany/:Param'} element={<EditCompany />}></Route>
                    <Route path={'/smtp'} element={<SmtpList />}></Route>
                  </Route>

                  <Route>
                    <Route path={`/userlist`} element={<UserList />}></Route>
                    <Route path={`/usercard`} element={<UserCard />}></Route>
                    <Route path={`/newuser`} element={<NewUser />}></Route>
                    <Route path="/edituser/:Param" element={<EditUser />}></Route>
                    <Route path="/permission" element={<Permission />}></Route>
                  </Route>

                  <Route>
                    <Route path={'/candidates'} element={<Candidate />}></Route>
                    <Route path={'/newcandidate'} element={<NewCandidate />}></Route>
                    <Route path={'/JoiningEntry/:Param'} element={<JoiningEntry />}></Route>
                    <Route path={'/updatecandidate/:Param'} element={<UpdateCandidate />}></Route>
                  </Route>

                  <Route>
                    <Route path={`/genders`} element={<Gender />}></Route>
                    <Route path={`/bloodgroups`} element={<BloodGroup />}></Route>
                    <Route path={`/departments`} element={<Department />}></Route>
                    <Route path={`/designations`} element={<Designation />}></Route>
                    <Route path={`/branches`} element={<Branches />}></Route>
                    <Route path={`/maritalstatus`} element={<Marital />}></Route>
                    <Route path={`/qualifications`} element={<Qualification />}></Route> 
                    <Route path={`/worktypes`} element={<WorkType />}></Route>
                    <Route path={`/document`} element={<Document />}></Route>
                  </Route>

                </Route> 
              
                {/* Authentication Pages */}
                <Route>
                  <Route path={`/sortscript-admin`} element={<AdminLogin />} />
                  <Route path={`/forgotpassword`} element={<ForgotPassword />} />
                  <Route path="/resetpassword/:code" element={<ResetPassword />}/>
                  <Route path={`/lockscreen`} element={<LockScreen />} />
                  <Route path="/test" element={<Test />}></Route>

                </Route>

                <Route>
                  <Route path="*" element={<Error400 />} />
                </Route>
                
              </Routes>
            </Provider>
          </React.Suspense>
      </BrowserRouter>
    </Fragment>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
