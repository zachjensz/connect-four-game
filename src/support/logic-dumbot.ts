import { Grid, Opponent, Player } from '../types'
import {
  dropDisc,
  evalAllDrops,
  getColumnHeight,
  isGridFull,
} from "./logic.js"

export const computerMove = (grid: Grid) => {
  let column = -1
  if (isGridFull(grid)) return

  // Searches for computer wins
  const evalWins = evalAllDrops(grid, 2)
  if (evalWins.length > 0) column = evalWins[0].column

  if (column >= 0) {
    const drop = dropDisc(grid, column, 2)
    if (drop) return drop
    throw new Error("drop failed")
  }

  // Searches for player blocks
  const evalBlocks = evalAllDrops(grid, 1)
  if (evalBlocks.length > 0) column = evalBlocks[0].column

  if (column >= 0) {
    const drop = dropDisc(grid, column, 2)
    if (drop) return drop
    throw new Error("drop failed")
  }

  // Random Drop
  column = -1
  const isColumnFull = (idx: number) => getColumnHeight(grid, idx) === grid.length
  const isRowEmpty = (idx: number) =>
    grid[idx].reduce(
      (previousValue, _, index) => previousValue + grid[idx][index],
      0
    )
  const isEarly = !isRowEmpty(grid.length - 3)
  const columnsTried = Array(grid[0].length).fill(0)
  while (column < 0) {
    column = isEarly
      ? Math.floor(Math.random() * 5) + 1
      : Math.floor(Math.random() * 7)
    columnsTried[column] = 1
    const totalTried = columnsTried.reduce((prev, curr, arr) => prev + curr, 0)

    if (isColumnFull(column) && totalTried === grid[0].length) break
    if (isColumnFull(column)) {
      column = -1
      continue
    }

    // Drop a test disc
    const drop = dropDisc(grid, column, 2)
    // Will this drop setup the player for a win?
    if (drop) {
      if (evalBlocks.length > 0) {
        column = -1
        continue
      }
      return drop
    }
    throw new Error(
      `drop failed on column ${column}, ${getColumnHeight(grid, column)}, ${
        grid.length
      }`
    )
  }

  throw new Error("drop failed")
}
