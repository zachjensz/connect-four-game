import React, { useState, useContext } from 'react'
import { Slot, GridContext } from '.'

interface RowProps {
  row: number[]
  index: number
  onClick: (x: number, y: number) => any
}

const BoardRow = ({ row, index: y, onClick }: RowProps) => {
  return (
    <>
      {row.map((value, x) => (
        <Slot x={x} y={y} value={value} key={`${x},${y}`} onClick={onClick} />
      ))}
    </>
  )
}

export default function Board() {
  const { grid, height, width, dropDisc, computerMove } =
    useContext(GridContext)
  const [isPlayer, setIsPlayer] = useState(true)
  const isConnectedToServer = false
  const DELAY_COMPUTER = 200

  const drop = (x: number, y: number) => {
    console.log('click: ', x, y)
    let discDrop = undefined
    if (isPlayer) {
      discDrop = dropDisc(x, 1)
    } else {
      isConnectedToServer
        ? (discDrop = dropDisc(x, 2))
        : (discDrop = computerMove())
    }
    if (discDrop) {
      if (isPlayer) {
        setTimeout(() => {}, DELAY_COMPUTER)
      }
    }
  }
  return (
    <div id='grid'>
      {grid.map((row, y) => (
        <BoardRow row={row} index={y} onClick={drop} />
      ))}
    </div>
  )
}
