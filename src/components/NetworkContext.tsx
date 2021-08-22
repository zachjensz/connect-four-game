import React, { createContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { DefaultEventsMap } from "socket.io-client/build/typed-events"

type OpponentFoundResults = { id: string; startingPlayer: boolean }
type OnOpponentFoundCallback = (results: OpponentFoundResults) => void
type OnDropCallback = (column: number) => void
type WebSocket = Socket<DefaultEventsMap, DefaultEventsMap>

interface Props {
  children: JSX.Element
}

type ContextType = {
  socket?: WebSocket | null
  isConnected: boolean
  connect: (serverUrl?: string) => void
  disconnect: () => void
  findOpponent: () => void
  sendPlayerDrop: (column: number) => void
  onOpponentDrop: (callback: OnDropCallback) => void
  onOpponentFound: (callback: OnOpponentFoundCallback) => void
}

export const NetworkContext = createContext<ContextType>({
  isConnected: false,
  connect: () => undefined,
  disconnect: () => undefined,
  findOpponent: () => undefined,
  sendPlayerDrop: () => undefined,
  onOpponentDrop: () => undefined,
  onOpponentFound: () => undefined,
})

export function NetworkProvider({ children }: Props) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    return () => {
      if (socket?.connected) socket.disconnect()
    }
  }, [])

  function connect(serverUrl = "http://localhost:5000") {
    const sock = io(serverUrl)
    sock.on("connect", () => {
      setIsConnected(true)
    })
    sock.on("disconnect", () => {
      setIsConnected(false)
    })
    setSocket(sock)
  }

  function disconnect() {
    if (socket?.connected) socket.disconnect()
    setSocket(null)
  }

  function findOpponent() {
    if (!socket) throw new Error("not connected to server")
    socket.emit("find-opponent")
  }

  function sendPlayerDrop(column: number) {
    if (!socket) throw new Error("not connected to server")
    socket.emit("drop", column)    
  }

  function onOpponentDrop(callback: OnDropCallback) {
    if (!socket) throw new Error("not connected to server")
    socket.on("drop", callback)
  }

  function onOpponentFound(callback: OnOpponentFoundCallback) {
    if (!socket) throw new Error("not connected to server")
    socket.on("opponent-found", callback)
  }

  return (
    <NetworkContext.Provider
      value={{
        socket,
        isConnected,
        connect,
        disconnect,
        findOpponent,
        sendPlayerDrop,
        onOpponentDrop,
        onOpponentFound,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}
