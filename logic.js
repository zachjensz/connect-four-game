export function createGrid(game_config) {
  const game = []
  for (let y = 0; y < game_config.height; y++) {
    const row = []
    for (let x = 0; x < game_config.width; x++) {
      //
      const tile = {
        value: 0
      }
      row.push(tile)
    }
    game.push(row)
  }
  return game
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
