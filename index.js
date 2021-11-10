import {
  resetGrid,
  getGrid,
  setGrid,
  computerMove,
  dropDisc,
  isGridFull,
  GAME_HEIGHT,
  GAME_WIDTH,
} from "./logic.js"
/*
import {
  connect,
  disconnect,
  findOpponent,
  onOpponentFound,
  onOpponentDrop,
  sendPlayerDrop
} from './networking.js'
*/

const elementGame = document.querySelector("#grid")
const DELAY_COMPUTER = 400
const MIN_SEQUENCE = 4
let isConnectedToServer = false
let playerHasOpponent = false
let gameState = ""

renderTitle()
resetGrid()
elementGame.style.setProperty("--width", GAME_WIDTH)
elementGame.style.setProperty("--height", GAME_HEIGHT)
renderGridInitial()

document.querySelector(".title").onclick = (event) => {
  if (event.target.id === "dumbot") {
    if (isConnectedToServer) {
      disconnect()
      isConnectedToServer = false
    }
    return removeTitle()
  }
  if (event.target.id === "onlineMultiplayer") {
    if (!isConnectedToServer) {
      connect()
      //connect("http://192.168.0.22:5000")
      isConnectedToServer = true
      onOpponentFound(() => {})
    }
    return removeTitle()
  }
}
elementGame.onclick = (event) => {
  if (gameState === "gameover") removeGameOver()
  if (!event.target.classList.contains("slot") || gameState != "player") return

  if (isConnectedToServer && !playerHasOpponent) {
    alert("waiting for an opponent...")
    return
  }

  gameState = "opponent"
  drop(true, +event.target.dataset.x)
  if (!isConnectedToServer) {
    setTimeout(() => {
      if (gameState === "opponent") gameState = "player"
    }, DELAY_COMPUTER * 2)
  }
}

let currentColumnHovered = 1
elementGame.onmouseover = (e) => {
  if (e.target.dataset.x != undefined) {
    currentColumnHovered = e.target.dataset.x
    console.log(`Current Column: ${currentColumnHovered}`)
  }
  elementGame.querySelectorAll(`.slot`).forEach((slot) => {
    slot.classList.remove("shine")
  })
  elementGame
    .querySelectorAll(`.slot[data-x="${currentColumnHovered}"]`)
    .forEach((slot) => {
      slot.classList.add("shine")
    })
}

if (isConnectedToServer) {
  listenForOpponentDrop((opponentColumn) => {
    console.log(`on ${opponentColumn}`)
    gameState = "player"
    drop(false, opponentColumn)
  })
}

function drop(isPlayer, column) {
  let discDrop = undefined
  if (isPlayer) {
    discDrop = dropDisc(column)
  } else {
    isConnectedToServer
      ? (discDrop = dropDisc(column, 2))
      : (discDrop = computerMove())
  }
  if (discDrop) {
    if (discDrop.seq.length === 0 && isPlayer) {
      if (isConnectedToServer) {
        sendPlayerDrop(column)
      } else {
        setTimeout(() => {
          drop(!isPlayer, column)
        }, DELAY_COMPUTER)
      }
    }
    setGrid(discDrop.newGrid)
    renderSlotArrayUpdate([discDrop.disc], isPlayer ? 1 : 2)
    if (discDrop.seq.length > 0)
      renderSlotArrayUpdate(discDrop.seq, isPlayer ? -1 : -2)
    if (discDrop.seq.length >= MIN_SEQUENCE) gameState = "gameover"
    if (gameState === "gameover")
      return renderGameOver(isPlayer ? "player" : "opponent")
    if (isGridFull()) return renderGameOver("none")
  }
}

function renderGridInitial() {
  const grid = getGrid()
  grid.forEach((row, yIndex) => {
    row.forEach((slot, xIndex) => {
      const elementTile = clone("slot-template").querySelector(".slot")
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
  const element = clone("title-template").querySelector(".title")
  gameState = "title"
  document.body.appendChild(element)
}

function removeTitle() {
  document.querySelector(".title").remove()
  gameState = "player"
}

function renderGameOver(winner) {
  const element = clone("game-over-template")
  element.querySelector("#game-over-result").textContent =
    gameOverMessage(winner)
  document.body.appendChild(element)

  function gameOverMessage(winner) {
    if (winner == "player") return "Player Wins! 🎉" //👍😕
    if (winner == "opponent") return "Opponent Wins 😂" //😲😒
    return "Tie Game 😦"
  }
}

function removeGameOver() {
  document.querySelector(".game-over").remove()
  gameState = "player"
  resetGrid()
  elementGame.innerHTML = ""
  elementGame.style.setProperty("--width", GAME_WIDTH)
  elementGame.style.setProperty("--height", GAME_HEIGHT)
  renderGridInitial()
  return
}

function clone(template) {
  return document.getElementById(template).content.cloneNode(true)
}
