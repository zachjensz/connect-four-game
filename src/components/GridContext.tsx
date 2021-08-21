import { createContext, useEffect, useState } from "react"
import { GameResults, GameStates, Grid, Opponent, Player } from "../types"
import { createGrid, DiscDrop, dropDisc as dropDiscOnGrid } from "../support/logic"
import { computerMove as computerMoveOnGrid } from "../support/logic-dumbot"


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
    console.log('grid provider init')
  }, [])

  useEffect(() => {
    reset()
  }, [computerOpponent])

  useEffect(() => {
    console.log('grid changed:', grid)
  }, [grid])

  const reset = () => {
    console.log("reset")
    setGrid(createGrid(height, width))
  }

  const dropDisc = (column: number, player: Player) => {
    console.log("starting grid:", grid)
    const drop = dropDiscOnGrid(grid, column, player)
    console.log("drop:", drop)
    if (drop) {
      setGrid(drop.newGrid)
      console.log('ending grid:', drop.newGrid)
      return
    }
    console.log('no drop!')
  }

  const computerMove = () => {
    const move = computerMoveOnGrid(grid)
    console.log('move:', move)
    if (!move) return 
    const drop = dropDiscOnGrid(grid, move.disc[1], 2)
    console.log('drop:', drop)
    if (drop)
      setGrid(drop.newGrid)
  }

  return (
    <GridContext.Provider
      value={{
        grid,
        width,
        height,
        dropDisc,
        computerMove,
        reset,
      }}
    >
      {children}
    </GridContext.Provider>
  )
}
