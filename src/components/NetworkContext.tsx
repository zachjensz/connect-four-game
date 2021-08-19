import React, { createContext, useState } from "react"
import { io, Socket } from "socket.io-client"
import { DefaultEventsMap } from "socket.io-client/build/typed-events"

type OnOpponentFoundCallback = () => any
type OnDropCallback = () => any
type WebSocket = Socket<DefaultEventsMap, DefaultEventsMap>

interface Props {
  children: JSX.Element
}

type ContextType = {
  socket?: WebSocket
  connect: (serverUrl?: string) => void
  disconnect: () => void
  findOpponent: () => void
  sendPlayerDrop: (column: number) => void
  onOpponentDrop: (callback: OnDropCallback) => void
  onOpponentFound: (callback: OnOpponentFoundCallback) => void
}

export const NetworkContext = createContext<ContextType>({
  connect: () => undefined,
  disconnect: () => undefined,
  findOpponent: () => undefined,
  sendPlayerDrop: () => undefined,
  onOpponentDrop: () => undefined,
  onOpponentFound: () => undefined
})

export function NetworkProvider({ children }: Props) {  
  const [socket, setSocket] = useState<WebSocket | null>(null)

  function connect(serverUrl = "http://localhost:5000") {
    setSocket(io(serverUrl))
  }
  
  function disconnect() {
    if (socket?.connected)
      socket.disconnect()
    setSocket(null)
  }
  
  function findOpponent() {
    if (!socket) throw new Error("not connected to server")
    socket.emit("find-opponent")
  }
  
  function sendPlayerDrop(column: number) {
    if (!socket) throw new Error("not connected to server")
    if (typeof column !== "number") throw new Error(`invalid column: ${column}`)
    socket.emit("drop", column)
    console.log(`emit ${column}`)
  }

  function onOpponentDrop(callback: OnDropCallback) {
    if (!socket) throw new Error("not connected to server")
    if (typeof callback !== "function")
      throw new Error(`${!callback ? "no" : "invalid"} callback`)
    socket.on("drop", callback)
  }
  
  function onOpponentFound(callback: OnOpponentFoundCallback) {
    if (!socket) throw new Error("not connected to server")
    if (typeof callback !== "function")
      throw new Error(`callback is not a function`)
    socket.on("opponent-found", callback)
  }
  
  
  return (
    <NetworkContext.Provider
      value={{
        connect,
        disconnect,
        findOpponent,
        sendPlayerDrop,
        onOpponentDrop,
        onOpponentFound
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}
