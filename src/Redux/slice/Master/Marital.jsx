import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GETMARITAL, INSERTMARITAL } from "../../../services/api/Master";

export const addMaritalData = createAsyncThunk('data/addMaritalData',async(data) => {
    return INSERTMARITAL(data).then(res => res.data)
})
export const fetchMaritalData = createAsyncThunk('data/fetchMaritalData',async() => {
    return GETMARITAL().then(res => res.data)
})

const maritalSlice = createSlice({
    name            : 'maritalSlice',
    initialState    : {
        maritalList : [],
        status : ''
    },
    reducers : {
        addMarital : (state,action) => {
            let task = {...action.payload}
            state.maritalList.push(task)
        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(fetchMaritalData.fulfilled, (state,action) => {
            state.status = 'succeeded'
            state.maritalList = action.payload
        })
    }
})

export default maritalSlice.reducer