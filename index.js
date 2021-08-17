import {
  establishConnection,
  resetGrid,
  getGrid,
  setGrid,
  getGameState,
  setGameState,
  computerMove,
  dropDisc,
  isGridFull,
  GAME_HEIGHT,
  GAME_WIDTH
} from './logic.js'

const elementGame = document.querySelector('#grid')
const DELAY_COMPUTER = 400
const MIN_SEQUENCE = 4
let networking = false

let socket = ''
if (networking) socket = establishConnection()

renderTitle()
resetGrid()
elementGame.style.setProperty('--width', GAME_WIDTH)
elementGame.style.setProperty('--height', GAME_HEIGHT)
renderGridInitial()

document.querySelector('.title').onclick = (event) => {
  if (event.target.id == 'dumbot') return removeTitle()
}
document.querySelector('#grid').onclick = (event) => {
  const gameState = getGameState()
  if (gameState === 'gameover') removeGameOver()
  if (!event.target.classList.contains('slot') || gameState != 'player') return
  setGameState('opponent')
  setTimeout(() => {
    if (getGameState() === 'opponent') setGameState('player')
  }, DELAY_COMPUTER * 2)
  drop(true, event.target)
}

function drop(isPlayer, slot) {
  const dropAgent = isPlayer ? dropDisc : computerMove
  const discDrop = dropAgent(
    { GAME_WIDTH, currentPlayer },
    slot.dataset.x
  )
  if (discDrop) {
    setGrid(discDrop.newGrid)
    renderSlotArrayUpdate([discDrop.disc], isPlayer ? 1 : 2)
    if (discDrop.seq.length > 0)
      renderSlotArrayUpdate(discDrop.seq, isPlayer ? -1 : -2)
    if (discDrop.seq.length >= MIN_SEQUENCE) setGameState('gameover')
    if (getGameState() === 'gameover')
      return renderGameOver(isPlayer ? 'player' : 'opponent')
    if (isGridFull()) return renderGameOver('none')
    if (isPlayer)
      setTimeout(() => {
        drop(false, slot)
      }, DELAY_COMPUTER)
  }
}

function renderGridInitial() {
  const grid = getGrid()
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
  setGameState('title')
  document.body.appendChild(element)
}

function removeTitle() {
  document.querySelector('.title').remove()
  setGameState('player')
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
  setGameState('player')
  resetGrid()
  elementGame.innerHTML = ''
  elementGame.style.setProperty('--width', GAME_WIDTH)
  elementGame.style.setProperty('--height', GAME_HEIGHT)
  renderGridInitial()
  return
}

function clone(template) {
  return document.getElementById(template).content.cloneNode(true)
}
