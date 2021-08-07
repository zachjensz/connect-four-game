export function createGrid(game_config) {
  const board = Array(game_config.height)
    .fill(0)
    .map(() => Array(game_config.width).fill(0))
  return board
}

export function dropDisc(game_config, grid, x, player = 1) {
  let i = 0
  for (; i < game_config.height; i++) {
    if (grid[i + 1]?.[+x] == 0) continue
    grid[i][+x] = player
    break;
  }
  return {
    location: [1, i, +x],
    seq: validSeq([grid, player, i, +x], game_config.min_sequence)
  }
}

function validSeq(state, min_sequence) {
  const winningSequences = []
  const directions = [
    { v: 1, h: 0 },
    { v: 1, h: 1 },
    { v: 0, h: 1 },
    { v: 1, h: -1 }
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

export const computerMove = (game_config, grid) => {
  dropDisc(game_config, grid, 1, 2)
}
