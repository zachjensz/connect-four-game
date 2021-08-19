import { useContext } from "react"
import { Slot, GridContext } from "."
import { Player } from "../types"
import GameOverBanner from "./GameOverBanner"

interface Props {
  initialPlayer?: Player
}

export default function Board({ initialPlayer }: Props) {
  const { grid, dropDisc } = useContext(GridContext)
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
              onClick={(x, y) => {
                dropDisc(x, true)
              }}
            />
          ))
        )}
      </div>
      <GameOverBanner isVisible={false}/>
    </>
  )
}
