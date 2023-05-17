import React, { useEffect } from 'react'
import AddCompany from '../../components/company/AddCompany'
import { isAuthenticated } from '../../services/Auth'
import { useNavigate } from 'react-router-dom'

export default function NewCompany() {
  const navigate = useNavigate()
  if(!isAuthenticated()){
    navigate('/')
  }

  useEffect(() => {
    
  },[])
  return (
    <>
      <AddCompany />
    </>
  )
}
