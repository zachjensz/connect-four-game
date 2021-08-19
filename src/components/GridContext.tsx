import { createContext, useEffect, useState } from "react"
import { Grid, Opponent, Player } from "../types"
import { createGrid, DiscDrop, dropDisc } from "../support/logic"
import { computerMove } from "../support/logic-dumbot"

interface Props {
  children: JSX.Element
  width: number
  height: number
}

type ContextType = {
  grid: Grid
  width: number
  height: number
  dropDisc: (column: number, doComputerMove: boolean) => any
}

export const GridContext = createContext<ContextType>({
  grid: [],
  width: 0,
  height: 0,
  dropDisc: () => undefined,
})

export const GridProvider = ({ children, height, width }: Props) => {
  const [grid, setGrid] = useState<Grid>(createGrid(height, width))

  return (
    <GridContext.Provider
      value={{
        grid,
        width,
        height,
        dropDisc: (column: number, doComputerMove: boolean) => {
          const dropPlayer = dropDisc(grid, column, 1)
          if (!dropPlayer) return
          if (!doComputerMove) {
            setGrid(dropPlayer.newGrid)
            return [1, dropPlayer]
          }
          const move = computerMove(dropPlayer.newGrid)
          if (!move) return [1, dropPlayer]
          const dropComputer = dropDisc(dropPlayer.newGrid, move.disc[1], 2)
          if (dropComputer) {
            console.log("drop:", dropComputer)
            setGrid(dropComputer.newGrid)
            return [2, dropComputer]
          }
          setGrid(dropPlayer.newGrid)
          return [1, dropPlayer]
        },
      }}
    >
      {children}
    </GridContext.Provider>
  )
}
