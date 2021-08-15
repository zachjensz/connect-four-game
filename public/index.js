import { createGrid, computerMove, dropDisc, isGridFull } from './logic.js'

const elementGame = document.querySelector('#grid')
const elementTileTemplate = document.querySelector('#tile-template')
const elementTitlescreenTemplate = document.querySelector(
  '#titlescreen-template'
)

const GAME_WIDTH = 7
const GAME_HEIGHT = 6
let GAME_PLAYERS = 2
let GAME_DIFFICULTY = 1
let gameGrid = []
let gameState = ''

let elementTitlescreen = renderTitlescreen()

gameGrid = createGrid(GAME_WIDTH, GAME_HEIGHT)
loadGrid(gameGrid)

elementGame.onclick = (event) => {
  if (gameState === 'titlescreen') return
  if (gameState === 'gameover') {
    removeGameOver()
    gameGrid = createGrid(GAME_WIDTH, GAME_HEIGHT)
    loadGrid(gameGrid)
    renderEntireGrid()
    return
  }
  if (!event.target.classList.contains('tile') || gameState === 'opponent')
    return
  gameState = 'opponent'
  setTimeout(() => {
    if (gameState === 'opponent') gameState = 'player'
  }, 1000)

  const discDrop = dropDisc(
    { GAME_WIDTH, GAME_HEIGHT, GAME_PLAYERS, GAME_DIFFICULTY },
    gameGrid,
    event.target.dataset.x
  )
  if (discDrop) {
    gameGrid = discDrop.newGrid
    if (discDrop.seq.length > 0) gameState = 'gameover'
    renderDisc(discDrop.location)
    renderHighlight(discDrop)
    if (gameState === 'gameover') {
      renderGameOver('player')
      return
    }
    if (isGridFull(gameGrid)) {
      renderGameOver('none')
      return
    }
    // Computer Move
    setTimeout(() => {
      const computerDrop = computerMove(
        { GAME_WIDTH, GAME_HEIGHT, GAME_PLAYERS, GAME_DIFFICULTY },
        gameGrid,
        discDrop
      )
      if (computerDrop) {
        gameGrid = computerDrop.newGrid
        if (computerDrop.seq.length > 0) gameState = 'gameover'
        renderDisc(computerDrop.location)
        renderHighlight(computerDrop, true)
        if (gameState === 'gameover') {
          renderGameOver('opponent')
          return
        }
        if (isGridFull(gameGrid)) {
          renderGameOver('none')
          return
        }
      }
    }, 400)
  }
}

function renderEntireGrid() {
  for (let x = 0; x < gameGrid[0].length; x++) {
    for (let y = 0; y < gameGrid.length; y++) {
      renderDisc([gameGrid[y][x], y, x])
    }
  }
}

function renderTitlescreen() {
  const titlescreen = elementTitlescreenTemplate.content
    .cloneNode(true)
    .querySelector('.titlescreen')
  titlescreen.addEventListener('submit', titlescreenClick)
  gameState = 'titlescreen'
  return document.body.appendChild(titlescreen)
}

function titlescreenClick(event) {
  event.preventDefault()
  switch (event.submitter.id) {
    case 'dumbot':
      removeTitlescreen()
      GAME_DIFFICULTY = 1
      break
    default:
      alert('Gamemode currently in development')
      break
  }
}

function removeTitlescreen() {
  document.querySelector('.titlescreen').remove()
  gameState = 'player'
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
}

function clone(template) {
  return document.getElementById(template).content.cloneNode(true)
}
