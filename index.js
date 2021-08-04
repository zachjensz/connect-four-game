import { createGrid, dropDisc } from './logic.js'

const elementGame = document.querySelector('#grid')
const elementTileTemplate = document.querySelector('#tile-template')

const game_config = {
  width: 7,
  height: 5
}

let grid = createGrid(game_config)
loadGrid(grid)

elementGame.onclick = (event) => {
  if (!event.target.classList.contains('tile')) return
  const [newGrid, outcomes, newDiscLocation] = dropDisc(
    grid,
    event.target.dataset.x
  )
  grid = newGrid
  renderDisc(newDiscLocation)
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

function renderDisc([value, x, y]) {
  elementGame.querySelector(
    `.tile[data-x="${x}"][data-y="${y}"]`
  ).dataset.value = value
  console.log(value, x, y)
  console.log(elementGame.querySelector(`.tile[data-x="${x}"][data-y="${y}"]`))
}
