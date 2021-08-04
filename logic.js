export function createGrid(game_config) {
  const board = Array(game_config.height)
    .fill(0)
    .map(() => Array(game_config.width).fill(0));
  return board
}

export function dropDisc(grid, x) {
  const newGrid = grid.slice()
  for (let i = 0; i < grid.length; i++) {
    if (grid[i][+x].value == 0) continue
    newGrid[i - 1][+x].value = 1
    return [newGrid, [], [1, +x, i - 1]]
  }
  newGrid[grid.length - 1][+x].value = 1
  return [newGrid, [], [1, +x, grid.length - 1]]
}
