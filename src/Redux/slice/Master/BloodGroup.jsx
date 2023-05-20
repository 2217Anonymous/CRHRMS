import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GETBLOOD, INSERTBLOOD } from "../../../services/api/Master";

export const addBloodGroupData = createAsyncThunk('data/addBloodGroupData',async(data) => {
    return INSERTBLOOD(data).then(res => res.data)
})
export const fetchBloodGroupData = createAsyncThunk('data/fetchBloodGroupData',async() => {
    return GETBLOOD().then(res => res.data)
})

const bloodGroupSlice = createSlice({
    name            : 'bloodGroupSlice',
    initialState    : {
        bloodGroupList : [],
        status : ''
    },
    reducers : {
        addBloodGroup : (state,action) => {
            let task = {...action.payload}
            state.bloodGroupList.push(task)
        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(fetchBloodGroupData.fulfilled, (state,action) => {
            state.status = 'succeeded'
            state.bloodGroupList = action.payload
        })
    }
})

export default bloodGroupSlice.reducer