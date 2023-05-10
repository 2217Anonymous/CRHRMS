import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CountryList } from "../../../services/api/Utility";

const initialState = {
    countryList : [],
    selectedCountry : {},
    isLoading : false,
    error : ''
}

export const getCountry = createAsyncThunk('gets/getCountry',
    async() => {
        return await CountryList().then(res => {
            return res.data
        }).catch((error) => {
            console.log(error);
        })
}) 

const CountrySlice = createSlice({
    name : 'country',
    initialState,
    reducers : {
        getCountryList:(state,action) => {
            state.countryList.push({...action.payload})
        }
    },
    extraReducers:(builder) => {
        builder
        .addCase(getCountry.pending,(state) => {
            state.isLoading = true
        })
        .addCase(getCountry.fulfilled,(state,action) => {
            state.isLoading = false
            state.error = ''
            state.countryList = action.payload
        })
        .addCase(getCountry.rejected,(state,action) => {
            state.error = action.payload.error
            state.isLoading = true
            state.countryList = []
        })
    }
})


export const { getCountryList } = CountrySlice.actions
export default CountrySlice.reducer