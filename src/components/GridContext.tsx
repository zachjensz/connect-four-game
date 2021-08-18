import { createContext, useEffect, useState } from "react"

type Grid = number[][]
type Player = 1 | 2
type Opponent = "online" | "local" | "ai" | "smart-ai"

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

const createGrid = (height: number, width: number) =>
  Array(height)
    .fill(0)
    .map(() => Array(width).fill(0))

function dropDisc(srcGrid: Grid, x: number, player: Player = 1, min_seq = 4) {
  const gameGrid = cloneGrid(srcGrid)
  for (let i = 0; i < gameGrid.length; i++) {
    if (gameGrid[i + 1]?.[+x] === 0) continue
    if (gameGrid[i]?.[+x] === 0) {
      gameGrid[i][+x] = player
      const sequence = [...validSeq(gameGrid, player, i, +x, min_seq), [i, +x]]
      return {
        disc: [i, +x],
        seq: sequence.length > min_seq - 1 ? sequence : [],
        newGrid: gameGrid,
      }
    }
  }
}

function validSeq(
  grid: Grid,
  player: Player,
  i: number,
  x: number,
  min_sequence: number
) {
  const winningSequences: number[] = []
  const directions = [
    { v: 1, h: 0 },
    { v: 1, h: 1 },
    { v: 0, h: 1 },
    { v: 1, h: -1 },
  ]
  directions.forEach((dir) => {
    const seq: number[][] = [
      ...cast(grid, player, i, x, dir.v, dir.h),
      ...cast(grid, player, i, x, -dir.v, -dir.h),
    ]
    // @ts-ignore
    if (seq.length > min_sequence - 2) winningSequences.push(...seq)
  })
  return winningSequences
}

const cloneGrid = (grid: Grid) => grid.map((arr) => arr.slice())

function cast(
  grid: Grid,
  value: Player,
  y: number,
  x: number,
  dY: number,
  dX: number
) {
  let discs = []
  for (let i = 1; grid[y + dY * i]?.[x + dX * i] === value; i++) {
    discs.push([y + dY * i, x + dX * i])
  }
  return discs
}

export function lowestHeightColumns(grid: Grid) {}

// Returns the height of a column
function getColumnHeight(gameGrid: Grid, x: number) {
  let height = 0
  for (let i = gameGrid.length - 1; i >= 0; i--) {
    if (gameGrid[i][x] === 0) return height
    height++
  }
  return gameGrid.length
}

// Is the grid full
function isGridFull(gameGrid: Grid) {
  let full = true
  gameGrid[0].forEach((disc) => (disc === 0 ? (full = false) : undefined))
  return full
}
