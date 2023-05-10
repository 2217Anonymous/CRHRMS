import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserRegister } from "../../services/api/LoginApi";

export const userRegister = createAsyncThunk('gets/userRegister',async(data) => {
    return UserRegister(data).then(res => {
        return res.data.Msg
    })
}) 

const userRegisterSlice = createSlice({
    name : 'userRegister',
    initialState : {
        users : [],
        selectedUser : {},
        loading : false,
        error:''
    },
    reducers:{
        addUserToServer : (state,action) => {
            let user = {...action.payload}
            state.users.push(user)
        },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(userRegister.pending,(state) => {
            state.loading = true
        })
        .addCase(userRegister.fulfilled,(state,action) => {
            state.loading = false
            state.error = ''
            state.users.push(action.payload)
        })
        .addCase(userRegister.rejected,(state,action) => {
            state.error = ''
            state.loading = false
            state.users = []
        })
        
    }
})

export const { addUserToServer } = userRegisterSlice.actions
export default userRegisterSlice.reducer