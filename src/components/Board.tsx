import React, { useContext } from "react"
import { Slot, GridContext } from "."

interface RowProps {
  row: number[]
  index: number
  onClick: (x: number, y: number) => any
}

const BoardRow = ({ row, index: y, onClick }: RowProps) => {
  return (
    <div>
      {row.map((value, x) => (
        <Slot x={x} y={y} value={value} key={`${x},${y}`} onClick={onClick} />
      ))}
    </div>
  )
}

export default function Board() {
  const { grid, height, width, dropDisc } = useContext(GridContext)
  return (
    <div id='grid'>
      {grid.map((row, y) =>
        <div key={`y:${y}`}>
          <BoardRow row={row} index={y} onClick={(x, y) => {
            console.log("click: ", x, y)
            dropDisc(x, 1)
          }} />
        </div>
      )}
    </div>
  )
}
