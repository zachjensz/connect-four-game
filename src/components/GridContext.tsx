import { createContext, useEffect, useState } from "react"
import { Grid, Opponent, Player } from '../types'
import { createGrid } from '../support/logic'

interface Props {
  children: JSX.Element
  width: number
  height: number
}

type ContextType = {
  grid: Grid
  width: number
  height: number
}

export const GridContext = createContext<ContextType>({
  grid: [],
  width: 0,
  height: 0,
})

export const GridProvider = ({ children, height, width }: Props) => {
  const [grid, setGrid] = useState<number[][]>(createGrid(height, width))
  return (
    <GridContext.Provider
      value={{
        grid,
        width,
        height,
      }}
    >
      {children}
    </GridContext.Provider>
  )
}

