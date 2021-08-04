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
