import React, { useContext } from 'react'
import { GridContext } from './GridContext'

interface Props {
    x: number,
    y: number
}

export default function Slot({ x, y }: Props) {
    const { grid } = useContext(GridContext)
    return (
        <div>
            
        </div>
    )
}
