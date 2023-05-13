import React, { useEffect, useState } from 'react'
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Link } from 'react-router-dom'
import { getHistoryList } from '../../services/api/Utility'
import { getHistory } from '../../services/storage/Storage'


export default function CandidateHistory(props) {
    const historyId = getHistory()
    const colors = [
        'bg-primary',
        'bg-danger',
        'bg-warning',
        'bg-info',
        'bg-success',
        'bg-secondary',
    ]

    const [historyData,setHistoryData] = useState([])
    const historyList = (() => {
        getHistoryList(historyId,'TblEmployee').then(res => {
            console.log(res.data.Data);
            setHistoryData(res.data.Data)
        }).catch(err => {

        })
    })

    useEffect(() => {
        historyList()
    },[])
  return (
    <>
        <Card>
            <Card.Header>
                <Card.Title>History</Card.Title>
            </Card.Header>
            <Card.Body className="scroll">
            {/* <!-- content --> */}
            <PerfectScrollbar className='h-300 position-inherit'>  
                <div className="">
                    <ul className="task-list">
                    {
                        historyData.map(dt => (
                            <>
                            <li className="d-sm-flex">
                                <div>
                                    <i className={`task-icon ${colors[Math.floor(Math.random() * colors.length)]}`}></i>
                                    <h6 className="fw-semibold">{dt.Type}<span
                                    className="text-muted fs-11 ms-2 fw-normal"><i className='fe fe-calendar'></i> {dt.ActivityDateTime.slice(0,10) + " " + dt.ActivityDateTime.slice(11,19)}</span>
                                    </h6>
                                    <p className="text-muted fs-12"><i className='fe fe-user'></i> {dt.CreatedByName + ' (' + dt.UserName + ')'}<span to="#"
                                    className="fw-semibold"> {}</span></p>
                                </div>
                            </li>
                            </>
                        ))
                    }    
                    </ul>
                </div>
            </PerfectScrollbar>
            </Card.Body>
        
      </Card> 
    </>
  )
}

