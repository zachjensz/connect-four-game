import { computerMove as computerMoveDumb } from "./logic-dumbot.js"
import { computerMove as computerMoveSmart } from "./logic-smartbot.js"
import { computerMove as computerMoveTerminator } from "./logic-terminator.js"

// Drop tests each column looking for any column that would create a connect four
export function evalAllDrops(game_config, srcGrid, player = 1) {
  const results = [],
    min_seq = 4
  // Column
  for (let x = 0; x < game_config.width; x++) {
    const grid = cloneGrid(srcGrid)
    // Row
    for (let i = 0; i < game_config.height; i++) {
      if (grid[i + 1]?.[x] === 0) continue
      if (grid[i]?.[x] === 0) {
        grid[i][x] = player
        const result = {
          column: x,
          player: player,
          seq: validSeq([grid, player, i, x], min_seq),
        }
        if (result.seq.length > 0) results.push(result)
      }
    }
  }
  return results
}

// Drops a disc
export function dropDisc(game_config, grid, x, player = 1, min_seq = 4) {
  grid = cloneGrid(grid)
  for (let i = 0; i < game_config.height; i++) {
    if (grid[i + 1]?.[+x] === 0) continue
    if (grid[i]?.[+x] === 0) {
      grid[i][+x] = player
      return {
        location: [player, i, +x],
        seq: validSeq([grid, player, i, +x], min_seq),
        newGrid: grid,
      }
    }
  }
}

export function validSeq(state, min_sequence) {
  const winningSequences = []
  const directions = [
    { v: 1, h: 0 },
    { v: 1, h: 1 },
    { v: 0, h: 1 },
    { v: 1, h: -1 },
  ]
  directions.forEach((dir) => {
    const seq = [...cast(state, dir.v, dir.h), ...cast(state, -dir.v, -dir.h)]
    if (seq.length > min_sequence - 2) winningSequences.push(seq)
  })
  return winningSequences
}

const cloneGrid = (grid) => grid.map((arr) => arr.slice())

function cast([grid, value, y, x], dY, dX) {
  let discs = []
  for (let i = 1; grid[y + dY * i]?.[x + dX * i] === value; i++) {
    discs.push([y + dY * i, x + dX * i])
  }
  return discs
}

export function lowestHeightColumns(grid) {}

// Returns the height of a column
export function getColumnHeight(grid, x) {
  let height = 0
  for (let i = grid.length - 1; i >= 0; i--) {
    if (grid[i][x] === 0) return height
    height++
  }
  return grid.length
}

// Is the grid full
export function isGridFull(grid) {
  let full = true
  grid[0].forEach((disc) => (disc === 0 ? (full = false) : undefined))
  return full
}

// Called after the player move
export const computerMove = (game_config, grid, playerDrop) => {
  if (game_config.difficulty === 1)
    return computerMoveDumb(game_config, grid, playerDrop)
  if (game_config.difficulty === 2)
    return computerMoveSmart(game_config, grid, playerDrop)
  if (game_config.difficulty === 3)
    return computerMoveTerminator(game_config, grid, playerDrop)
}
