import { Grid, Player } from '../types'

export interface DiscDrop {
  disc: number[],
  seq: number[],
  newGrid: Grid
}

export const createGrid = (height: number, width: number) =>
  Array(height)
    .fill(0)
    .map(() => Array(width).fill(0))

export const cloneGrid = (grid: Grid) => grid.map((arr) => arr.slice())

// Drop tests each column looking for any column that would create a connect four
export function evalAllDrops(srcGrid: Grid, player: Player = 1) {
  const results = [],
    min_seq = 4
  // Column
  for (let x = 0; x < srcGrid.length; x++) {
    const grid = cloneGrid(srcGrid)
    // Row
    for (let i = 0; i < srcGrid[0].length; i++) {
      if (grid[i + 1]?.[x] === 0) continue
      if (grid[i]?.[x] === 0) {
        grid[i][x] = player
        const result = {
          column: x,
          player: player,
          seq: validSeq(grid, player, i, x, min_seq),
        }
        if (result.seq.length > 0) results.push(result)
      }
    }
  }
  return results
}

export function dropDisc(srcGrid: Grid, x: number, player: Player = 1, min_seq = 4) {
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
export function getColumnHeight(grid: Grid, x: number) {
  let height = 0
  for (let i = grid.length - 1; i >= 0; i--) {
    if (grid[i][x] === 0) return height
    height++
  }
  return grid.length
}

// Is the grid full
export function isGridFull(grid: Grid) {
  let full = true
  grid[0].forEach((disc) => (disc === 0 ? (full = false) : undefined))
  return full
}
