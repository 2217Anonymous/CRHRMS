import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetSuperAdminStatus } from "../../services/api/LoginApi";

export const getAdminStatus = createAsyncThunk('gets/getAdminStatus',async() => {
    return GetSuperAdminStatus().then(res => {
        return res.data
    })
}) 

const adminStatusSlice = createSlice({
    name : 'adminStatus',
    initialState : {
        adminStatus : {},
        loading : false
    },
    extraReducers:{
        [getAdminStatus.pending] : (state,action) => {
            state.loading = true
        },
        [getAdminStatus.fulfilled] : (state,action) => {
            state.loading = false
            state.adminStatus = action.payload
        },
        [getAdminStatus.rejected] : (state,action) => {
            state.loading = false
        },
    }
})



export default adminStatusSlice.reducer