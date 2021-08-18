import { createContext, useEffect, useState } from "react"

interface Props {
  children: JSX.Element
  width: number
  height: number
}

type ContextType = {
  grid: number[][]
  width: number
  height: number
}

export const GridContext = createContext<ContextType>({
  grid: [],
  width: 0,
  height: 0
})

export const GridProvider = ({ children, height, width }: Props) => {
  const [grid, setGrid] = useState<number[][]>(createGrid(height, width))
  return (
    <GridContext.Provider
      value={{
        grid,
        width,
        height
      }}
    >
      {children}
    </GridContext.Provider>
  )
}

const createGrid = (height: number, width: number) =>
  Array(height)
    .fill(0)
    .map(() => Array(width).fill(0))