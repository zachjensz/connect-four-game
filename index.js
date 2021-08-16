import { createGrid, computerMove, dropDisc, isGridFull } from './logic.js'
import {} from './networking.js'

const elementGame = document.querySelector('#grid')

const DELAY_COMPUTER = 400
const MIN_SEQUENCE = 4
const GAME_WIDTH = 7
const GAME_HEIGHT = 6
let GAME_PLAYERS = 2
let GAME_DIFFICULTY = 1
let gameGrid = []
let gameState = ''

renderTitle()
gameGrid = createGrid(GAME_WIDTH, GAME_HEIGHT)
elementGame.style.setProperty('--width', GAME_WIDTH)
elementGame.style.setProperty('--height', GAME_HEIGHT)
renderGridInitial(gameGrid)

document.onclick = (event) => {
  const el = event.target
  if (document.querySelector('.title')?.contains(el)) return titleClick(el)
  if (!document.querySelector('#grid')?.contains(el)) return
  if (gameState === 'gameover') removeGameOver()
  if (!el.classList.contains('slot') || gameState != 'player') return
  gameState = 'opponent'
  setTimeout(() => {
    if (gameState === 'opponent') gameState = 'player'
  }, DELAY_COMPUTER * 2)
  drop(true, el)
}

function drop(isPlayer, slot) {
  const dropAgent = isPlayer ? dropDisc : computerMove
  const discDrop = dropAgent(
    { GAME_WIDTH, GAME_HEIGHT, GAME_PLAYERS, GAME_DIFFICULTY },
    gameGrid,
    slot.dataset.x
  )
  if (discDrop) {
    gameGrid = discDrop.newGrid
    renderSlotArrayUpdate([discDrop.disc], isPlayer ? 1 : 2)
    if (discDrop.seq.length > 0)
      renderSlotArrayUpdate(discDrop.seq, isPlayer ? -1 : -2)
    if (discDrop.seq.length >= MIN_SEQUENCE) gameState = 'gameover'
    if (gameState === 'gameover')
      return renderGameOver(isPlayer ? 'player' : 'opponent')
    if (isGridFull(gameGrid)) return renderGameOver('none')
    if (isPlayer)
      setTimeout(() => {
        drop(false, slot)
      }, DELAY_COMPUTER)
  }
}

function titleClick(el) {
  if (el.id == 'dumbot') return removeTitle()
  alert('Gamemode currently in development')
}

function renderGridInitial(grid) {
  grid.forEach((row, yIndex) => {
    row.forEach((slot, xIndex) => {
      const elementTile = clone('slot-template').querySelector('.slot')
      elementTile.dataset.x = xIndex
      elementTile.dataset.y = yIndex
      elementGame.appendChild(elementTile)
    })
  })
}

function renderSlotArrayUpdate(slots, newValue) {
  slots.forEach((slot) => {
    elementGame.querySelector(
      `.slot[data-y="${slot[0]}"][data-x="${slot[1]}"]`
    ).dataset.value = newValue
  })
}

function renderTitle() {
  const element = clone('title-template').querySelector('.title')
  gameState = 'title'
  document.body.appendChild(element)
}

function removeTitle() {
  document.querySelector('.title').remove()
  gameState = 'player'
}

function renderGameOver(winner) {
  const element = clone('game-over-template')
  element.querySelector('#game-over-result').textContent =
    gameOverMessage(winner)
  document.body.appendChild(element)

  function gameOverMessage(winner) {
    if (winner == 'player') return 'Player Wins! 🎉' //👍😕
    if (winner == 'opponent') return 'Computer Wins 😂' //😲😒
    return 'Tie Game 😦'
  }
}

function removeGameOver() {
  document.querySelector('.game-over').remove()
  gameState = 'player'
  gameGrid = createGrid(GAME_WIDTH, GAME_HEIGHT)
  elementGame.innerHTML = ''
  elementGame.style.setProperty('--width', GAME_WIDTH)
  elementGame.style.setProperty('--height', GAME_HEIGHT)
  renderGridInitial(gameGrid)
  return
}

function clone(template) {
  return document.getElementById(template).content.cloneNode(true)
}
