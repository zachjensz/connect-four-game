import { useContext, useEffect, useState } from "react"
import { Slot, GridContext, NetworkContext } from "."
import { Player } from "../types"
import GameOverBanner from "./GameOverBanner"

interface Props {
  initialPlayer?: Player
  computerPlayer: boolean
}

export default function Board({ initialPlayer, computerPlayer }: Props) {
  const { grid, dropDisc, resetGrid } = useContext(GridContext)
  const net = useContext(NetworkContext)
  const [turn, setTurn] = useState(initialPlayer ?? 1)

  useEffect(() => {
    resetGrid() 
    if (computerPlayer) return
    net.connect()
    return () => {
      net.disconnect()
    }
  }, [])

  const onClick = (x: number, y: number) => {
    if (!computerPlayer && turn !== 1) return
    dropDisc(x, computerPlayer)
    if (!computerPlayer)
      setTurn(2)
  }

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
