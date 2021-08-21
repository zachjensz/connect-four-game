import { useContext, useEffect, useState } from "react"
import { Slot, GridContext, NetworkContext } from "."
import { Player } from "../types"
import GameOverBanner from "./GameOverBanner"

interface Props {
  onClick: (x: number, y: number) => void
}

export default function Board({ onClick }: Props) {
  const { grid } = useContext(GridContext)    

  return (
    <>
      <div id="grid">
        {grid.map((row, y) =>
          row.map((value, x) => (
            <Slot
              x={x}
              y={y}
              value={value}
              key={`${x},${y}`}
              onClick={onClick}
            />
          ))
        )}
      </div>
      <GameOverBanner isVisible={false} />
    </>
  )
}
