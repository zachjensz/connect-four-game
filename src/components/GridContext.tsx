import { createContext, useEffect, useState } from "react"
import { GameStates, Grid, Opponent, Player } from "../types"
import { createGrid, DiscDrop, dropDisc } from "../support/logic"
import { computerMove } from "../support/logic-dumbot"

interface Props {
  children: JSX.Element
  width: number
  height: number
}

type ContextType = {
  grid: Grid
  gameState: GameStates
  width: number
  height: number
  drop: (column: number, doComputerMove: boolean) => any
  resetGrid: () => void
}

export const GridContext = createContext<ContextType>({
  grid: [],
  gameState: GameStates.WAITING_FOR_OPPONENT,
  width: 0,
  height: 0,
  drop: () => undefined,
  resetGrid: () => undefined
})

export const GridProvider = ({ children, height, width }: Props) => {
  const [grid, setGrid] = useState<Grid>(createGrid(height, width))
  const [gameState, setGameState] = useState<GameStates>(GameStates.WAITING_FOR_OPPONENT)
  
  return (
    <GridContext.Provider
      value={{
        grid,
        gameState,
        width,
        height,
        drop: (column: number, doComputerMove: boolean) => {
          const dropPlayer = dropDisc(grid, column, 1)
          if (!dropPlayer) return
          if (!doComputerMove) {
            setGrid(dropPlayer.newGrid)
            return dropPlayer
          }
          const move = computerMove(dropPlayer.newGrid)
          if (!move) return dropPlayer
          const dropComputer = dropDisc(dropPlayer.newGrid, move.disc[1], 2)
          if (dropComputer) {
            setGrid(dropComputer.newGrid)
            return dropComputer
          }
          setGrid(dropPlayer.newGrid)
          return dropPlayer
        },
        resetGrid: () => {
          setGrid(createGrid(height, width))
          setGameState(GameStates.PLAYING)
        }        
      }}
    >
      {children}
    </GridContext.Provider>
  )
}
