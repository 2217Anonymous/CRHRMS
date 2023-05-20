import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GETDEPARTMENTS, INSERTDEPARTMENTS } from "../../../services/api/Master";

export const addDepartmentData = createAsyncThunk('data/addDepartmentData',async(data) => {
    return INSERTDEPARTMENTS(data).then(res => res.data)
})
export const fetchDepartmentData = createAsyncThunk('data/fetchDepartmentData',async() => {
    return GETDEPARTMENTS().then(res => res.data)
})

const departmentSlice = createSlice({
    name            : 'departmentSlice',
    initialState    : {
        departmentList : [],
        status : ''
    },
    reducers : {
        addDepartment : (state,action) => {
            let task = {...action.payload}
            state.departmentList.push(task)
        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(fetchDepartmentData.fulfilled, (state,action) => {
            state.status = 'succeeded'
            state.departmentList = action.payload
        })
    }
})

export default departmentSlice.reducer