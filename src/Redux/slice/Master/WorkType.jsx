import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GETWORKTYPE, INSERTWORKTYPE } from "../../../services/api/Master";

export const addWorktypeData = createAsyncThunk('data/addWorktypeData',async(data) => {
    return INSERTWORKTYPE(data).then(res => res.data)
})
export const fetchWorktypeData = createAsyncThunk('data/fetchWorktypeData',async() => {
    return GETWORKTYPE().then(res => res.data)
})

const worktypeSlice = createSlice({
    name            : 'worktypeSlice',
    initialState    : {
        worktypeList : [],
        status : ''
    },
    reducers : {
        addWorktype : (state,action) => {
            let task = {...action.payload}
            state.worktypeList.push(task)
        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(fetchWorktypeData.fulfilled, (state,action) => {
            state.status = 'succeeded'
            state.worktypeList = action.payload
        })
    }
})

export default worktypeSlice.reducer