import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CountryList } from "../../../services/api/Utility";
import { StateList } from "../../../services/api/Utility";
import { CityList } from "../../../services/api/Utility";

export const fetchCountryData = createAsyncThunk('data/fetchCountryData',async() => {
    return CountryList().then(res => res.data)
})

export const fetchStateData = createAsyncThunk('data/fetchStateData',async(countryId) => {
    console.log(countryId);
    return StateList(countryId).then(res => res.data)
})

export const fetchCityData = createAsyncThunk('data/fetchCityData',async(stateId) => {
    return CityList(stateId).then(res => res.data)
})

const initialState = {
    countries       : [],
    selectedCountry : null,
    states          : [],
    selectedState   : null,
    cities          : [],
};
  
const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {},
    extraReducers : (builder) => {
        builder
        .addCase(fetchCountryData.fulfilled, (state,action) => {
            console.log(action.payload);
            state.countries = action.payload
        })
        .addCase(fetchStateData.fulfilled, (state,action) => {
            state.states = action.payload
        })
        .addCase(fetchCityData.fulfilled, (state,action) => {
            state.cities = action.payload
        })
    }
  });

  export const {
    setCountries,
    setSelectedCountry,
    setStates,
    setSelectedState,
    setCities,
  } = locationSlice.actions;
  
  export default locationSlice.reducer;