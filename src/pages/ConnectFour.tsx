import { useContext, useEffect } from "react"
import {
  Board,
  GridProvider,
  NetworkContext,
  NetworkProvider,
} from "../components"

interface Props {
  width: number
  height: number
  computerOpponent: boolean
}

function ConnectFourGame({ width, height, computerOpponent }: Props) {
  const net = useContext(NetworkContext)

  useEffect(() => {
    return () => {
      // disconnect when component unloads
      net.disconnect()
    }
  }, [])

  useEffect(() => {
    if (computerOpponent) {
      console.log("Using computer opponent")
      if (net.isConnected)
        net.disconnect()
    }
    else {
      net.connect()
      console.log("Looking for human opponent")
    }
  }, [computerOpponent])

  useEffect(() => {
    if (net.isConnected) {
      console.log(`Connected to server as ${net.socket?.id}`)
      net.onOpponentDrop((column) => {
        console.log(`Opponent drop: ${column}`)
      })
      net.onOpponentFound((id) => {
        console.log(`Opponent found:`, id)
      })
      net.findOpponent()
    }
    //console.log(`Connection state change ${net.isConnected}`)
  }, [net.isConnected])

  return (
    <div>
      <GridProvider
        width={width}
        height={height}
        computerOpponent={computerOpponent}
      >
        <Board computerPlayer={computerOpponent} />
      </GridProvider>
      {net.lookingForOpponent ? <div>Waiting for opponent...</div> : undefined}
    </div>
  )
}

export default ({ width, height, computerOpponent }: Props) => (
  <NetworkProvider>
    <ConnectFourGame
      width={width}
      height={height}
      computerOpponent={computerOpponent}
    />
  </NetworkProvider>
)
