export function createGrid(game_config) {
  const board = Array(game_config.height)
    .fill(0)
    .map(() => Array(game_config.width).fill(0))
  return board
}

export function dropDisc(game_config, grid, x) {
  for (let i = 0; i < grid.length; i++) {
    if (grid[i + 1]?.[+x] == 0) continue
    grid[i][+x] = 1
    return {
      location: [1, i, +x],
      win: checkWin([grid, 1, i, +x], game_config.min_sequence)
    }
  }
  grid[grid.length - 1][+x] = 1
  return {
    location: [1, game_config.width - 1, +x],
    win: checkWin([grid, 1, grid.length - 1, +x], game_config.min_sequence)
  }
}

function checkWin(state, min_sequence) {
  return (
    Math.max(
      checkDir(state, 0, -1) + checkDir(state, 0, 1),
      checkDir(state, -1, 0) + checkDir(state, 1, 0),
      checkDir(state, 1, -1) + checkDir(state, -1, 1),
      checkDir(state, 1, 1) + checkDir(state, -1, -1)
    ) > min_sequence
  )
}
function checkDir([grid, value, newDiscY, newDiscX], dirY, dirX) {
  let i = 1
  while (grid[newDiscY + dirY * i]?.[newDiscX + dirX * i] == value) i++
  return i--
}
