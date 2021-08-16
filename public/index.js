import { createGrid, computerMove, dropDisc, isGridFull } from './logic.js'

const elementGame = document.querySelector('#grid')

const DELAY_COMPUTER = 700
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
loopGrid(gameGrid, renderSlotInitial)

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
    if (discDrop.seq.length > 0) {
      gameState = 'gameover'
      loopSlots(discDrop.seq[0], renderSlotUpdate, isPlayer ? -1 : -2)
    } else {
      renderSlotUpdate(discDrop.location)
    }
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

function loopGrid(grid, func, newValue) {
  grid.forEach((row, yIndex) => {
    row.forEach((slot, xIndex) => {
      func({ row, yIndex, slot, xIndex, newValue })
    })
  })
}

function loopSlots(slots, func, newValue) {
  console.log(slots, func, newValue)
  slots.forEach((slot) => {
    func({ row: slot[0], slot: slot[1], newValue })
  })
}

function renderSlotInitial({ yIndex, xIndex }) {
  const elementTile = clone('slot-template').querySelector('.slot')
  elementTile.dataset.x = xIndex
  elementTile.dataset.y = yIndex
  elementGame.appendChild(elementTile)
}

function renderSlotUpdate({ newValue, row, slot }) {
  console.log(newValue, row, slot)
  elementGame.querySelector(
    `.slot[data-y="${row}"][data-x="${slot}"]`
  ).dataset.value = newValue
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
  loopGrid(gameGrid, renderSlotInitial)
  return
}

function clone(template) {
  return document.getElementById(template).content.cloneNode(true)
}
