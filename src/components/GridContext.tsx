import { createContext, useEffect, useState } from "react"
import { Grid, Player } from "../types"
import { createGrid, dropDisc as dropDiscOnGrid } from "../support/logic"
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
  width: 7,
  height: 6,
  dropDisc: () => false,
  computerMove: () => false,
  reset: () => undefined,
})

function useGrid(height: number, width: number) {
  const [grid, setGrid] = useState<Grid>([])

  return {
    grid,
    clear: () => setGrid(createGrid(height, width)),
    replace: (newGrid: Grid) => setGrid(newGrid)
  }
}

export const GridProvider = ({ children, height, width }: Props) => {
  const gridController = useGrid(height, width)

  useEffect(() => {
    gridController.clear()
  }, [])

  const showWin = (newGrid: Grid, seq: number[][]) => {
    seq.forEach(([row, column]) => {
      newGrid[row][column] = -newGrid[row][column]
    })
    gridController.replace(newGrid)
  }

  const dropDisc = (column: number, player: Player) => {
    const drop = dropDiscOnGrid(gridController.grid, column, player)
    if (drop) {
      if (drop.seq.length > 0) {
        showWin(drop.newGrid, drop.seq)
        return true
      }
      gridController.replace(drop.newGrid)
    }
    return false
  }

  const computerMove = () => {
    const move = computerMoveOnGrid(gridController.grid)
    if (!move) return false
    const drop = dropDiscOnGrid(gridController.grid, move.disc[1], 2)
    if (drop) {
      if (drop.seq.length > 0) {
        showWin(drop.newGrid, drop.seq)
        return true
      } else gridController.replace(drop.newGrid)
    }
    return false
  }

  return (
    <GridContext.Provider
      value={{
        grid: gridController.grid,
        width,
        height,
        dropDisc,
        computerMove,
        reset: gridController.clear,
      }}
    >
      {children}
    </GridContext.Provider>
  )
}
