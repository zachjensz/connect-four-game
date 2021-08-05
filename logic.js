export function createGrid(game_config) {
  const game = []
  for (let y = 0; y < game_config.height; y++) {
    const row = []
    for (let x = 0; x < game_config.width; x++) {
      const tile = 0
      row.push(tile)
    }
    game.push(row)
  }
  return game
}

export function dropDisc(grid, x) {
  const newGrid = grid.slice()
  for (let i = 0; i < grid.length; i++) {
    if (grid[i + 1]?.[+x] == 0) continue
    newGrid[i][+x] = 1
    return [newGrid, [checkWin([newGrid, 1, i, +x])], [1, i, +x]]
  }
  newGrid[grid.length - 1][+x] = 1
  return [
    newGrid,
    [checkWin([newGrid, 1, grid.length - 1, +x])],
    [1, grid.length - 1, +x]
  ]
}

function checkWin(state) {
  const MIN_SEQUENCE = 4
  const maxSequence = Math.max(
    checkDir(state, 0, -1) + checkDir(state, 0, 1),
    checkDir(state, -1, 0) + checkDir(state, 1, 0),
    checkDir(state, 1, -1) + checkDir(state, -1, 1),
    checkDir(state, 1, 1) + checkDir(state, -1, -1)
  )
  if (maxSequence > MIN_SEQUENCE - 2) return true
  return false
}
function checkDir([grid, value, newDiscY, newDiscX], checkDirY, checkDirX) {
  const checkY = newDiscY + checkDirY
  const checkX = newDiscX + checkDirX
  if (grid[checkY]?.[checkX] != value) return 0
  return 1 + checkDir([grid, value, checkY, checkX], checkDirY, checkDirX)
}
