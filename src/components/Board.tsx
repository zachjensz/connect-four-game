import { useContext } from "react"
import { Slot, GridContext } from "."
import { Grid } from "../types"
import GameOverBanner from "./GameOverBanner"

interface Props {
  onClick: (x: number, y: number) => void
  grid: Grid
}

export default function Board({ grid, onClick }: Props) {
  return (
    <div id="grid">
      {grid.map((row, y) =>
        row.map((value, x) => (
          <Slot x={x} y={y} value={value} key={`${x},${y}`} onClick={onClick} />
        ))
      )}
    </div>
  )
}
