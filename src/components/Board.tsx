import React, { useContext } from "react"
import { Slot, GridContext } from "."

interface RowProps {
  row: number[]
  index: number
  onClick: (x: number, y: number) => any
}

export default function Board() {
  const { grid, height, width, dropDisc } = useContext(GridContext)
  return (
    <div id="grid">
      {grid.map((row, y) => 
        row.map((value, x) => (
          <Slot x={x} y={y} value={value} key={`${x},${y}`} onClick={(x, y) => {
            console.log("click: ", x, y)
            dropDisc(x, 1)
          }} />
        ))
      )}
    </div>
  )
}
