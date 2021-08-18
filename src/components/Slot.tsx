import React, { useContext } from 'react'
import { GridContext } from './GridContext'

interface Props {
    x: number,
    y: number,
    value: number
}

export default function Slot({ x, y, value }: Props) {
    const { grid } = useContext(GridContext)
    return (
        <div className='slot'>
            {value ? '1' : '0'}
        </div>
    )
}
