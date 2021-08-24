import { useEffect, useState } from "react"
//@ts-ignore
import { io, Socket } from "socket.io-client"
//@ts-ignore
import { DefaultEventsMap } from "socket.io-client/build/typed-events"

type WebSocket = Socket<DefaultEventsMap, DefaultEventsMap>

export type ServerConnection = {
    socket: WebSocket,
    isConnected: boolean,
    close: () => any
}

export function useServerConnection(serverUrl: string) {
  const [socket] = useState<WebSocket>(io(serverUrl))
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!socket) return
    socket.on("connect", () => {
      console.log(`Connected to server as ${socket.id}`)
      setIsConnected(true)
    })
    socket.on("disconnect", () => {
      console.log('Disconnected from server')
      setIsConnected(false)
    })
    return () => {      
      socket.close()
    }
  }, [socket])

  return { socket, isConnected, close: socket.close } as ServerConnection
}
