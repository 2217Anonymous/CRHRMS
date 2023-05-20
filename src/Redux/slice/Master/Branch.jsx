import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GETBRANCHES, INSERTBRANCHES } from "../../../services/api/Master";

export const addBranchData = createAsyncThunk('data/addBranchData',async(data) => {
    return INSERTBRANCHES(data).then(res => res.data)
})
export const fetchBranchData = createAsyncThunk('data/fetchBranchData',async() => {
    return GETBRANCHES().then(res => res.data)
})

const branchesSlice = createSlice({
    name            : 'branchesSlice',
    initialState    : {
        branchesList : [],
        status : ''
    },
    reducers : {
        addBranch : (state,action) => {
            let task = {...action.payload}
            state.branchesList.push(task)
        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(fetchBranchData.fulfilled, (state,action) => {
            state.status = 'succeeded'
            state.branchesList = action.payload
        })
    }
})

export default branchesSlice.reducer