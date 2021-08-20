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
  gameState: GameStates
  gameResults: GameResults
  width: number
  height: number
  drop: (column: number, doComputerMove: boolean) => void
  dropDisc: (column: number, player: Player) => void
  reset: () => void
}

export const GridContext = createContext<ContextType>({
  grid: [],
  gameState: GameStates.WAITING_FOR_OPPONENT,
  gameResults: GameResults.PLAYING,
  width: 0,
  height: 0,
  drop: () => undefined,
  dropDisc: () => undefined,
  reset: () => undefined,
})

export const GridProvider = ({
  children,
  height,
  width,
  computerOpponent,
}: Props) => {
  const [grid, setGrid] = useState<Grid>(createGrid(height, width))
  const [gameState, setGameState] = useState<GameStates>(
    GameStates.WAITING_FOR_OPPONENT
  )
  const [gameResults, setGameResults] = useState<GameResults>(
    GameResults.PLAYING
  )

  useEffect(() => {
    reset()
  }, [computerOpponent])

  const reset = () => {
    setGrid(createGrid(height, width))
    // TODO: The turn needs to be determined by the server for multiplayer
    setGameState(GameStates.PLAYERS_TURN)
  }

  return (
    <GridContext.Provider
      value={{
        grid,
        gameState,
        gameResults,
        width,
        height,
        dropDisc: (column: number, player: Player) => {
          const drop = dropDisc(grid, column, player)
          if (drop)
            setGrid(drop.newGrid)
          return drop
        },
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
        reset,
      }}
    >
      {children}
    </GridContext.Provider>
  )
}
