import React, { useEffect } from 'react';
import styles from '../../layouts/PageHeader/PageHeader.module.scss';
import { Card, Col, Nav, Row, Tab } from 'react-bootstrap'
import Modulelist from '../utility/Modulelist'
import SubModule from '../utility/SubModule'
import Operationlist from '../utility/Operationlist'
import InsertModuleOperation from '../utility/InsertModuleOperation'
import { useNavigate } from 'react-router-dom'
import { isSortAdmin } from '../../services/Auth'
import secureLocalStorage from 'react-secure-storage';


export default function Utility() {
    const navigate = useNavigate()

    const logOut = (() => {
      secureLocalStorage.removeItem("adminPass")
      navigate("/sortscript-admin")
    })

    if(!isSortAdmin()){
      navigate("/sortscript-admin")
    }

    useEffect(() => {

    },[])

  return (
    <>
    <div className={styles.PageHeader}>
      {/* <!-- PAGE-HEADER --> */}
      <div className="page-header">
        <h1 className="page-title">Utility</h1>
        <div>
          <button className='btn btn-danger btn-sm' onClick={logOut}>Logout</button>
        </div>
      </div>
      {/* <!-- PAGE-HEADER END --> */}
    </div>
    <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3" className="mb-0">Utility</Card.Title>
            </Card.Header>
            <Card.Body className="pt-4">
              <div className="">
                <div className="panel panel-primary">
                  <div className="tabs-menu-body pt-0">
                    <div className="tab-content p-0">
                      <div className="tab-pane active">
                        <div className="table-responsive">
                          <Tab.Container id="left-tabs-example table-bordered" defaultActiveKey="AllProducts">
                            <Nav variant="pills" className='product-sale'>
                              <Nav.Item>
                                <Nav.Link eventKey="AllProducts" className="text-dark">Module List</Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link eventKey="subModule" className="text-dark">Submodule</Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link eventKey="operationList" className="text-dark">Operation List</Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link eventKey="moduleOperations" className="text-dark">Module Operations</Nav.Link>
                              </Nav.Item>
                            </Nav>
                            <Tab.Content>
                              <Tab.Pane eventKey="AllProducts">
                                <Modulelist />
                              </Tab.Pane>
                              <Tab.Pane eventKey="subModule">
                                <SubModule />
                              </Tab.Pane>
                              <Tab.Pane eventKey="operationList">
                                <Operationlist />
                              </Tab.Pane>
                              <Tab.Pane eventKey="moduleOperations">
                                <InsertModuleOperation />
                              </Tab.Pane>
                            </Tab.Content>
                          </Tab.Container>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
    </Row> 
    </>
  )
}
