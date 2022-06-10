import { configureStore } from '@reduxjs/toolkit'
import counter from './counter'

export default configureStore({
    reducer: {
        counter: counter,
    },
})