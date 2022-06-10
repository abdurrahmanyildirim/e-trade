import React from 'react'
import { useDispatch } from 'react-redux'
import { decrement, increment, incrementByAmount } from '../stores/counter'

export default function Counter({ setCount }) {
    const dispatch = useDispatch()
    return (
        <div>
            <button onClick={() => dispatch(increment())}>Artır</button>
            <button onClick={() => dispatch(decrement())}>Azalt</button>
            <button onClick={() => dispatch(incrementByAmount(4))}>4 Artır</button>
        </div>
    )
}