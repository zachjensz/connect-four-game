import { createGrid } from './logic.js'

const elementGame = document.querySelector('#grid')
const elementTileTemplate = document.querySelector('#tile-template')

const game_config = {
  width: 12,
  height: 8
}

const grid = createGrid(game_config)
loadGrid(grid)
elementGame.style.setProperty('--width', game_config.width)
elementGame.style.setProperty('--height', game_config.height)

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
