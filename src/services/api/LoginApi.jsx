import {ADMIN_STATUS_URL,USER_REGISTER_URL,LOGIN_URL, GET_PROFILE_URL, LOGOUT_URL, FORGOT_URL, RESET_URL, CHANGE_PASSWORD_URL, GET_PERMISSION_URL, INSERT_PERMISSION_URL} from './ApiUrl';
import axios from 'axios';
import { BrowserName } from '../Browser';
import { getUserId } from '../storage/Storage'

const browser = BrowserName()
const origin = window.location.origin
const dt = {
    ipAddress:'127.0.0.1',
    geoLocation:'tiruppur',
    browser_Name:browser
}

export const GetSuperAdminStatus = async () => {
    return await axios.get(ADMIN_STATUS_URL)
}

export const UserRegister = (inputs) => {
    const Register_data = {Name:inputs.name,userName:inputs.username,password:inputs.password,confirmPassword:inputs.confirm_password,ipAddress:'127.0.0.1'}
    return axios.post(USER_REGISTER_URL,Register_data)
}

export const Authenticate = async (inputs) => {  
    const Login_Data = {userName:inputs.username,password:inputs.password,remenberMe:true,...dt}
    return await axios.post(LOGIN_URL,Login_Data)
}

export const Logout = () => {
    const id = getUserId()
    const Logout_Data = {id:id,...dt}
    return axios.post(LOGOUT_URL,Logout_Data)
}

export const Forgot = (props) => {
    const Forgot_Data = {email:props.useremail,host:origin,...dt}
    return axios.post(FORGOT_URL,Forgot_Data)
}

export const Reset = (data,code) => {
    const Reset_Data = {password:data.newPassword,confirmPassword:data.confirmPassword,code:code,...dt}
    return axios.post(RESET_URL,Reset_Data)
}

export const ChangePassword = (data,userId) => {
    const CP_Data = {userid:userId,currentPassword:data.current_password,password:data.password,confirmPassword:data.confirm_password,...dt}
    return axios.post(CHANGE_PASSWORD_URL,CP_Data)
}

export const Getprofile = async () => {
    const getProfile = await axios.post(GET_PROFILE_URL)
    return getProfile
}

export const Getpermission = async (Id) => {
    return await axios.post(GET_PERMISSION_URL,{Id:Id,ipAddress:'127.0.0.1',geoLocation:'tiruppur'})
}

export const Insertpermission = async (id,dt) => {
    console.log(id);
    const data = {userId:id,module_Operation_Id:dt}
    return await axios.post(INSERT_PERMISSION_URL,data)
}
