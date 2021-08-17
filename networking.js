import { io } from "socket.io-client"

let socket

export function connectToServer(serverUrl = "http://localhost:5000") {
  console.log(serverUrl)
  socket = io(serverUrl)
}

export function sendPlayerDrop(column) {
  if (!socket) throw new Error("not connected to server")
  socket.emit("drop", column)
  console.log(`emit ${column}`)
}

export function listenForOpponentDrop(callback) {
  if (!socket) throw new Error("not connected to server")
  if (typeof callback !== "function")
    throw new Error(`${!callback ? "no" : "invalid"} callback`)
  socket.on("drop", callback)
}
