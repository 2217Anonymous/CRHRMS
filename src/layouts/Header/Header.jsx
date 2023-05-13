import React, {useState } from 'react';
import styles from './Header.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { FormControl, Nav, Dropdown, Navbar, InputGroup, Form } from 'react-bootstrap';
import MENUITEMS  from '../Sidebar/Sidemenu';
// import { auth } from '../../Firebase/firebase';
import { connect, useDispatch, useSelector } from "react-redux";  
import { useEffect } from 'react';
import { Logout } from '../../services/api/LoginApi';
import { getComId, getUserData, removeUserData, storeCompanyId } from '../../services/storage/Storage';
import { fetchCompanyData } from '../../Redux/slice/CompanySlice';
import axios from 'axios';


//leftsidemenu
const SideMenuIcon = () => {
  document.querySelector(".app").classList.toggle("sidenav-toggled");
}

// Darkmode
const DarkMode = () => {
  if(document.querySelector(".app").classList.contains('dark-mode')){
    document.querySelector(".app").classList.remove('dark-mode');
    let DarkMenu1 = document.querySelector("#myonoffswitch1")
    DarkMenu1.checked = true;
  }
  else{
    document.querySelector(".app").classList.add('dark-mode');
    let DarkMenu1 = document.querySelector("#myonoffswitch2")
    DarkMenu1.checked = true;
  }
}

// FullScreen
var elem = document.documentElement;
var i = true
const Fullscreen = (vale) => {
  switch (vale) {
    case true:
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
      i = false
      break;
    case false:
      document.exitFullscreen()
      i = true
      break;
    default:
      break;
  }
}

// SwitcherMenu

const SidSwitcherIcon = () => {

  //leftsidemenu
  document.querySelector(".demo_changer").classList.toggle("active");
  let Rightside = document.querySelector(".demo_changer")
  Rightside.style.right = "0px";

}

const RightSideBar = () => {
  //rightsidebar
  document.querySelector(".sidebar-right").classList.toggle("sidebar-open");
  //swichermainright
}

const Header = ({ local_varaiable,AddToCart }) => {
  document.querySelector('.main-content')?.addEventListener('click', () => {
    document.querySelector(".search-result")?.classList.add("d-none")
  })

  // For CountrySelector Modal
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [InputValue, setInputValue] = useState("");
  const [searchval, setsearchval] = useState("Type something");
  const [searchcolor, setsearchcolor] = useState("text-dark");
  const [NavData, setNavData] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [logout,setLogout] = useState(false)

  // const Navigate = useNavigate()

  let navigate = useNavigate();
  let path = `/`;

  const routeChange = () => {
    navigate(path);
  }

  useEffect(() => {
    if(!localStorage.getItem('idToken')){
       navigate(path)
    }
  },[logout])

  const logOutHandler = (() => {
      Logout()
      removeUserData()
      setLogout(true)
  }) 
  
  let myfunction = (inputvalue) => {
    // document.querySelector(".search-result").classList.remove("d-none")
    // console.log('ok');

    let i = []
    let allElement2 = [];

    MENUITEMS.map(mainlevel => {
      if (mainlevel.Items) {
        mainlevel.Items.map(sublevel => {
          // console.log("sublevel --- ", sublevel)
          if (sublevel.children) {
            sublevel.children.map(sublevel1 => {
              // console.log("sublevel1 --- ", sublevel1)
              i.push(sublevel1)
              if (sublevel1.children) {
                sublevel1.children.map(sublevel2 => {
                  // console.log("sublevel2 --- ", sublevel2)
                  i.push(sublevel2)
                  return sublevel2;
                })
              }
              return sublevel1;
            })
          }
          return sublevel;
        })
      }
      return mainlevel;

    }
    )
    for (let allElement of i) {
      if (allElement.title.toLowerCase().includes(inputvalue.toLowerCase())) {
        if (allElement.title.toLowerCase().startsWith(inputvalue.toLowerCase())) {
          setShow2(true)
          allElement2.push(allElement)
        }
      }
    }
    if (!allElement2.length || inputvalue === "") {
      if (inputvalue === "") {
        setShow2(false);
        setsearchval("Type something")
        setsearchcolor('text-dark')
      }
      if (!allElement2.length) {
        setShow2(false);
        setsearchcolor('text-danger')
        setsearchval("There is no component with this name")
      }
    }
    setNavData(allElement2)
  }
  const refresh = () => window.location.reload(true)

  const getCompanyId = (e) => {
    setSelectedComId(e.target.value)
    setComId(e.target.value);
    storeCompanyId(e.target.value)
    refresh()
  }



  const [comId,setComId] = useState()
  const [selectedComId,setSelectedComId] = useState()

  const dispatch = useDispatch()
  const {companyList} = useSelector((state) => state.company);


  useEffect(() => {
    const authToken = getUserData()
    axios.interceptors.request.use(
      config => {
          config.headers.authorization = `Bearer ${authToken}`
          return config;
      },
      error => {
          return Promise.reject(error);
    })

    setComId(getComId())
    setSelectedComId(getComId())
    dispatch(fetchCompanyData())
  },[dispatch])

  return (
    <div className={styles.Header}>
      <div className='header sticky app-header header1'>
        <div className="container-fluid main-container">
          <div className="d-flex">
            <Link aria-label="Hide Sidebar" className="app-sidebar__toggle" data-bs-toggle="sidebar" to="#" onClick={() => SideMenuIcon()} />
            <Link className="logo-horizontal" to={`/Dashboard`}>
              <img src={require("../../assets/logo/Cr-whte.png")} style={{width:'150px'}} className="header-brand-img desktop-logo" alt="logo" />
              <img src={require("../../assets/logo/Cr-Full-Dark.png")} style={{width:'150px'}} className="header-brand-img light-logo1" alt="logo" />
            </Link>
            <div className="ms-3 d-none d-lg-block">
              <Form.Group>
                <select className='form-control' value={comId} required={true} onChange={getCompanyId} name="deptName" >
                    {
                      companyList.Data && companyList.Data.filter((dt) => dt.IsActive).map(res => 
                      (
                        <option key={res.Id} value={res.Id}>{res.CompName}</option> 
                      ))  
                    }
                </select>
              </Form.Group>
            </div>
            <Navbar className="d-flex order-lg-2 ms-auto header-right-icons">
              <Dropdown className="dropdown d-none" >
                <Link to="#" className="nav-link icon " >
                  <i className="fe fe-search"></i>
                </Link>
                <Dropdown.Menu className="header-search dropdown-menu-start ">
                  <InputGroup className="input-group w-100 p-2">
                    <FormControl type="text" placeholder="Search...." />
                    <InputGroup.Text className="btn btn-primary">
                      <i className="fe fe-search" aria-hidden="true"></i>
                    </InputGroup.Text>
                  </InputGroup>
                </Dropdown.Menu>
              </Dropdown>
              <Navbar.Toggle className="d-lg-none ms-auto header2 navbar-toggler navresponsive-toggler" >
                <span className="navbar-toggler-icon fe fe-more-vertical"></span>
              </Navbar.Toggle>

              <div className="responsive-navbar navbar p-0">
                <Navbar.Collapse className="" id="navbarSupportedContent-4">
                  <div className="d-flex order-lg-2">
                    <Dropdown className="d-lg-none d-flex" >
                      <Dropdown.Toggle href="#" className="nav-link icon no-caret" >
                        <i className="fe fe-search"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="header-search dropdown-menu-start">
                        <InputGroup className="w-100 p-2">
                          <FormControl type="text" placeholder="Search...." />
                          <InputGroup.Text>
                            <i className="fa fa-search" aria-hidden="true" ></i>
                          </InputGroup.Text>
                        </InputGroup>
                      </Dropdown.Menu>
                    </Dropdown>

                    {/* Dark Mode */}

                    <div className="dropdown  d-flex">
                      <Nav.Link className="nav-link icon theme-layout nav-link-bg layout-setting"  onClick={() => DarkMode()}>
                        <span className="dark-layout"><i className="fe fe-moon"></i></span>
                        <span className="light-layout"><i className="fe fe-sun"></i></span>
                      </Nav.Link>
                    </div>

                    {/* FullScreen button */}

                    <div className="dropdown d-flex">
                      <Nav.Link className="nav-link icon full-screen-link nav-link-bg" onClick={() => Fullscreen(i)}>
                        <i className="fe fe-minimize fullscreen-button"></i>
                      </Nav.Link>
                    </div>

                    {/* Notification */}

                    <Dropdown className="d-flex notifications">
                      <Dropdown.Toggle variant='' className="nav-link icon no-caret"><i className="fe fe-bell"></i><span className=" pulse"></span></Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu-end dropdown-menu-arrow">
                        <div className="drop-heading border-bottom">
                          <div className="d-flex">
                            <h6 className="mt-1 mb-0 fs-16 fw-semibold text-dark">Notifications
                            </h6>
                          </div>
                        </div>
                        <div className="notifications-menu">
                          <Dropdown.Item className="d-flex" href={`/Pages/notificationlist`}>
                            <div
                              className="me-3 notifyimg  bg-primary brround box-shadow-primary">
                              <i className="fe fe-mail"></i>
                            </div>
                            <div className="mt-1">
                              <h5 className="notification-label mb-1">New Application received
                              </h5>
                              <span className="notification-subtext">3 days ago</span>
                            </div>
                          </Dropdown.Item>
                          <Dropdown.Item className="d-flex" href={`/Pages/notificationlist`}>
                            <div
                              className="me-3 notifyimg  bg-secondary brround box-shadow-secondary">
                              <i className="fe fe-check-circle"></i>
                            </div>
                            <div className="mt-1">
                              <h5 className="notification-label mb-1">Project has been
                                approved</h5>
                              <span className="notification-subtext">2 hours ago</span>
                            </div>
                          </Dropdown.Item>
                          <Dropdown.Item className="d-flex" href={`/Pages/notificationlist`}>
                            <div
                              className="me-3 notifyimg  bg-success brround box-shadow-success">
                              <i className="fe fe-shopping-cart"></i>
                            </div>
                            <div className="mt-1">
                              <h5 className="notification-label mb-1">Your Product Delivered
                              </h5>
                              <span className="notification-subtext">30 min ago</span>
                            </div>
                          </Dropdown.Item>
                          <Dropdown.Item className="d-flex" href={`/Pages/notificationlist`}>
                            <div className="me-3 notifyimg bg-pink brround box-shadow-pink">
                              <i className="fe fe-user-plus"></i>
                            </div>
                            <div className="mt-1">
                              <h5 className="notification-label mb-1">Friend Requests</h5>
                              <span className="notification-subtext">1 day ago</span>
                            </div>
                          </Dropdown.Item>
                        </div>
                        <div className="dropdown-divider m-0"></div>
                        <Dropdown.Item href={`/Pages/notificationlist`}
                          className="dropdown-item text-center p-3 text-muted">View all
                          Notification</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>

                    {/* Profile  */}

                    <Dropdown className="d-flex profile-img-1">
                      <Dropdown.Toggle variant='' className="nav-link leading-none d-flex no-caret">
                        <img className="avatar avatar-lg brround cover-image" alt='user18' src={require("../../assets/images/users/22.jpg")} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu-end dropdown-menu-arrow">
                        <div className="drop-heading">
                          <div className="text-center">
                            <h5 className="text-dark mb-0 fs-14 fw-semibold">Percy Kewshun</h5>
                            <small className="text-muted">Senior Admin</small>
                          </div>
                        </div>
                        <div className="dropdown-divider m-0"></div>
                        <Dropdown.Item className="dropdown-item" href={`/user-profile`}>
                          <i className="dropdown-icon fe fe-user"></i> Profile
                        </Dropdown.Item>
                        <Dropdown.Item className="dropdown-item" onClick={logOutHandler} href={`/`}>
                          <i className="dropdown-icon fe fe-lock"></i> Logout
                        </Dropdown.Item>
                        {/* <Dropdown.Item className="dropdown-item" onClick={() => { auth.signOut(); routeChange() }}>
                          <i className="dropdown-icon fe fe-alert-circle"></i> Sign out
                        </Dropdown.Item> */}
                      </Dropdown.Menu>
                    </Dropdown>

                  </div>
                </Navbar.Collapse>
              </div>

              {/* Switcher  */}

              <div className="demo-icon nav-link icon" onClick={() => SidSwitcherIcon()}>
                <i className="fe fe-settings fa-spin  text_primary"></i>
              </div>

            </Navbar>
          </div>
        </div>
      </div>
    </div>
  )

};
const mapStateToProps = (state) => ({
  local_varaiable: state,
});
export default connect(mapStateToProps)(Header);
