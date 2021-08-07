import { createGrid, dropDisc } from './logic.js'

const elementGame = document.querySelector('#grid')
const elementTileTemplate = document.querySelector('#tile-template')

const game_config = {
  width: 7,
  height: 6,
  players: 2,
  min_sequence: 4
}

let grid = createGrid(game_config)
loadGrid(grid)

elementGame.onclick = (event) => {
  if (!event.target.classList.contains('tile')) return
  const discDrop = dropDisc(game_config, grid, event.target.dataset.x, 1)
  renderDisc(discDrop.location)
  if (discDrop.seq.length > 0) {
    discDrop.seq[0].push([discDrop.location[1], discDrop.location[2]])
    renderWin(discDrop.seq[0])
  }
}

function loadGrid(grid) {
  grid.forEach((row, yIndex) => {
    row.forEach((tile, xIndex) => {
      const elementTile = elementTileTemplate.content
        .cloneNode(true)
        .querySelector('.tile')
      elementTile.dataset.x = xIndex
      elementTile.dataset.y = yIndex
      elementTile.dataset.value = tile.value
      elementGame.appendChild(elementTile)
    })
  })
  elementGame.style.setProperty('--width', game_config.width)
  elementGame.style.setProperty('--height', game_config.height)
}

function renderDisc([value, y, x]) {
  elementGame.querySelector(
    `.tile[data-x="${x}"][data-y="${y}"]`
  ).dataset.value = value
}
function renderWin(discs) {
  discs.forEach((disc) => {
    elementGame.querySelector(
      `.tile[data-x="${disc[1]}"][data-y="${disc[0]}"]`
    ).dataset.glow = true
  })
}
