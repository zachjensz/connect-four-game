import { useContext, useState } from "react"
import { Slot, GridContext } from "."
import { Player } from "../types"
import GameOverBanner from "./GameOverBanner"

interface Props {
  initialPlayer?: Player
  computerPlayer: boolean
}

export default function Board({ initialPlayer, computerPlayer }: Props) {
  const { grid, dropDisc } = useContext(GridContext)
  const [turn, setTurn] = useState(initialPlayer ?? 1)

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
                dropDisc(x, computerPlayer)
              }}
            />
          ))
        )}
      </div>
      <GameOverBanner isVisible={false}/>
    </>
  )
}

