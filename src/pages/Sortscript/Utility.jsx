import React, { useEffect } from 'react'
import { Card, Col, Nav, Row, Tab } from 'react-bootstrap'
import Modulelist from '../utility/Modulelist'
import SubModule from '../utility/SubModule'
import Operationlist from '../utility/Operationlist'
import InsertModuleOperation from '../utility/InsertModuleOperation'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import { isSortAdmin } from '../../services/Auth'


export default function Utility() {
    const navigate = useNavigate()

    useEffect(() => {
    },[])
    
    // if(!isSortAdmin()){
    //     navigate("/sortscript-admin")
    // }

  return (
    <>
    <PageHeader titles="Utility" active="Utility" items={['Home']} />
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
