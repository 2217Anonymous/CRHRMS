import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GETDOCUMENT, INSERTDOCUMENT } from "../../../services/api/Master";

export const addDocumentData = createAsyncThunk('data/addDocumentData',async(data) => {
    return INSERTDOCUMENT(data).then(res => res.data)
})
export const fetchDocumentData = createAsyncThunk('data/fetchDocumentData',async() => {
    return GETDOCUMENT().then(res => res.data)
})

const documentSlice = createSlice({
    name            : 'documentSlice',
    initialState    : {
        documentList : [],
        status : ''
    },
    reducers : {
        addDocument : (state,action) => {
            let task = {...action.payload}
            state.documentList.push(task)
        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(fetchDocumentData.fulfilled, (state,action) => {
            state.status = 'succeeded'
            state.documentList = action.payload
        })
    }
})

export default documentSlice.reducer