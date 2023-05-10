import React from 'react'
import { Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function Loader() {
  return (
    <>
        <Link className="login100-form-btn btn-success">
            <Spinner className='me-1' as="span" animation="border" size="sm" role="status" aria-hidden="true" />Loading...
        </Link>
    </>
  )
}
