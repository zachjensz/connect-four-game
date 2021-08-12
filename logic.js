import { computerMove as computerMoveDumb } from './logic-dumbot.js'
import { computerMove as computerMoveSmart } from './logic-smartbot.js'
import { computerMove as computerMoveTerminator } from './logic-terminator.js'

// Creates a empty grid
export function createGrid(game_config) {
  const grid = Array(game_config.height)
    .fill(0)
    .map(() => Array(game_config.width).fill(0))
  return grid
}

// Drops a disc
export function dropDisc(game_config, grid, x, player = 1) {
  for (let i = 0; i < game_config.height; i++) {
    if (grid[i + 1]?.[+x] == 0) continue
    if (grid[i]?.[+x] == 0) {
      grid[i][+x] = player

      return {
        location: [player, i, +x],
        seq: validSeq([grid, player, i, +x], game_config.min_sequence),
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

function cast([grid, value, y, x], dY, dX) {
  let discs = []
  for (let i = 1; grid[y + dY * i]?.[x + dX * i] == value; i++) {
    discs.push([y + dY * i, x + dX * i])
  }
  return discs
}

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
  