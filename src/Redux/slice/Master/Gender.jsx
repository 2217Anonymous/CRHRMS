import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GETGENDER, INSERTGENDER } from "../../../services/api/Master";

export const addGenderData = createAsyncThunk('data/addGenderData',async(data) => {
    return INSERTGENDER(data).then(res => res.data)
})
export const fetchGenderData = createAsyncThunk('data/fetchGenderData',async() => {
    return GETGENDER().then(res => res.data)
})

const genderSlice = createSlice({
    name            : 'genderSlice',
    initialState    : {
        genderList : [],
        status : ''
    },
    reducers : {
        addGender : (state,action) => {
            let task = {...action.payload}
            state.genderList.push(task)
        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(fetchGenderData.fulfilled, (state,action) => {
            state.status = 'succeeded'
            state.genderList = action.payload
        })
    }
})

export default genderSlice.reducer