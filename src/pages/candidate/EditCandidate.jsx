import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import { Card, Col, Nav, Row, Tab } from 'react-bootstrap'
import { isAuthenticated } from '../../services/Auth'
import UpdateCandidate from '../../components/candidate/UpdateCandidate'
import AddExperiance from '../../components/candidate/AddExperiance'
import AddLanguage from '../../components/candidate/AddLanguage'
import AddQualification from '../../components/candidate/AddQualification'
import AuthError from '../../components/authentication/errorPage/AuthError/AuthError'
import { checkPermission } from '../../services/Permission'
import CandidateDocument from '../../components/candidate/CandidateDocument'
import AddDocument from '../../components/candidate/AddDocument'


export default function EditCandidate() {
  const navigate = useNavigate()
  const {Param} = useParams()

  if(!isAuthenticated()){
    navigate('/')
  }
  return (
    <>
      <ToastContainer />
      <PageHeader titles="Edit Candidate" active="Candidate" items={['Home']} />
      <Card>
        <Card.Header className="mb-0 d-flex flex-row justify-content-between">
            <Card.Title as="h3" className="mb-0">Edit Candidate</Card.Title>
            {
              checkPermission('Candidates_List') ? (<>
              <div>
                <Link to={'/candidates'} className='btn btn-success'>Candidate List</Link>{ }
              </div>
              </>) : ''
            }
        </Card.Header>
        <Card.Body className="pt-4">
          <Row>
          {
            checkPermission('Candidates_Edit') ? (<>
            <Col sm={12}>
              <div className="panel panel-success">
                <Tab.Container id="left-tabs-example" defaultActiveKey="editCandidate">
                  <Nav variant="pills" className='panel-tabs nav-tabs panel-success'>
                    <Nav.Item>
                      <Nav.Link eventKey="editCandidate"><i className="fe fe-user me-1"></i>Candidate</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="languages"><i className="fe fe-settings me-1"></i>Languages</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="experience"><i className="fe fe-settings me-1"></i>Experience</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="qualification"><i className="fe fe-settings me-1"></i>Qualification</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="document"><i className="fe fe-settings me-1"></i>Documents</Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content>
                    <Tab.Pane eventKey="editCandidate">
                      <UpdateCandidate id={Param}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="languages">
                      <AddLanguage id={Param}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="experience">
                      <AddExperiance id={Param}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="qualification">
                      <AddQualification id={Param}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="document">
                      <AddDocument id={Param}/>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>   
            </Col>
          </>) : <AuthError />
        }
          </Row> 
        </Card.Body>
      </Card>
    </>
  )
}
