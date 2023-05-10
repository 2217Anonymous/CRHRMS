import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getUserData } from '../../services/storage/Storage';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchCompanyData } from '../../Redux/slice/CompanySlice';

export default function Perm() {
  const dispatch = useDispatch()
  const {companyList} = useSelector((state) => state.company);
 
  useEffect(() => {
    const authToken = getUserData()
    axios.interceptors.request.use(
      config => {
          config.headers.authorization = `Bearer ${authToken}`
          return config;
      },
      error => {
          return Promise.reject(error);
    })

    dispatch(fetchCompanyData())
  },[dispatch])

  return (
    <div>
      {
        companyList.Data && companyList.Data.map((d) => {
          return (<>
            <p key={d.Id}>{d.CompName} - {d.ShortName}</p>
          </>)
        })  
      }
    </div>
  )
}
