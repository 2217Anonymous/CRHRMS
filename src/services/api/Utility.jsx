import axios from "axios"
import { ACTIVE_MODULE_LIST_URL, ACTIVE_SUBMODULE_LIST_URL, ADD_MODULE_URL, ADD_OPERATION_URL, ADD_SUBMODULE_URL, CITY_LIST_URL, COUNTRY_LIST_URL, INSERT_MODULE_OPERATION_URL, MODULE_LIST_URL, MODULE_STATUS_URL, OPERATION_LIST_URL, OPERATION_STATUS_URL, STATE_LIST_URL, SUBMODULE_LIST_URL, SUBMODULE_STATUS_URL } from "./ApiUrl"
const browser = {
    ipAddress:'127.0.0.1',
    geoLocation:'tiruppur',
}
export const moduleList = async () => {
    return await axios.get(MODULE_LIST_URL)
}

export const activeModuleList = async () => {
    return await axios.get(ACTIVE_MODULE_LIST_URL)
}
export const addModule = (props) => {
    const data = {moduleName:props.moduleName,description:props.describe,Indexing:parseInt(props.indexing),Icon:props.Icon}
    return axios.post(ADD_MODULE_URL,data)
}

export const moduleStatus = (pk) => {
    const data = {id:parseInt(pk)}
    return axios.post(MODULE_STATUS_URL,data)
}

export const subModuleList = async () => {
    return await axios.get(SUBMODULE_LIST_URL)
}

export const activeSubModuleList = async () => {
    return await axios.get(ACTIVE_SUBMODULE_LIST_URL)
}

export const addSubModule = (props) => {
    console.log(props);
    const data = {moduleId:parseInt(props.moduleName),subModuleName:props.subModuleName,description:props.describe,indexing:props.indexing,path:props.path}
    return axios.post(ADD_SUBMODULE_URL,data)
}

export const subModuleStatus = (pk) => {
    const data = {id:parseInt(pk)}
    return axios.post(SUBMODULE_STATUS_URL,data)
}

export const addOperation = (props) => {
    const data = {name:props.operationName}
    return axios.post(ADD_OPERATION_URL,data)
}

export const operationList = async () => {
    return await axios.get(OPERATION_LIST_URL)
}

export const operationStatus = (pk) => {
    const data = {id:parseInt(pk)}
    return axios.post(OPERATION_STATUS_URL,data)
}

export const insertModuleOperation = (module,operation) => {
    const data = {moduleId:parseInt(module.moduleId),operationId:operation}
    return axios.post(INSERT_MODULE_OPERATION_URL,data)
}

export const CountryList = () => {
    return axios.post(COUNTRY_LIST_URL)
}

export const StateList = (id) => {
    return axios.post(STATE_LIST_URL,{id:parseInt(id),...browser})
}

export const CityList = (id) => {
    return axios.post(CITY_LIST_URL,{id:parseInt(id),...browser})
}

