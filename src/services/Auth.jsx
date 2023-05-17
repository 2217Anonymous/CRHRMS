import axios from "axios";
import { getAdminData, getUserData } from "../../../hrms/src/services/storage/Storage";

const authToken = getUserData()

export const isAuthenticated = () => {
    const auth = getUserData() != null?true:false 
    return auth
}

export const isSortAdmin = () => {
    const auth = getAdminData() != null?true:false && getUserData() != null?true:false 
    return auth
    // const login = getAdminData() != null?true:false

    // if(login === true){
    //     if(getAdminData() === 'Falcon_4817'){
    //         return true
    //     }else{
    //         return false
    //     }
    // }else{
    //     return false
    // }
}

export const isTokenAuthorized = () => {
    axios.interceptors.request.use(
        config => {
            config.headers.authorization = `Bearer ${authToken}`;
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    )
}