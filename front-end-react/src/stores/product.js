import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getProducts } from '../api/product';

export const initProducts = createAsyncThunk('initProducts', async () => {
    const res = await getProducts();
    return res.data
})

export const product = createSlice({
    name: 'product',
    initialState: {
        products: [],
        isInitialized: false
    },
    reducers: {
        foo: (state, action) => {

        }
    },
    extraReducers: (builder) => {
        builder.addCase(initProducts.fulfilled, (state, action) => {
            state.products = action.payload;
            state.isInitialized = true;
        });
    }
});

export const { foo } = product.actions

export default product.reducer