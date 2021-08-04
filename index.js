import { createGrid } from './logic.js'

const elementGame = document.querySelector('#game-area')
const elementTileTemplate = document.querySelector('#tile-template')

const game_config = {
  width: 7,
  height: 5
}

const grid = createGrid(game_config)
loadGrid(grid)

function loadGrid(grid) {
  grid.forEach((row, xIndex) => {
    row.forEach((tile, yIndex) => {
      const elementTile = elementTileTemplate.content
        .cloneNode(true)
        .querySelector('.tile')
      elementTile.dataset.x = xIndex
      elementTile.dataset.y = yIndex
      elementTile.dataset.value = tile.value
      elementGame.appendChild(elementTile)
    })
  })
}
