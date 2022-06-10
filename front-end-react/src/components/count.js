import React from 'react'
import { useSelector } from 'react-redux'



export default function Count() {
    const count = useSelector((state) => state.counter.value)
    return (
        <div>
            {count}
        </div>
    )
}