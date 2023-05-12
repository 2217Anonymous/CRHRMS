import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import { Card, Col, Nav, Row, Tab } from 'react-bootstrap'
import UpdateCompany from '../../components/company/UpdateCompany'
import AddSmtp from '../../components/company/AddSmtp'
import { isAuthenticated } from '../../services/Auth'
import { checkPermission } from '../../services/Permission'
import AuthError from '../../components/authentication/errorPage/AuthError/AuthError'


export default function EditCompany() {
  const navigate = useNavigate()
  const {Param} = useParams()

  if(!isAuthenticated()){
    navigate('/')
  }
  return (
    <>
      <ToastContainer />
      <PageHeader titles="Edit Company" active="company" items={['Home']} />
      <Card>
        <Card.Header>
          <Card.Title as="h3" className="mb-0">Edit Company</Card.Title>
        </Card.Header>
        <Card.Body className="pt-4">
          <Row>
            <Col sm={12}>
            {
              checkPermission('Companies_Edit') ? (
                <>
                <div className="panel panel-success">
                  <Tab.Container id="left-tabs-example" defaultActiveKey="editCompany">
                    <Nav variant="pills" className='panel-tabs nav-tabs panel-success'>
                      <Nav.Item>
                        <Nav.Link eventKey="editCompany"><i className="fe fe-user me-1"></i>Company</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="smtp"><i className="fe fe-settings me-1"></i>SMTP</Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="editCompany">
                        <UpdateCompany id={Param}/>
                      </Tab.Pane>
                      <Tab.Pane eventKey="smtp">
                      <AddSmtp id={Param}/>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div> 
                </>
              ) : <AuthError />
            } 
            </Col>
          </Row> 
        </Card.Body>
      </Card>
    </>
  )
}
