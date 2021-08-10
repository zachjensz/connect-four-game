import { computerMove, createGrid, dropDisc } from './logic.js'

const elementGame = document.querySelector('#grid')
const elementTileTemplate = document.querySelector('#tile-template')

const game_config = {
  width: 7,
  height: 6,
  players: 2,
  min_sequence: 4
}

const game_state = {
  gridJSON: '',
  get grid() {
    return JSON.parse(this.gridJSON)
  },
  set grid(grid) {
    this.gridJSON = JSON.stringify(grid)
  },
  clickLock: false,
  gameOver: false
}

game_state.grid = createGrid(game_config)
loadGrid(game_state.grid)

window['getGrid'] = () => JSON.stringify(game_state.grid)
window[`setGrid`] = (newGrid) => {
  game_state.grid = JSON.parse(newGrid)
  loadGrid(game_state.grid)
  for (let x = 0; x < game_state.grid[0].length; x++) {
    for (let y = 0; y < game_state.grid.length; y++) {
      renderDisc([game_state.grid[y][x], y, x])
    }
  }
}

function loadGrid(grid) {
  elementGame.innerHTML = ""
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

elementGame.onclick = (event) => {
  if (
    !event.target.classList.contains('tile') ||
    game_state.clickLock ||
    game_state.gameOver
  )
    return
  game_state.clickLock = true
  setTimeout(() => {
    game_state.clickLock = false
  }, 1000)

  const discDrop = dropDisc(
    game_config,
    game_state.grid,
    event.target.dataset.x
  )
  if (discDrop) {
    game_state.grid = discDrop.newGrid
    game_state.gameOver = discDrop.seq.length > 0
    renderDisc(discDrop.location)
    renderHighlight(discDrop)
    if (!game_state.gameOver) {
      // Computer Move
      setTimeout(() => {
        const computerDrop = computerMove(
          game_config,
          game_state.grid,
          discDrop
        )
        if (computerDrop) {
          game_state.grid = computerDrop.newGrid
          game_state.gameOver = computerDrop.seq.length > 0
          renderDisc(computerDrop.location)
          renderHighlight(computerDrop, true)
        }
      }, 400)
    }
  }
}

function renderHighlight(drop, alert = false) {
  if (drop.seq.length > 0) {
    drop.seq[0].push([drop.location[1], drop.location[2]])
    renderWin(drop.seq[0], alert)
  }
}

function renderDisc([value, y, x]) {
  elementGame.querySelector(
    `.tile[data-x="${x}"][data-y="${y}"]`
  ).dataset.value = value
}
function renderWin(discs, alert) {
  discs.forEach((disc) => {
    const query = elementGame.querySelector(
      `.tile[data-x="${disc[1]}"][data-y="${disc[0]}"]`
    )
    if (alert) query.dataset.alert = true
    else query.dataset.glow = true
  })
}
