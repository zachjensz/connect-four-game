import React, { useContext } from "react"
import { GridContext } from "."
import Slot from "./Slot"

interface RowProps {
  row: number[]
  index: number
}

const BoardRow = ({ row, index: x }: RowProps) => {
  return (
    <div>
      {row.map((value, y) => (
        <Slot x={x} y={y} value={value} key={`${x},${y}`} />
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
          <BoardRow row={row} index={x} />
        </div>
      )}
    </div>
  )
}
