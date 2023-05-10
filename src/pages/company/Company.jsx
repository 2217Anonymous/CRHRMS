import React from 'react'
import CompanyList from '../../components/company/CompanyList'
import { isAuthenticated } from '../../services/Auth'
import { useNavigate } from 'react-router-dom'

export default function Company() {
  const navigate = useNavigate()
  
  if(!isAuthenticated()){
    navigate('/')
  }
  return (
    <>
      <CompanyList />
    </>
  )
}
