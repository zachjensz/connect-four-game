import React, { useContext, useState } from "react"
import { setOriginalNode } from "typescript"
import { Slot, GridContext } from "."
import { Player } from "../types"

interface Props {
  initialPlayer?: Player
}

export default function Board({initialPlayer}: Props) {
  const { grid, height, width, dropDisc } = useContext(GridContext)
  const [turn, setTurn] = useState<Player | undefined>(1)
  return (
    <div id="grid">
      {grid.map((row, y) => 
        row.map((value, x) => (
          <Slot x={x} y={y} value={value} key={`${x},${y}`} onClick={(x, y) => {
            dropDisc(x, true)
          }} />
        ))
      )}
    </div>
  )
}
