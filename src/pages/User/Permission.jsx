import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, ToastContainer } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getUserData } from '../../services/storage/Storage';
import { Getpermission, Insertpermission } from '../../services/api/LoginApi';
import { ToastLeft } from '../../services/notification/Notification';
import { checkPermission } from '../../services/Permission';
import Loader from '../../services/loader/Loader';
import { isAuthenticated } from '../../services/Auth';


const authToken = getUserData()

export default function Permission(props) {
    const [checkboxList, setCheckboxList] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [loading,setLoading] = useState(true)

    const getPermissionData = (() => {
        Getpermission(props.uid).then((res) => {
            if(res.data.result === 'Failed'){
                const type = res.data.result
                const msg = res.data.Msg 
                ToastLeft(msg,type)
            }else{
                setCheckboxList(res.data.Data)
                const updatedCheckboxList = [...checkboxList];
                setSelectAll(updatedCheckboxList.every(item => item.Ispermission));
            }
        })
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
      
      if(checkPermission('Users_Edit') === true){
        getPermissionData()
      }
      else{
      }
    }, []);

    const handleParentCheckboxChange = (event, parentId) => {
      const updatedCheckboxList = [...checkboxList];
      const parentIndex = updatedCheckboxList.findIndex(item => item.ModuleID === parentId);
      updatedCheckboxList[parentIndex].Ispermission = event.target.checked;
      updatedCheckboxList[parentIndex].submodule.forEach(child => {
        child.Ispermission = event.target.checked;
        updatedCheckboxList[parentIndex].submodule.find(item => item.SubModuleId === child.SubModuleId).ObjModuleOP.forEach(child => {
            child.Ispermission = event.target.checked;
        });
      });
      setCheckboxList(updatedCheckboxList);
      setSelectAll(updatedCheckboxList.every(item => item.Ispermission));
    };

    const handleChildrenCheckboxChange = (event, parentId,childrenId) => {
      const updatedCheckboxList = [...checkboxList];
      const parentIndex = updatedCheckboxList.findIndex(item => item.ModuleID === parentId);
      const childrenIndex = updatedCheckboxList[parentIndex].submodule.findIndex(item => item.SubModuleId === childrenId);
      updatedCheckboxList[parentIndex].submodule[childrenIndex].Ispermission = event.target.checked;
      updatedCheckboxList[parentIndex].Ispermission = updatedCheckboxList[parentIndex].submodule.every(child => child.Ispermission);
      updatedCheckboxList[parentIndex].submodule.find(item => item.SubModuleId === childrenId).ObjModuleOP.forEach(child => {
        child.Ispermission = event.target.checked;
      });
      setCheckboxList(updatedCheckboxList);
      setSelectAll(updatedCheckboxList.every(item => item.Ispermission));
    };

    const handleChildCheckboxChange = (event, parentId,childrenId, childId) => {
        const updatedCheckboxList = [...checkboxList];
        const parentIndex = updatedCheckboxList.findIndex(item => item.ModuleID === parentId);
        const childrenIndex = updatedCheckboxList[parentIndex].submodule.findIndex(item => item.SubModuleId === childrenId);
        const childIndex = updatedCheckboxList[parentIndex].submodule.find(item => item.SubModuleId === childrenId).ObjModuleOP.findIndex(item => item.Id === childId);
        updatedCheckboxList[parentIndex].submodule.find(item => item.SubModuleId === childrenId).ObjModuleOP[childIndex].Ispermission = event.target.checked;
        updatedCheckboxList[parentIndex].submodule.find(item => item.SubModuleId === childrenId).Ispermission = event.target.checked;
        updatedCheckboxList[parentIndex].Ispermission = event.target.checked;
        setCheckboxList(updatedCheckboxList);
        setSelectAll(updatedCheckboxList.every(item => item.Ispermission));     
    };

    const handleSelectAllChange = (event) => {
      const updatedCheckboxList = [...checkboxList];
      updatedCheckboxList.forEach(item => {
        item.Ispermission = event.target.checked;
        item.submodule.forEach(child => {
          child.Ispermission = event.target.checked;
          child.ObjModuleOP.forEach(child => {
            child.Ispermission = event.target.checked;
          });
        });
      });
      setCheckboxList(updatedCheckboxList);
      setSelectAll(event.target.checked);
    };
    const ids=[];
    const buttonclick=()=>{
        const updatedCheckboxList = [...checkboxList];
        updatedCheckboxList.forEach(item=>{
            item.submodule.forEach(i=>{
                i.ObjModuleOP.forEach(d=>{
                    if(d.Ispermission===true||d.Ispermission===1){
                        ids.push(d.Id);                        
                    }
                });
            });
        });

        Insertpermission(props.uid,ids).then((res) => {
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
        })
    };

    return (
    <>
        <ToastContainer />
        <Card>
            <Card.Header>
                <Card.Title>
                    <label className="custom-control custom-checkbox-md">
                        <input type="checkbox" className="custom-control-input" checked={selectAll} onChange={handleSelectAllChange}  />
                        <span className="custom-control-label">Select All</span>                         
                    </label>
                </Card.Title>
                {
                    loading ? <button style={{float:'right'}} className='d-flex ms-auto mx-2 btn btn-success' onClick={buttonclick}>Update</button> : <Loader />
                }
            </Card.Header>
            <Card.Body>
            {checkboxList.map(parent => (
                <div key={parent.ModuleID}>
                    <div className="form-group">
                        <div className="form-check">
                            <input className="form-check-input" checked={parent.Ispermission} onChange={(event) => handleParentCheckboxChange(event, parent.ModuleID)} type="checkbox" />
                            <label className="form-check-label">{parent.ModuleName}</label>
                        </div>
                    </div>
                    <div style={{ marginLeft: '20px' }}>
                        {parent.submodule.map(children => (
                        <div key={children.SubModuleId}>
                            <div className="form-group">
                                <div className="form-check">
                                    <input className="form-check-input" checked={children.Ispermission} onChange={(event) => handleChildrenCheckboxChange(event, parent.ModuleID, children.SubModuleId)} type="checkbox" />
                                    <label className="form-check-label">{children.SubModuleName}</label>
                                </div>
                            </div>
                            <div style={{ marginLeft: '20px' }}>
                                {children.ObjModuleOP.map(child => (
                                <div key={child.Id}>
                                    <div className="form-group">
                                        <div className="form-check">
                                            <input className="form-check-input" checked={child.Ispermission} value={child.Id} onChange={(event) => handleChildCheckboxChange(event, parent.ModuleID,children.SubModuleId,child.Id)} type="checkbox" />
                                            <label className="form-check-label">{child.Name}</label>
                                        </div>
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div>

                        ))}
                    </div>
                </div>
            ))} 
                {/* <Row>
                    {
                        checkboxList.map(parent => (
                            <Col md={3} xl={4}>
                            {Basicshow ? 
                            <Card>
                                <Card.Header>
                                    <Card.Title>
                                    <label className="custom-control custom-checkbox-md">
                                        <input type="checkbox" className="custom-control-input" checked={parent.Ispermission} onChange={(event) => handleParentCheckboxChange(event, parent.ModuleID)}  />
                                        <span className="custom-control-label">{parent.ModuleName}</span>
                                    </label>
                                    </Card.Title>
                                    <div className="card-options">
                                        <Link to="#" onClick={BasicHandleExpandClick}> <i className={`fe ${BasicExpanded ? 'fe-chevron-up' : 'fe-chevron-down'}`}></i></Link>
                                    </div>
                                </Card.Header>
                                <Collapse in={BasicExpanded} timeout={3000}>
                                    <div>
                                        <Card.Body>
                                            <ListGroup>
                                            {
                                                parent.ObjModuleOP.map(child => (
                                                    <div key={child.Id}>
                                                        <ListGroupItem variant={child.Ispermission ? 'success' : 'danger'} >
                                                            <div className="form-check">
                                                                <input type="checkbox" class="form-check-input" checked={child.Ispermission} onChange={(event) => handleChildCheckboxChange(event, parent.ModuleID, child.Id)}/>
                                                                <label class="form-check-label" for="exampleCheck1">{child.Name}</label>
                                                            </div>
                                                        </ListGroupItem>
                                                    </div>
                                                ))
                                            }
                                            </ListGroup>
                                        </Card.Body>
                                    </div>
                                </Collapse>
                            </Card> : null}
                    </Col>
                        ))
                    }
                </Row> */}
            </Card.Body>
        </Card>
        
    </>
  );
}
