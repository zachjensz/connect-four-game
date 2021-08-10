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
    console.log('before get', this.gridJSON)
    return JSON.parse(this.gridJSON)
  },
  set grid(grid) {
    console.log('before set', this.gridJSON)
    this.gridJSON = JSON.stringify(grid)
  }
}

game_state.grid = createGrid(game_config)
loadGrid(game_state.grid)

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

let clickLock = false
let gameOver = false
elementGame.onclick = (event) => {
  if (!event.target.classList.contains('tile') || clickLock || gameOver) return
  clickLock = true
  setTimeout(() => {
    clickLock = false
  }, 1000)

  const discDrop = dropDisc(
    game_config,
    game_state.grid,
    event.target.dataset.x
  )
  if (discDrop) {
    game_state.grid = discDrop.newGrid
    gameOver = discDrop.seq.length > 0
    renderDisc(discDrop.location)
    renderHighlight(discDrop)
    if (!gameOver) {
      // Computer Move
      setTimeout(() => {
        const computerDrop = computerMove(
          game_config,
          game_state.grid,
          discDrop
        )
        if (computerDrop) {
          game_state.grid = computerDrop.newGrid
          gameOver = computerDrop.seq.length > 0
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
