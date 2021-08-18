import { createContext, useEffect, useState } from "react"
import { Grid, Opponent, Player } from '../types'
import { createGrid, dropDisc } from '../support/logic'

interface Props {
  children: JSX.Element
  width: number
  height: number
}

type ContextType = {
  grid: Grid
  width: number
  height: number
  dropDisc: (column: number, player: Player) => any
}

export const GridContext = createContext<ContextType>({
  grid: [],
  width: 0,
  height: 0,
  dropDisc: () => undefined
})

export const GridProvider = ({ children, height, width }: Props) => {
  const [grid, setGrid] = useState<number[][]>(createGrid(height, width))

  const dropDiscExport = (column: number, player: Player) => {
    const drop = dropDisc(grid, column, player)
    if (drop) setGrid(drop.newGrid)
  }
  
  return (
    <GridContext.Provider
      value={{
        grid,
        width,
        height,
        dropDisc: dropDiscExport
      }}
    >
      {children}
    </GridContext.Provider>
  )
}

