import { computerMove, dropDisc, isGridFull } from './logic.js'

const elementGame = document.querySelector('#grid')
const elementTileTemplate = document.querySelector('#tile-template')
const elementTitlescreenTemplate = document.querySelector(
  '#titlescreen-template'
)

const titlescreen = elementTitlescreenTemplate.content
  .cloneNode(true)
  .querySelector('.titlescreen')

const elementGameOverTemplate = document.querySelector('#game-over-template')

const GAME_WIDTH = 7
const GAME_HEIGHT = 6
let GAME_PLAYERS = 2
let GAME_DIFFICULTY = 1

const game_state = {
  titlescreen: false,
  clickLock: false,
  gameOver: false,
  winner: 0,
  gridJSON: '',
  get grid() {
    return JSON.parse(this.gridJSON)
  },
  set grid(grid) {
    this.gridJSON = JSON.stringify(grid)
  }
}

const elementTitlescreen = renderTitlescreen()
elementTitlescreen.addEventListener('submit', titlescreenClick)

game_state.grid = createGrid(GAME_WIDTH, GAME_HEIGHT)
loadGrid(game_state.grid)

window['getGrid'] = () => JSON.stringify(game_state.grid)
window[`setGrid`] = (newGrid) => {
  game_state.grid = JSON.parse(newGrid)
  loadGrid(game_state.grid)
  renderEntireGrid()
}

// Creates a empty grid
function createGrid(GAME_WIDTH, GAME_HEIGHT) {
  const grid = Array(GAME_HEIGHT)
    .fill(0)
    .map(() => Array(GAME_WIDTH).fill(0))
  return grid
}

function renderEntireGrid() {
  for (let x = 0; x < game_state.grid[0].length; x++) {
    for (let y = 0; y < game_state.grid.length; y++) {
      renderDisc([game_state.grid[y][x], y, x])
    }
  }
}

function renderGameOver() {
  const gameOverScreen = elementGameOverTemplate.content
    .cloneNode(true)
    .querySelector('.game-over')
  document.body.appendChild(gameOverScreen)
  let element = document.getElementById('game-over-result')
  if (GAME_DIFFICULTY === 1)
    element.innerHTML = !game_state.winner
      ? 'Tie Game!? 😦'
      : `${
          game_state.winner === 1 ? 'Player Wins!!! 🎉' : 'Computer Wins!!! 😂'
        }`
  else if (GAME_DIFFICULTY === 2)
    element.innerHTML = !game_state.winner
      ? 'Tie Game!? 😦'
      : `${
          game_state.winner === 1 ? 'Player Wins!!! 👍' : 'Computer Wins!!! 😕'
        }`
  else if (GAME_DIFFICULTY === 3)
    element.innerHTML = !game_state.winner
      ? 'Tie Game!? 😦'
      : `${
          game_state.winner === 1 ? 'Player Wins!!! 😲' : 'Computer Wins!!! 😒'
        }`
  return gameOverScreen
}

function removeGameOver() {
  document.querySelector('.game-over').remove()
  game_state.gameOver = false
}

function renderTitlescreen() {
  document.body.appendChild(titlescreen)
  game_state.titlescreen = true
  return titlescreen
}

function titlescreenClick(event) {
  event.preventDefault()
  switch (event.submitter.id) {
    case 'dumbot':
      removeTitlescreen()
      GAME_DIFFICULTY = 1
      break
    case 'smartbot':
      alert('Gamemode currently in development')
      GAME_DIFFICULTY = 2
      break
    case 'terminator':
      GAME_DIFFICULTY = 3
      alert('Gamemode currently in development')
      break
    case 'localMultiplayer':
      alert('Gamemode currently in development')
      break
    case 'onlineMultiplayer':
      alert('Gamemode currently in development')
      break
  }
}

function removeTitlescreen() {
  document.querySelector('.titlescreen').remove()
  game_state.titlescreen = false
}

function loadGrid(grid) {
  elementGame.innerHTML = ''
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
  elementGame.style.setProperty('--width', GAME_WIDTH)
  elementGame.style.setProperty('--height', GAME_HEIGHT)
}

elementGame.onclick = (event) => {
  if (game_state.titlescreen) return
  if (game_state.gameOver) {
    removeGameOver()
    renderTitlescreen()
    game_state.grid = createGrid({
      GAME_WIDTH,
      GAME_HEIGHT,
      GAME_PLAYERS,
      GAME_DIFFICULTY
    })
    loadGrid(game_state.grid)
    renderEntireGrid()
    return
  }
  if (!event.target.classList.contains('tile') || game_state.clickLock) return
  game_state.clickLock = true
  setTimeout(() => {
    game_state.clickLock = false
  }, 1000)

  const discDrop = dropDisc(
    { GAME_WIDTH, GAME_HEIGHT, GAME_PLAYERS, GAME_DIFFICULTY },
    game_state.grid,
    event.target.dataset.x
  )
  if (discDrop) {
    game_state.grid = discDrop.newGrid
    game_state.gameOver = discDrop.seq.length > 0
    renderDisc(discDrop.location)
    renderHighlight(discDrop)
    if (game_state.gameOver) {
      game_state.winner = 1
      renderGameOver()
      return
    }
    if (isGridFull(game_state.grid)) {
      game_state.winner = 0
      renderGameOver()
      return
    }
    // Computer Move
    setTimeout(() => {
      const computerDrop = computerMove(
        { GAME_WIDTH, GAME_HEIGHT, GAME_PLAYERS, GAME_DIFFICULTY },
        game_state.grid,
        discDrop
      )
      if (computerDrop) {
        game_state.grid = computerDrop.newGrid
        game_state.gameOver = computerDrop.seq.length > 0
        renderDisc(computerDrop.location)
        renderHighlight(computerDrop, true)
        if (game_state.gameOver) {
          game_state.winner = 2
          renderGameOver()
          return
        }
        if (isGridFull(game_state.grid)) {
          game_state.winner = 0
          renderGameOver()
          return
        }
      }
    }, 400)
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
