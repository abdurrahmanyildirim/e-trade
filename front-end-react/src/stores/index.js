import { configureStore } from '@reduxjs/toolkit';
import category from './category';
import product from './product';
import site from './site';

const store = configureStore({
    reducer: {
        product,
        category,
        site
    },
})

export default store;
