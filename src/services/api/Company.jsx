import axios from "axios"
import { ADD_SMTP_URL, COMPANY_LIST_URL, EDIT_COMPANY_URL, GET_COMPANY_SMTP_URL, NEW_COMPANY_URL, SMTP_LIST_URL, STATUS_COMPANY_URL } from "./ApiUrl"

const browser = {
    ipAddress:'127.0.0.1',
    geoLocation:'tiruppur',
}

export const NEW_COMPANY = async (dt) => {
    const data = {
        id                  : dt.Id ? dt.Id : parseInt(0),
        compName            : dt.compName,
        shortName           : dt.shortName,
        empCodePrefix       : dt.empCodePrefix,
        empCodeSufix        : dt.empCodeSufix,
        phoneNo             : dt.phoneNo,
        mobileNo            : dt.mobileNo,
        email               : dt.email,
        address             : dt.address,
        city                : dt.city,
        state               : parseInt(dt.state),
        country             : parseInt(dt.country),
        postcode            : dt.postcode,
        geoLoc              : dt.geoLoc,
        website             : dt.website,
        registrationNo      : dt.registrationNo,
        panNo               : dt.panNo,
        gstin               : dt.gstin,
        isCrmhave           : dt.isCrmhave,
        userRegisterApi     : dt.userRegisterApi,
        userRegisterData    : dt.userRegisterData,
        userDeactivateApi   : dt.userDeactivateApi,
        userDeactivateData  : dt.userDeactivateData,
        ...browser
    }
    return await axios.post(NEW_COMPANY_URL,data)
}

export const COMPANY_LIST = async () => {
    return await axios.post(COMPANY_LIST_URL)
} 

export const COMPANY_STATUS = async (id) => {
    return await axios.post(STATUS_COMPANY_URL,{id:id,...browser})
} 

export const EDIT_COMPANY = async (id) => {
    return await axios.post(EDIT_COMPANY_URL,{id:id,...browser})
}

export const ADD_SMTP = async (id,compId,param,dt,ssl) => {
    const data = {
        id              : id ? id : parseInt(0), 
        compId          : compId ? compId :parseInt(0),
        compParamStr    : param,
        userName        : dt.userName,
        displayName     : dt.displayName,
        password        : dt.password,
        host            : dt.host,
        port            : dt.port,
        sslEnable       : ssl,
        ...browser
    }
    console.log(data);
    return await axios.post(ADD_SMTP_URL,data)
}

export const SMTP_LIST = async () => {
    return await axios.post(SMTP_LIST_URL)
}

export const GET_COMPANY_SMTP = async (id) => {
    return await axios.post(GET_COMPANY_SMTP_URL,{id:id,...browser})
}