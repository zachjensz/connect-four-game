import { createContext, useEffect, useState } from "react"
import { GameResults, GameStates, Grid, Opponent, Player } from "../types"
import { createGrid, DiscDrop, dropDisc } from "../support/logic"
import { computerMove } from "../support/logic-dumbot"


interface Props {
  children: JSX.Element
  width: number
  height: number
  computerOpponent: boolean
}

type ContextType = {
  grid: Grid
  width: number
  height: number  
  dropDisc: (column: number, player: Player) => void
  computerMove: () => void
  reset: () => void
}

export const GridContext = createContext<ContextType>({
  grid: [],
  width: 0,
  height: 0,
  dropDisc: () => undefined,
  computerMove: () => undefined,
  reset: () => undefined,
})

export const GridProvider = ({
  children,
  height,
  width,
  computerOpponent,
}: Props) => {
  const [grid, setGrid] = useState<Grid>(createGrid(height, width))

  useEffect(() => {
    console.log("reset")
    reset()
  }, [computerOpponent])

  const reset = () => {
    setGrid(createGrid(height, width))
  }

  return (
    <GridContext.Provider
      value={{
        grid,
        width,
        height,
        dropDisc: (column: number, player: Player) => {
          const drop = dropDisc(grid, column, player)
          console.log("drop:", drop)
          if (drop)
            setGrid(drop.newGrid)
        },
        computerMove: () => {
          const move = computerMove(grid)
          if (!move) return 
          const drop = dropDisc(grid, move.disc[1], 2)
          if (drop)
            setGrid(drop.newGrid)
        },
        reset,
      }}
    >
      {children}
    </GridContext.Provider>
  )
}
