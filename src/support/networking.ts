import { io, Socket } from "socket.io-client"
import { DefaultEventsMap } from "socket.io-client/build/typed-events"

type OnOpponentFoundCallback = () => any
type OnDropCallback = () => any
type WebSocket = Socket<DefaultEventsMap, DefaultEventsMap>

let socket: WebSocket | null

export function connect(serverUrl = "http://localhost:5000") {
  console.log(serverUrl)
  socket = io(serverUrl)
}

export function disconnect() {
    socket = null
}

export function findOpponent() {
  if (!socket) throw new Error("not connected to server")
  socket.emit("find-opponent")
}

export function sendPlayerDrop(column: number) {
  if (!socket) throw new Error("not connected to server")
  if (typeof column !== "number") throw new Error(`invalid column: ${column}`)
  socket.emit("drop", column)
  console.log(`emit ${column}`)
}

export function onOpponentDrop(callback: OnDropCallback) {
  if (!socket) throw new Error("not connected to server")
  if (typeof callback !== "function")
    throw new Error(`${!callback ? "no" : "invalid"} callback`)
  socket.on("drop", callback)
}

export function onOpponentFound(callback: OnOpponentFoundCallback) {
  if (!socket) throw new Error("not connected to server")
  if (typeof callback !== "function")
    throw new Error(`callback is not a function`)
  socket.on("opponent-found", callback)
}

