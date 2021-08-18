import React, { useContext } from 'react'
import { GridContext } from './GridContext'

interface Props {
    x: number,
    y: number,
    value: number
    onClick: (x: number, y: number) => any
}

export default function Slot({ x, y, value, onClick }: Props) {
    const { grid } = useContext(GridContext)
    return (
        <div className='slot' onClick={() => onClick(x, y)}>
            {value ? '1' : '0'}
        </div>
    )
}
