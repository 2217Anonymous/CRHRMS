// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { GETBLOOD } from '../../services/api/Master';

// export const fetchBloodData = createAsyncThunk('data/fetchBloodData', async () => {
//     return true
// })

// const bloodSlice = createSlice({
//     name: 'bloodSlice',
//     initialState : {
//         bloodList : [],
//         status : ""
//     },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//         .addCase(fetchBloodData.pending, (state) => {
//           state.status    = 'loading';
//         })
//         .addCase(fetchBloodData.fulfilled, (state, action) => {
//           state.status    = 'succeeded';
//           state.bloodList = action.payload;
//         })
//         .addCase(fetchBloodData.rejected, (state, action) => {
//           state.status    = 'failed';
//           state.error     = action.error.message;
//           state.bloodList = []
//         });
//     },
// });

// export default bloodSlice.reducer;