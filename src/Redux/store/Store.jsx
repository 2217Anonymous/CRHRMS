import { configureStore } from "@reduxjs/toolkit";
import adminStatusReducer from '../slice/GetAdminSlice'
import companyReducer from '../slice/CompanySlice'
import qualificationReducer from '../slice/Master/Qualification'

const store = configureStore({
    reducer : {
        adminStatus     : adminStatusReducer,
        company         : companyReducer,
        qualification   : qualificationReducer,
    }
})

export default store