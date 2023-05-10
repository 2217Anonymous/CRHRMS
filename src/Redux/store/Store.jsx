import { configureStore } from "@reduxjs/toolkit";
import adminStatusReducer from '../slice/GetAdminSlice'
import companyReducer from '../slice/CompanySlice'

const store = configureStore({
    reducer : {
        adminStatus : adminStatusReducer,
        company     : companyReducer,
    }
})

export default store