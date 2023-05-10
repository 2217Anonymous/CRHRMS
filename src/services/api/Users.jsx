import axios from "axios"
import { ADD_USER_URL, GET_USER_BY_URL, UPDATE_USER_STATUS_URL, USER_LIST_URL } from "./ApiUrl"

const origin = window.location.origin

export const GETUSERLIST = async () => {
    return await axios.post(USER_LIST_URL)
}

export const NEW_USER = async (data,id,role) => {
    const dt = {compId:id,name:data.name,userName:data.username,password:data.password,role:role,createdBy:0,ipAddress:'127.0.0.1',geoLocation:'tiruppur',changepassword:false,loginUrl:origin}
    return await axios.post(ADD_USER_URL,dt)
}

export const GET_USER = async (Id) => {
    const data = {id:Id,ipAddress:'127.0.0.1',geoLocation:'tiruppur'}
    return await axios.post(GET_USER_BY_URL,data)
}

export const UPDATE_USER = async (data,Id) => {
    const dt = {id:parseInt(Id),name:data.name,userName:data.username,password:data.password,createdBy:0,ipAddress:'127.0.0.1',geoLocation:'tiruppur',changepassword:false,loginUrl:origin}
    return await axios.post(ADD_USER_URL,dt)
}

export const UPDATE_USER_STATUS = async (Id) => {
    const dt = {id:parseInt(Id),ipAddress:'127.0.0.1',geoLocation:'tiruppur'}
    return await axios.post(UPDATE_USER_STATUS_URL,dt)
}

