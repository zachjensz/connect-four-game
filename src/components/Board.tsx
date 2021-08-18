import React, { useContext } from "react"
import { GridContext } from "."
import Slot from "./Slot"

interface RowProps {
  row: number[]
  x: number
}

const BoardRow = ({ row, x }: RowProps) => {
  return (
    <div>
      {row.map((value, y) => (
        <Slot x={x} y={y} value={value} />
      ))}
    </div>
  )
}

export default function Board() {
  const { grid, height, width } = useContext(GridContext)
  return (
    <div>
      {grid.map((row, x) =>
        <div>
          <BoardRow row={row} x={x} />
        </div>
      )}
    </div>
  )
}
