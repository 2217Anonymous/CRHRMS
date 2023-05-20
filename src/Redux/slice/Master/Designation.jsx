import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GETDESIGNATION, INSERTDESIGNATION } from "../../../services/api/Master";

export const addDesignationData = createAsyncThunk('data/addDesignationData',async(data) => {
    return INSERTDESIGNATION(data).then(res => res.data)
})
export const fetchDesignationData = createAsyncThunk('data/fetchDesignationData',async() => {
    return GETDESIGNATION().then(res => res.data)
})

const designationSlice = createSlice({
    name            : 'designationSlice',
    initialState    : {
        designationList : [],
        status : ''
    },
    reducers : {
        addDesignation : (state,action) => {
            let task = {...action.payload}
            state.designationList.push(task)
        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(fetchDesignationData.fulfilled, (state,action) => {
            state.status = 'succeeded'
            state.designationList = action.payload
        })
    }
})

export default designationSlice.reducer