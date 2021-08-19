import { createContext, useEffect, useState } from 'react'
import { Grid, Opponent, Player } from '../types'
import { createGrid, DiscDrop, dropDisc } from '../support/logic'
import { computerMove } from '../support/logic-dumbot'

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
  computerMove: () => DiscDrop | undefined
}

export const GridContext = createContext<ContextType>({
  grid: [],
  width: 0,
  height: 0,
  dropDisc: () => undefined,
  computerMove: () => undefined
})

export const GridProvider = ({ children, height, width }: Props) => {
  const [grid, setGrid] = useState<number[][]>(createGrid(height, width))

  return (
    <GridContext.Provider
      value={{
        grid,
        width,
        height,
        dropDisc: (column: number, player: Player) => {
          const drop = dropDisc(grid, column, player)
          if (drop) return setGrid(drop.newGrid)
          console.log('invalid drop, column full?')
        },
        computerMove: () => {
          return computerMove(grid)
        }
      }}
    >
      {children}
    </GridContext.Provider>
  )
}
