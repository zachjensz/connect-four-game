import React, { createContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { DefaultEventsMap } from "socket.io-client/build/typed-events"
import { Player } from "../types"

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
  lookingForOpponent: boolean
  turn: Player | null
  connect: (serverUrl?: string) => void
  disconnect: () => void
  findOpponent: () => void
  sendPlayerDrop: (column: number) => void
  onOpponentDrop: (callback: OnDropCallback) => void
  onOpponentFound: (callback: OnOpponentFoundCallback) => void
}

export const NetworkContext = createContext<ContextType>({
  isConnected: false,
  lookingForOpponent: false,
  turn: null,
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
  const [lookingForOpponent, setLookingForOpponent] = useState(false)
  const [turn, setTurn] = useState<Player | null>(null)

  useEffect(() => {
    return () => {
      if (socket?.connected) socket.disconnect()
    }
  }, [])

  function connect(serverUrl = "http://localhost:5000") {
    const sock = io(serverUrl)
    sock.on("connect", () => {
      setIsConnected(true)
      setLookingForOpponent(false)
    })
    sock.on("disconnect", () => {
      setIsConnected(false)
      setLookingForOpponent(false)
    })
    setSocket(sock)
  }

  function disconnect() {
    if (socket?.connected) socket.disconnect()
    setSocket(null)
  }

  function findOpponent() {
    if (!socket) throw new Error("not connected to server")
    if (lookingForOpponent) return
    console.log("findOpponent request")
    socket.emit("find-opponent")
    setLookingForOpponent(true)
  }

  function sendPlayerDrop(column: number) {
    if (!socket) throw new Error("not connected to server")
    if (turn === 1) {
      socket.emit("drop", column)
      console.log(`emit ${column}`)
      setTurn(2)
    }
  }

  function onOpponentDrop(callback: OnDropCallback) {
    if (!socket) throw new Error("not connected to server")
    socket.on("drop", (props) => {
      setTurn(1)
      callback(props)
    })    
  }

  function onOpponentFound(callback: OnOpponentFoundCallback) {
    if (!socket) throw new Error("not connected to server")
    socket.on("opponent-found", (props) => {
      setTurn(props.startingPlayer ? 1 : 2)
      setLookingForOpponent(false)
      callback(props)
    })
  }

  return (
    <NetworkContext.Provider
      value={{
        socket,
        isConnected,
        lookingForOpponent,
        turn,
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
