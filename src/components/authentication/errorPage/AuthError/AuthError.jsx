import React from 'react'
import { Alert } from 'react-bootstrap'

export default function AuthError() {
  return (
    <>
        <Alert className="alert alert-warning"  variant={''}>
            <span><i className='fa fa-exclamation me-2'></i> </span> You don't have permission to view this page
        </Alert>

    </>
  )
}
