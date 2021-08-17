import { io } from "socket.io-client"

let socket

export function connect(serverUrl = "http://localhost:5000") {
  console.log(serverUrl)
  socket = io(serverUrl)
}

export function disconnect() {
    socket = undefined
}

export function findOpponent() {
  if (!socket) throw new Error("not connected to server")
  socket.emit("find-opponent")
}

export function sendPlayerDrop(column) {
  if (!socket) throw new Error("not connected to server")
  if (typeof column !== "number") throw new Error(`invalid column: ${column}`)
  socket.emit("drop", column)
  console.log(`emit ${column}`)
}

export function onOpponentDrop(callback) {
  if (!socket) throw new Error("not connected to server")
  if (typeof callback !== "function")
    throw new Error(`${!callback ? "no" : "invalid"} callback`)
  socket.on("drop", callback)
}

export function onOpponentFound(callback) {
  if (!socket) throw new Error("not connected to server")
  if (typeof callback !== "function")
    throw new Error(`callback is not a function`)
  socket.on("opponent-found", callback)
}

