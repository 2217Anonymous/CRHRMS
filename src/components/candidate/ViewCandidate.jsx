import React, { useEffect, useState } from 'react'
import { Accordion, Badge, Card, Col, Nav, Row, Tab } from 'react-bootstrap'
import { VIEWCANDIDATE } from '../../services/api/Hrms'
import Datatable from '../Helper/Datatable'
import CandidateDocument from './CandidateDocument';

export default function ViewCandidate(props) {
    const Language_Col = [
        {
          Header: "LANGUAGE",
          accessor: "LANGUAGE",
          className: "text-center wd-15p border-bottom-0",
        },
        {
          Header: "WRITE",
          accessor: "WRITE",
          className: "text-center wd-15p border-bottom-0 ",
      
        },
        {
          Header: "READ",
          accessor: "READ",
          className: "text-center wd-15p border-bottom-0 ",
        },
        {
          Header: "SPEAK",
          accessor: "SPEAK",
          className: "text-center wd-15p border-bottom-0 ",
        },
    ];

    const Exp_Col = [
        {
          Header: "COMPANY Name",
          accessor: "CompanyName",
          className: "text-center wd-15p border-bottom-0",
        },
        {
          Header: "DESIGNATION",
          accessor: "Designation",
          className: "text-center wd-15p border-bottom-0 ",
      
        },
        {
          Header: "WORK FROM",
          accessor: "WorkFrom",
          className: "text-center wd-15p border-bottom-0 ",
        },
        {
          Header: "WORK TO",
          accessor: "WorkTo",
          className: "text-center wd-15p border-bottom-0 ",
        },
        {
          Header: "EXPERIANCE",
          accessor: "YearsOfExperiance",
          className: "text-center wd-15p border-bottom-0 ",
        },
        {
          Header: "SALARY",
          accessor: "SalaryPerMonth",
          className: "text-center wd-15p border-bottom-0 ",
        },
    ];

    const Qualification_Col = [
        {
          Header: "COURSE NAME",
          accessor: "COURSENAME",
          className: "text-center wd-15p border-bottom-0 ",
      
        },
        {
          Header: "MEDIUM",
          accessor: "MEDIUM",
          className: "text-center wd-15p border-bottom-0 ",
        },
        {
          Header: "INSTITUTION",
          accessor: "INSTITUTION",
          className: "text-center wd-15p border-bottom-0 ",
        },
        {
          Header: "YEAR OF PASSING",
          accessor: "YEAROFPASSING",
          className: "text-center wd-15p border-bottom-0 ",
        },
        {
          Header: "GRADE OR PERCENTAGE",
          accessor: "GRADEORPERCENTAGE",
          className: "text-center wd-15p border-bottom-0 ",
        },
    ];

    const [data,setData]    = useState([])
    const [Lang,setLang]    = useState([])
    const [Exp,setExp]      = useState([])
    const [Qual,setQual]    = useState([])
    const [Document,setDocument]    = useState([])

    const getEditCanditate = () => {
        VIEWCANDIDATE(props.id).then(res => {
            setData(res.data.Data)
            setDocument(res.data.Documents)
            const Lang_dt = res.data.Languages
            const LangData = Lang_dt.map((res) => ({
                LANGUAGE    : res.Language,
                WRITE       : res.WriteSkill ? <Badge bg="success">True</Badge> : <Badge bg="danger">False</Badge>,   
                READ        : res.ReadSkill  ? <Badge bg="success">True</Badge> : <Badge bg="danger">False</Badge>,
                SPEAK       : res.SpeakSkill ? <Badge bg="success">True</Badge> : <Badge bg="danger">False</Badge>, 
            }))
            setLang(LangData)

            const Exp_dt = res.data.Experience
            const ExpData = Exp_dt.map((res) => ({
                CompanyName         : res.CompanyName,
                Designation         : res.Designation,
                WorkFrom            : res.WorkFrom.slice(0,10),
                WorkTo              : res.WorkTo.slice(0,10),
                YearsOfExperiance   : res.YearsOfExperiance + ' Years',
                SalaryPerMonth      : 'Rs ' + res.SalaryPerMonth,
            }))
            setExp(ExpData)

            const Qual_dt = res.data.Qualifications
            const QualiData = Qual_dt.map((res) => ({
                COURSENAME          : res.Qualification,
                MEDIUM              : res.Medium,
                INSTITUTION         : res.Institution,
                YEAROFPASSING       : res.YearOfPassing,
                GRADEORPERCENTAGE   : res.GradeOrPercentage + ' %',
            }))
            setQual(QualiData)
        })
      }

    useEffect(() => {
        getEditCanditate()
    },[])
  return (
    <>
    <Card>
        <Card.Header>
            <Card.Title as="h3">Candidate Details</Card.Title>
          </Card.Header>
        <Card.Body>
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
                      <Nav.Link eventKey="document"><i className="fe fe-settings me-1"></i>Document</Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content>
                    <Tab.Pane eventKey="editCandidate">
                        <ul className='list-group'>
                            <li className='list-group-item list-group-item-active active'>
                                <div className='d-flex justify-content-start'>
                                    <img className="avatar avatar-xxl brround cover-image" alt='user18' src={require("../../assets/images/users/22.jpg")} />
                                    <div className="drop-heading">
                                        <div className="text-start">
                                            <h3 className="text-dark mb-0 fs-18 fw-semibold text-uppercase"> {data.FirstName + ' ' + data.LastName}</h3>
                                            <small className="text-muted fs-12 text-lowercase">{data.PersonalEmail}</small>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        
                        <Accordion defaultActiveKey="0" className="panel-default">
                            <Accordion.Item eventKey="0">
                               <Accordion.Header>PERSONAL</Accordion.Header>
                               <Accordion.Body>
                                <Row>
                                    <Col sm={5}><h5>Name</h5></Col>
                                    <Col sm={7}><h5>{data.Salut + ' ' + data.FirstName + ' ' +  data.MiddleName + ' ' + data.LastName}</h5></Col>
                                    <Col sm={5}><h5>Gender</h5></Col>
                                    <Col sm={7}><h5>{data.GenName}</h5></Col>
                                    <Col sm={5}><h5>BloodGroup</h5></Col>
                                    <Col sm={7}><h5>{data.BlooGroupName}</h5></Col>
                                    <Col sm={5}><h5>Date of Birth</h5></Col>
                                    <Col sm={7}><h5>{data.DateOfBirth}</h5></Col>
                                    <Col sm={5}><h5>Age</h5></Col>
                                    <Col sm={7}><h5>{data.Age}</h5></Col>
                                    <Col sm={5}><h5>Email</h5></Col>
                                    <Col sm={7}><h5>{data.PersonalEmail}</h5></Col>
                                    <Col sm={5}><h5>Phone</h5></Col>
                                    <Col sm={7}><h5>+91 {data.Mob}</h5></Col>
                                    <Col sm={5}><h5>Phone</h5></Col>
                                    <Col sm={7}><h5>+91 {data.Mob2}</h5></Col>
                                    <Col sm={5}><h5>Prement Address</h5></Col>
                                    <Col sm={7}><address>{data.PermenentAddress}
                                                </address></Col>
                                    <Col sm={5}><h5>Present Address</h5></Col>
                                    <Col sm={7}><address>{data.PresentAddress}
                                                </address></Col>
                                </Row>
                               </Accordion.Body>
                             </Accordion.Item>
                             <Accordion.Item eventKey="1">
                               <Accordion.Header>FAMILY</Accordion.Header>
                               <Accordion.Body>
                                    <Row>
                                        <Col sm={5}><h5>Father Name</h5></Col>
                                        <Col sm={7}><h5>{data.FatherName}</h5></Col>
                                        <Col sm={5}><h5>Father Occupation</h5></Col>
                                        <Col sm={7}><h5>{data.FatherOccupation}</h5></Col>
                                        <Col sm={5}><h5>Mother Name</h5></Col>
                                        <Col sm={7}><h5>{data.MotherName}</h5></Col>
                                        <Col sm={5}><h5>Mother Occupation</h5></Col>
                                        <Col sm={7}><h5>{data.MotherOccupation}</h5></Col>
                                        <Col sm={5}><h5>Marital Status</h5></Col>
                                        <Col sm={7}><h5>{data.MaritalStatusName}</h5></Col>
                                        <Col sm={5}><h5>Husband/Wife Name </h5></Col>
                                        <Col sm={7}><h5>{data.HusbandorWifeName === '' || null || undefined ? 'No' : <>{data.HusbandorWifeName}</>}</h5></Col>
                                        <Col sm={5}><h5>Husband/Wife Occupation </h5></Col>
                                        <Col sm={7}><h5>{data.HusbandorWifeOccupation === '' || null || undefined ? 'No' : <>{data.HusbandorWifeOccupation}</>}</h5></Col>
                                        <Col sm={5}><h5>No Of Childrens</h5></Col>
                                        <Col sm={7}><h5>{data.NoOfChildrens === '' || null || undefined ? 'No' : <>{data.NoOfChildrens}</>}</h5></Col>
                                    </Row>
                               </Accordion.Body>
                             </Accordion.Item>

                             <Accordion.Item eventKey="2">
                                <Accordion.Header>KYC</Accordion.Header>
                                <Accordion.Body>
                                    <Row>
                                        <Col sm={5}><h5>Aadhar Number</h5></Col>
                                        <Col sm={7}><h5>{data.AadharNumber}</h5></Col>
                                        <Col sm={5}><h5>Pan Number</h5></Col>
                                        <Col sm={7}><h5>{data.PanNumber}</h5></Col>
                                        <Col sm={5}><h5>Passport Number</h5></Col>
                                        <Col sm={7}><h5>{data.PassportNumber}</h5></Col>
                                        <Col sm={5}><h5>Vehicle </h5></Col>
                                        <Col sm={7}><h5>{data.IsVehicleHave ? 'Yes' : 'No'}</h5></Col>
                                        <Col sm={5}><h5>License </h5></Col>
                                        <Col sm={7}><h5>{data.IsLicenseHave ? 'Yes' : 'No'}</h5></Col>
                                        <Col sm={5}><h5>Licence Type </h5></Col>
                                        <Col sm={7}><h5>{data.LicenceType}</h5></Col>
                                        <Col sm={5}><h5>Licence Number </h5></Col>
                                        <Col sm={7}><h5>{data.LicenceNumber}</h5></Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>

                             <Accordion.Item eventKey="3">
                                <Accordion.Header>ADDITIONAL</Accordion.Header>
                                <Accordion.Body>
                                    <Row>
                                        <Col sm={5}><h5>Special Skils</h5></Col>
                                        <Col sm={7}><h5>{data.SpecialSkills}</h5></Col>
                                        <Col sm={5}><h5>Expected Salary</h5></Col>
                                        <Col sm={7}><h5>{data.ExpectedSal}</h5></Col>
                                        <Col sm={5}><h5>Ready To Relocate ?</h5></Col>
                                        <Col sm={7}><h5>{data.ReadyToRelocate ? 'Yes' : 'No'}</h5></Col>
                                        <Col sm={5}><h5>Remarks</h5></Col>
                                        <Col sm={7}><h5>{data.Remarks === '' || null || undefined ? 'No Remarks' : <>{data.Remarks}</>} </h5></Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Tab.Pane>
                    <Tab.Pane eventKey="languages">
                        <Datatable data={Lang} col={Language_Col} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="experience">
                        <Datatable data={Exp} col={Exp_Col} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="qualification">
                        <Datatable data={Qual} col={Qualification_Col} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="document">
                        <CandidateDocument data={Document} id={props.id} emp={data.FirstName}/>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>   
            </Col>
        </Card.Body>
    </Card>
    </>
  )
}
