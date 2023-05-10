import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { COMPANY_LIST } from '../../services/api/Company';

export const fetchCompanyData = createAsyncThunk('data/fetchCompanyData', async () => {
    return COMPANY_LIST().then((res) => {
        return res.data
     })
})

const companySlice = createSlice({
    name: 'companySlice',
    initialState : {
        companyList : [],
        status : ""
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchCompanyData.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchCompanyData.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.companyList = action.payload;
        })
        .addCase(fetchCompanyData.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
          state.companyList = []
        });
    },
});

export default companySlice.reducer;