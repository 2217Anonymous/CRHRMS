import React from 'react'
import { Col, Row } from 'react-bootstrap'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import JoiningEntryForm from '../../components/candidate/JoiningEntryForm'
import ViewCandidate from '../../components/candidate/ViewCandidate'
import { useParams } from 'react-router-dom'
import CandidateHistory from '../../components/candidate/CandidateHistory'

export default function JoinEntry() {
    const {Param} = useParams()
    console.log(Param);
  return (
    <>
    <PageHeader titles="Join Entry" active="Candidate" items={['JoinEntry']} />
    <Row id="user-profile">
      <Col lg={12}> 
        <Row>
          <Col xl={4}>
            <JoiningEntryForm id={Param} />
          </Col>
          <Col xl={8}>
            <ViewCandidate id={Param} />
            <CandidateHistory id={Param} />
          </Col>
        </Row>
      </Col>
    </Row>
    </>
  )
}
