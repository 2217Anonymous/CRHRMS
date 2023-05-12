import  secureLocalStorage  from  "react-secure-storage";

export const removeUserData = (() => {
    localStorage.clear()
})

export const storeUserData = ((data) => {
    localStorage.setItem('idToken',data)
}) 

export const getUserData = (() => {
    return localStorage.getItem('idToken')
}) 

export const storeUserId = ((data) => {
    secureLocalStorage.setItem('userId',data)
}) 

export const getUserId = (() => {
    return secureLocalStorage.getItem('userId')
}) 

export const storeAdminData = ((data) => {
    secureLocalStorage.setItem('adminPass',data)
}) 

export const getAdminData = (() => {
    return secureLocalStorage.getItem('adminPass')
}) 

export const storeUserMenu = ((data) => {
    secureLocalStorage.setItem('userMenu',data)
}) 

export const getUserMenu = (() => {
    return secureLocalStorage.getItem('userMenu')
}) 

export const storePermission = ((data) => {
    secureLocalStorage.setItem('permission',data)
}) 

export const getPermission = (() => {
    return secureLocalStorage.getItem('permission')
}) 

export const storeCompanyId = ((data) => {
    secureLocalStorage.removeItem('CompanyId')
    secureLocalStorage.setItem('CompanyId',data)
}) 

export const getComId= (() => {
    return secureLocalStorage.getItem('CompanyId')
}) 


