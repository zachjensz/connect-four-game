import React, { useContext } from "react"
import { Slot, GridContext } from "."

interface RowProps {
  row: number[]
  index: number
  onClick: (x: number, y: number) => any
}

const BoardRow = ({ row, index: x, onClick }: RowProps) => {
  return (
    <div>
      {row.map((value, y) => (
        <Slot x={x} y={y} value={value} key={`${x},${y}`} onClick={onClick} />
      ))}
    </div>
  )
}

export default function Board() {
  const { grid, height, width } = useContext(GridContext)
  return (
    <div id='grid'>
      {grid.map((row, x) =>
        <div key={`x:${x}`}>
          <BoardRow row={row} index={x} onClick={(x, y) => {
            console.log("click: ", x, y)
          }} />
        </div>
      )}
    </div>
  )
}
