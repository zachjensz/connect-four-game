import { createGrid, computerMove, dropDisc, isGridFull } from './logic.js'

const elementGame = document.querySelector('#grid')
const elementTileTemplate = document.querySelector('#tile-template')

const DELAY_COMPUTER = 700
const GAME_WIDTH = 7
const GAME_HEIGHT = 6
let GAME_PLAYERS = 2
let GAME_DIFFICULTY = 1
let gameGrid = []
let gameState = ''

renderTitlescreen()

gameGrid = createGrid(GAME_WIDTH, GAME_HEIGHT)
loadGrid(gameGrid)

elementGame.onclick = (event) => {
  const slot = event.target
  if (gameState === 'gameover') removeGameOver()
  if (!slot.classList.contains('tile') || gameState != 'player') return
  gameState = 'opponent'
  setTimeout(() => {
    if (gameState === 'opponent') gameState = 'player'
  }, DELAY_COMPUTER * 2)
  drop(true, slot)
}

function drop(isPlayer, slot) {
  const type = isPlayer ? dropDisc : computerMove
  const discDrop = type(
    { GAME_WIDTH, GAME_HEIGHT, GAME_PLAYERS, GAME_DIFFICULTY },
    gameGrid,
    slot.dataset.x
  )
  if (discDrop) {
    gameGrid = discDrop.newGrid
    if (discDrop.seq.length > 0) gameState = 'gameover'
    renderDisc(discDrop.location)
    renderHighlight(discDrop, !isPlayer)
    if (gameState === 'gameover')
      return renderGameOver(isPlayer ? 'player' : 'opponent')
    if (isGridFull(gameGrid)) return renderGameOver('none')
    if (isPlayer)
      setTimeout(() => {
        drop(false, slot)
      }, DELAY_COMPUTER)
  }
}

function renderEntireGrid() {
  for (let x = 0; x < gameGrid[0].length; x++) {
    for (let y = 0; y < gameGrid.length; y++) {
      renderDisc([gameGrid[y][x], y, x])
    }
  }
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

/*
TODO
'Player Wins!!! 👍' : 'Computer Wins!!! 😕'
'Player Wins!!! 😲' : 'Computer Wins!!! 😒'
*/

// Render functions
function renderTitlescreen() {
  const element = clone('titlescreen-template').querySelector('.titlescreen')
  element.addEventListener('submit', titlescreenClick)
  gameState = 'titlescreen'
  document.body.appendChild(element)
}

function titlescreenClick(event) {
  event.preventDefault()
  if (event.submitter.id == 'dumbot') {
    removeTitlescreen()
    GAME_DIFFICULTY = 1
    return
  }
  alert('Gamemode currently in development')
}

function removeTitlescreen() {
  document.querySelector('.titlescreen').remove()
  gameState = 'player'
}

function renderGameOver(winner) {
  const element = clone('game-over-template')
  element.querySelector('#game-over-result').textContent =
    gameOverMessage(winner)
  document.body.appendChild(element)

  function gameOverMessage(winner) {
    if (winner == 'player') return 'Player Wins! 🎉'
    if (winner == 'opponent') return 'Computer Wins 😂'
    return 'Tie Game 😦'
  }
}

function removeGameOver() {
  document.querySelector('.game-over').remove()
  gameState = 'player'
  gameGrid = createGrid(GAME_WIDTH, GAME_HEIGHT)
  loadGrid(gameGrid)
  renderEntireGrid()
  return
}

function clone(template) {
  return document.getElementById(template).content.cloneNode(true)
}
