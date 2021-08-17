//import { io } from 'socket.io-client'
import { computerMove as computerMoveDumb } from './logic-dumbot.js'
import { computerMove as computerMoveSmart } from './logic-smartbot.js'
import { computerMove as computerMoveTerminator } from './logic-terminator.js'

export const GAME_WIDTH = 7
export const GAME_HEIGHT = 6

let gameGrid = []

export function establishConnection() {
  //return io('http://localhost:5000')
}

export function resetGrid() {
  gameGrid = createGrid(GAME_WIDTH, GAME_HEIGHT)
}

export const getGrid = () => gameGrid
export const setGrid = (grid) => gameGrid = grid

function createGrid(GAME_WIDTH, GAME_HEIGHT) {
  return Array(GAME_HEIGHT)
    .fill(0)
    .map(() => Array(GAME_WIDTH).fill(0))
}

// Drop tests each column looking for any column that would create a connect four
export function evalAllDrops(
  { GAME_WIDTH, GAME_HEIGHT, GAME_PLAYERS, GAME_DIFFICULTY },
  player = 1
) {
  const results = [],
    min_seq = 4
  // Column
  for (let x = 0; x < GAME_WIDTH; x++) {
    const grid = cloneGrid(gameGrid)
    // Row
    for (let i = 0; i < GAME_HEIGHT; i++) {
      if (grid[i + 1]?.[x] === 0) continue
      if (grid[i]?.[x] === 0) {
        grid[i][x] = player
        const result = {
          column: x,
          player: player,
          seq: validSeq([grid, player, i, x], min_seq)
        }
        if (result.seq.length > 0) results.push(result)
      }
    }
  }
  return results
}

// Drops a disc
export function dropDisc({ GAME_HEIGHT }, x, player = 1, min_seq = 4) {
  gameGrid = cloneGrid(gameGrid)
  for (let i = 0; i < GAME_HEIGHT; i++) {
    if (gameGrid[i + 1]?.[+x] === 0) continue
    if (gameGrid[i]?.[+x] === 0) {
      gameGrid[i][+x] = player
      const sequence = [...validSeq([gameGrid, player, i, +x], min_seq), [i, +x]]
      return {
        disc: [i, +x],
        seq: sequence.length > min_seq - 1 ? sequence : [],
        newGrid: gameGrid
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
    { v: 1, h: -1 }
  ]
  directions.forEach((dir) => {
    const seq = [...cast(state, dir.v, dir.h), ...cast(state, -dir.v, -dir.h)]
    if (seq.length > min_sequence - 2) winningSequences.push(...seq)
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
export function getColumnHeight(x) {
  let height = 0
  for (let i = gameGrid.length - 1; i >= 0; i--) {
    if (gameGrid[i][x] === 0) return height
    height++
  }
  return gameGrid.length
}

// Is the grid full
export function isGridFull() {
  let full = true
  gameGrid[0].forEach((disc) => (disc === 0 ? (full = false) : undefined))
  return full
}

// Called after the player move
export const computerMove = (
  { GAME_WIDTH, GAME_HEIGHT, GAME_PLAYERS, GAME_DIFFICULTY }
) => {
  if (GAME_DIFFICULTY === 1)
    return computerMoveDumb(
      { GAME_WIDTH, GAME_HEIGHT, GAME_PLAYERS, GAME_DIFFICULTY },
      gameGrid
    )
  if (GAME_DIFFICULTY === 2)
    return computerMoveSmart(
      { GAME_WIDTH, GAME_HEIGHT, GAME_PLAYERS, GAME_DIFFICULTY },
      gameGrid
    )
  if (GAME_DIFFICULTY === 3)
    return computerMoveTerminator(
      { GAME_WIDTH, GAME_HEIGHT, GAME_PLAYERS, GAME_DIFFICULTY },
      gameGrid
    )
}
