import { createSlice } from '@reduxjs/toolkit'

export const site = createSlice({
    name: 'site',
    initialState: {
        isInitialized: false,
    },
    reducers: {
        init: state => {
            state.isInitialized = true
        },
    },
})

export const { init } = site.actions

export default site.reducer