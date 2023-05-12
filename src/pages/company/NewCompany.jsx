import React, { useEffect, useState } from 'react'
import AddCompany from '../../components/company/AddCompany'
import { isAuthenticated } from '../../services/Auth'
import { useNavigate } from 'react-router-dom'
import { getPermission } from '../../services/storage/Storage'

export default function NewCompany() {
  const navigate = useNavigate()
  const [permission,setPermission] = useState([])
  if(!isAuthenticated()){
    navigate('/')
  }

  useEffect(() => {
    
  },[])
  console.log(getPermission());
  return (
    <>
      <AddCompany />
    </>
  )
}
