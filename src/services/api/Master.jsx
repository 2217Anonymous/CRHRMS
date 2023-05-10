import axios from "axios"
import { GET_BLOOD_URL, GET_BRANCHES_URL, GET_DEPARTMENT_URL, GET_DESIGNATION_URL, GET_DOCUMENT_URL, GET_GENDER_URL, GET_MARITAL_URL, GET_QUALIFICATION_URL, GET_WORKTYPE_URL, INSERT_BLOOD_URL, INSERT_BRANCH_URL, INSERT_DEPARTMENT_URL, INSERT_DESIGNATION_URL, INSERT_DOC_URL, INSERT_GENDER_URL, INSERT_MARITAL_URL, INSERT_QUALIFICATION_URL, INSERT_WORK_URL, STATUS_BLOOD_URL, STATUS_BRANCH_URL, STATUS_DEPARTMENT_URL, STATUS_DESIGNATION_URL, STATUS_DOCUMENT_URL, STATUS_GENDER_URL, STATUS_MARITAL_URL, STATUS_QUALIFICATION_URL, STATUS_WORK_URL } from "./ApiUrl"

const browser = {
    ipAddress:'127.0.0.1',
    geoLocation:'tiruppur',
}

export const GETGENDER = async () => {
    return await axios.post(GET_GENDER_URL)
}
export const GETBLOOD = async () => {
    return await axios.post(GET_BLOOD_URL)
}
export const GETBRANCHES = async () => {
    return await axios.post(GET_BRANCHES_URL)
}
export const GETDEPARTMENTS = async () => {
    return await axios.post(GET_DEPARTMENT_URL)
}
export const GETDESIGNATION = async () => {
    return await axios.post(GET_DESIGNATION_URL)
}
export const GETMARITAL = async () => {
    return await axios.post(GET_MARITAL_URL)
}
export const GETWORKTYPE = async () => {
    return await axios.post(GET_WORKTYPE_URL)
}
export const GETQUALIFICATION = async () => {
    return await axios.post(GET_QUALIFICATION_URL)
}
export const GETDOCUMENT = async () => {
    return await axios.post(GET_DOCUMENT_URL)
}

//INSERT
export const INSERTGENDER = async (dt) => {
    const data = {genName:dt.gander,...browser}
    return await axios.post(INSERT_GENDER_URL,data)
}
export const INSERTBLOOD = async (dt) => {
    const data = {name:dt.name,...browser}
    return await axios.post(INSERT_BLOOD_URL,data)
}
export const INSERTBRANCHES = async (dt) => {
    const data = {name:dt.name,description:dt.description,...browser}
    return await axios.post(INSERT_BRANCH_URL,data)
}
export const INSERTDEPARTMENTS = async (dt) => {
    const data = {deptName:dt.deptName,description:dt.description,...browser}
    return await axios.post(INSERT_DEPARTMENT_URL,data)
}
export const INSERTDESIGNATION = async (dt) => {
    const data = {deptId:parseInt(dt.deptName),designName:dt.designName,description:dt.description,...browser}
    return await axios.post(INSERT_DESIGNATION_URL,data)
}
export const INSERTMARITAL = async (dt) => {
    const data = {name:dt.name,...browser}
    return await axios.post(INSERT_MARITAL_URL,data)
}
export const INSERTWORKTYPE = async (dt) => {
    const data = {name:dt.name,description:dt.description,...browser}
    return await axios.post(INSERT_WORK_URL,data)
}
export const INSERTQUALIFICATION = async (dt) => {
    const data = {qualification:dt.qualification,description:dt.description,...browser}
    return await axios.post(INSERT_QUALIFICATION_URL,data)
}
export const INSERTDOCUMENT = async (dt) => {
    const data = {name:dt.name,description:dt.description,...browser}
    console.log(data);
    return await axios.post(INSERT_DOC_URL,data)
}

export const GENDERSTATUS = (pk) => {
    console.log(pk);
    const data = {id:parseInt(pk),...browser}
    return axios.post(STATUS_GENDER_URL,data)
}
export const BLOODSTATUS = (pk) => {
    console.log(pk);
    const data = {id:pk,...browser}
    return axios.post(STATUS_BLOOD_URL,data)
}
export const BRANCHSTATUS = (pk) => {
    const data = {id:parseInt(pk),...browser}
    return axios.post(STATUS_BRANCH_URL,data)
}
export const DEPARTMENTSTATUS = (pk) => {
    const data = {id:parseInt(pk),...browser}
    return axios.post(STATUS_DEPARTMENT_URL,data)
}
export const DESIGNATIONSTATUS = (pk) => {
    const data = {id:parseInt(pk),...browser}
    return axios.post(STATUS_DESIGNATION_URL,data)
}
export const NARITALSTATUS = (pk) => {
    const data = {id:pk,...browser}
    return axios.post(STATUS_MARITAL_URL,data)
}
export const QUALIFICATIONSTATUS = (pk) => {
    const data = {id:parseInt(pk),...browser}
    return axios.post(STATUS_QUALIFICATION_URL,data)
}
export const WORKSTATUS = (pk) => {
    const data = {id:parseInt(pk),...browser}
    return axios.post(STATUS_WORK_URL,data)
}
export const DOCUMENTSTATUS = (pk) => {
    const data = {id:parseInt(pk),...browser}
    return axios.post(STATUS_DOCUMENT_URL,data)
}

