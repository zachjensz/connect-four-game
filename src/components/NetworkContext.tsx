import React, { createContext, useEffect, useState } from "react"
//@ts-ignore
import { io, Socket } from "socket.io-client"
//@ts-ignore
import { DefaultEventsMap } from "socket.io-client/build/typed-events"

type WebSocket = Socket<DefaultEventsMap, DefaultEventsMap>

interface Props {
  serverUrl: string
  children: JSX.Element
}

type ContextType = {
  socket?: WebSocket | null
  isConnected: boolean
  close: () => void
}

export const NetworkContext = createContext<ContextType>({
  isConnected: false,
  close: () => undefined,
})

export function NetworkProvider({ serverUrl, children }: Props) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const newSocket = io(serverUrl)
    newSocket.on("connect", () => {
      setIsConnected(true)
    })
    newSocket.on("disconnect", () => {
      setIsConnected(false)
    })
    setSocket(newSocket)
    return () => {
      newSocket.close()
    }
  }, [setSocket])

  function close() {
    if (socket?.connected) socket.close()
    setSocket(null)
  }

  return (
    <NetworkContext.Provider
      value={{
        socket,
        isConnected,
        close,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}
