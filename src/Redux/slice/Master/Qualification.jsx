import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GETQUALIFICATION } from '../../../services/api/Master';

export const fetchQualificationData = createAsyncThunk('data/fetchQualificationData', async () => {
    return GETQUALIFICATION().then((res) => {
        return res.data
     })
})

const qualificationSlice = createSlice({
    name: 'qualificationSlice',
    initialState : {
        qualificationList : [],
        status : ""
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchQualificationData.pending, (state) => {
          state.status    = 'loading';
        })
        .addCase(fetchQualificationData.fulfilled, (state, action) => {
          state.status    = 'succeeded';
          state.qualificationList = action.payload;
        })
        .addCase(fetchQualificationData.rejected, (state, action) => {
          state.status    = 'failed';
          state.error     = action.error.message;
          state.qualificationList = []
        });
    },
});

export default qualificationSlice.reducer;