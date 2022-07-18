import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getCategories } from '../api/category';

export const initCategories = createAsyncThunk('initCategories', async () => {
    const res = await getCategories();
    return res.data
})

export const category = createSlice({
    name: 'category',
    initialState: {
        categories: [],
        isInitialized: false
    },
    reducers: {
        foo: (state, action) => {

        }
    },
    extraReducers: (builder) => {
        builder.addCase(initCategories.fulfilled, (state, action) => {
            state.categories = action.payload;
            state.isInitialized = true;
        });
    }
});

export const { foo } = category.actions

export default category.reducer