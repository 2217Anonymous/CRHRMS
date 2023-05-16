import React, { useEffect, useState } from 'react'
import { checkPermission } from '../../services/Permission'
import { Link } from 'react-router-dom'
import { GETDOCUMENT, UPLOADDOCUMENT } from '../../services/api/Hrms'
import { Button, Collapse, Form, Modal } from 'react-bootstrap'
import Loader from '../../services/loader/Loader'
import { ToastLeft } from '../../services/notification/Notification'
import { ToastContainer } from 'react-toastify'


export default function AddDocument(props) {
    const [loading,setLoading]      = useState(false)
    const [data,setData]            = useState([])
    const [show, setShow]           = useState(false);
    const [masterId, setMasterId]   = useState('');
    const [doc_type_Name,setDoc_Type_Name]    = useState('')

    const handleClose = () => setShow(false);
    const handleShow = ((masterId,name) => {
        setMasterId(masterId)
        setDoc_Type_Name(name)
        setShow(true)
    }) 

    const getDocument = (() => {
        GETDOCUMENT(props.id).then(res => {
            console.log(res.data.Data);
            setData(res.data.Data)
        })
    })

    const [file,setFile] = useState('')
    const fileHandle = (e) => {
        setFile(e.target.files[0])
    }

    const handleSubmit = (() => {
        console.log(masterId,props.id,file,doc_type_Name);
        const data = {
            EmpParamStr         : props.id, 
            Master_Id           : masterId, 
            FileURI             : file,
            Document_Type_Name  : doc_type_Name,
        }

        UPLOADDOCUMENT(data).then((res) => {
            console.log(res);
            const type = res.data.result
            const msg = res.data.Msg 
            if(res.data.result === 'success'){
                handleClose()
                getDocument()
                ToastLeft(msg,type)
                setLoading(false)
            }
            else if(res.data.result === 'Failed'){
                ToastLeft(msg,type)
                setLoading(true)
            }
        })
    })

    useEffect(() => {
        getDocument()
    },[])

  return (
    <>
        <ToastContainer />
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>New File Upload</Modal.Title>
                <span className="d-flex ms-auto" onClick={handleClose}><i className='fe fe-x ms-auto' ></i></span>
            </Modal.Header>
            <Modal.Body>
                <div className='row'>
                    <div className='col-md-8'>
                        <Form.Group>
                            <Form.Control type="file" onChange={fileHandle} name="FileURI" />
                        </Form.Group>
                    </div>
                    <div className='col-md-4'>
                         <div className="submit text-end">
                            <button className='btn btn-md btn-success' onClick={handleSubmit} type="submit">
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>

        {
            data && data.map(dt => (
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
                                    dt.Updated && dt.Updated ? <Link to={dt.Url} target='_blank' className="btn btn-icon btn-success" ><i className='fe fe-download'></i></Link>  : '' 
                                }
                            </>
                        ): ''
                    }
                    <Button onClick={()=>handleShow(dt.MasterId,dt.Name)} variant='danger' className="btn btn-icon btn-danger"><i className='fe fe-upload'></i></Button>
                </div>
                </>
            ))
        }
    </>
  )
}
