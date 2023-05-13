import React from 'react'
import { Link } from 'react-router-dom'
import { checkPermission } from '../../services/Permission'
import { APPLICATION } from '../../services/api/Hrms'

export default function CandidateDocument(props) {
    const prop = props.data
    const empId = props.id

    const application = (() => {
        APPLICATION(empId).then(res => {

        }).catch(err => {
            console.log(err);
        })
    })

  return (
    <>
        <div className="media mb-5 mt-0">
            <div className="d-flex me-3">
                <img className="media-object rounded-square thumb-sm" alt="64x64" src={require(`../../assets/images/users/pdf.png`)} />
            </div>
            <div className="media-body">
                <h5 to="#" className="text-dark" style={{marginTop:'10px'}}>Application</h5>
            </div>
            {
                checkPermission('Candidates_Document Download') ?( 
                    <>
                        {
                            <Link to={''} onClick={application} className="btn btn-icon btn-success" ><i className='fe fe-download'></i></Link>
                        }
                    </>
                ): ''
            }
        </div>
        {
            prop && prop.map(dt => (
                <>
                <div className="media mb-5 mt-0">
                    <div className="d-flex me-3">
                        <img className="media-object rounded-square thumb-sm" alt="64x64" src={require(`../../assets/images/users/${dt.Filetype && dt.Filetype.slice(1)}.png`)} />
                    </div>
                    <div className="media-body">
                        <h5 to="#" className="text-dark" style={{marginTop:'10px'}}>{dt.Name}</h5>
                    </div>
                    {
                        checkPermission('Candidates_Document Download') ?( 
                            <>
                                {
                                    dt.Updated && dt.Updated ? <Link to={dt.Url} target='_blank' className="btn btn-icon btn-success" ><i className='fe fe-download'></i></Link> : ''
                                }
                            </>
                        ): ''
                    }
                </div>
                </>
            ))
        }
        
    </>
  )
}
