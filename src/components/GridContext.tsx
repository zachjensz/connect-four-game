import { createContext, useEffect, useState } from "react"
import { Grid, Player } from "../types"
import {
  createGrid,
  dropDisc as dropDiscOnGrid,
} from "../support/logic"
import { computerMove as computerMoveOnGrid } from "../support/logic-dumbot"

interface Props {
  children: JSX.Element
  width: number
  height: number
}

type ContextType = {
  grid: Grid
  width: number
  height: number
  dropDisc: (column: number, player: Player) => boolean
  computerMove: () => boolean
  reset: () => void
}

export const GridContext = createContext<ContextType>({
  grid: [],
  width: 0,
  height: 0,
  dropDisc: () => false,
  computerMove: () => false,
  reset: () => undefined,
})

export const GridProvider = ({ children, height, width }: Props) => {
  const [grid, setGrid] = useState<Grid>([])

  useEffect(() => {
    console.log("grid provider init")
    setGrid(createGrid(height, width))
  }, [])

  useEffect(() => {
    console.log("grid changed:", grid)
  }, [grid])

  const showWin = (newGrid: Grid, seq: number[][]) => {
    seq.forEach(([row, column]) => {
      newGrid[row][column] = -newGrid[row][column]
    })
    setGrid(newGrid)
  }

  const reset = () => {
    console.log("reset")
    setGrid(createGrid(height, width))
  }

  const dropDisc = (column: number, player: Player) => {
    console.log("starting grid:", grid)
    const drop = dropDiscOnGrid(grid, column, player)
    if (drop) {
      if (drop.seq.length > 0) {
        showWin(drop.newGrid, drop.seq)
        return true
      }
      setGrid(drop.newGrid)
      console.log("ending grid:", drop.newGrid)
    }
    return false
  }

  const computerMove = () => {
    const move = computerMoveOnGrid(grid)
    if (!move) return false
    const drop = dropDiscOnGrid(grid, move.disc[1], 2)
    console.log("drop:", drop)
    if (drop) {
      if (drop.seq.length > 0) {
        showWin(drop.newGrid, drop.seq)
        return true
      }
      else setGrid(drop.newGrid)
    }
    return false
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
