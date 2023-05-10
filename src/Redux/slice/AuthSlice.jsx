import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Authenticate } from "../../services/api/LoginApi";

export const getAuthUser = createAsyncThunk('gets/getAuthUser',async(data) => {
    return Authenticate(data).then(res => {
        return res.data
    })
}) 

const authSlice = createSlice({
    name : 'Authenticate',
    initialState : {
        users : [],
        selectedUser : {},
        loading : false,
        error:''
    },
    reducers:{
        checkAuth : (state,action) => {
            let user = {...action.payload}
            state.users.push(user)
        },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getAuthUser.pending,(state) => {
            state.loading = true
        })
        .addCase(getAuthUser.fulfilled,(state,action) => {
            state.loading = false
            state.error = ''
            state.users.push(action.payload)
        })
        .addCase(getAuthUser.rejected,(state,action) => {
            state.error = ''
            state.loading = false
            state.users = []
        })
    }
})

export const { checkAuth } = authSlice.actions
export default authSlice.reducer