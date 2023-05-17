import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GETQUALIFICATION, INSERTQUALIFICATION } from '../../../services/api/Master';

export const addQualificationData = createAsyncThunk('data/addQualificationData', async (task) => {
    return INSERTQUALIFICATION(task).then((res) => {
        return res.data
     })
})

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
    reducers: {
      addQualification : (state,action) => {
        let task = {...action.payload}
        state.qualificationList.push(task)
      },
    },

    extraReducers: (builder) => {
        builder
        .addCase(fetchQualificationData.fulfilled, (state, action) => {
          state.status    = 'succeeded';
          state.qualificationList = action.payload;
        })
    },
});

export default qualificationSlice.reducer;