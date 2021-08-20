import { useContext, useEffect } from "react"
import {
  Board,
  GridContext,
  GridProvider,
  NetworkContext,
  NetworkProvider,
} from "../components"

interface Props {
  width?: number
  height?: number
  computerOpponent: boolean
}

function ConnectFourGame({ computerOpponent }: Props) {
  const net = useContext(NetworkContext)
  const { dropDisc } = useContext(GridContext)

  useEffect(() => {
    return () => {
      // disconnect when component unloads
      net.disconnect()
    }
  }, [])

  useEffect(() => {
    if (computerOpponent) {
      console.log("Using computer opponent")
      if (net.isConnected) net.disconnect()
    } else {
      net.connect()
      console.log("Looking for human opponent")
    }
  }, [computerOpponent])

  useEffect(() => {
    if (net.isConnected) {
      console.log(`Connected to server as ${net.socket?.id}`)
      net.onOpponentDrop((column) => {
        console.log(`Opponent drop: ${column}`)
        dropDisc(column, 2)        
      })
      net.onOpponentFound(({ id, startingPlayer }) => {
        console.log(`Opponent found:`, id, startingPlayer)
      })
      net.findOpponent()
    }
    //console.log(`Connection state change ${net.isConnected}`)
  }, [net.isConnected])

  useEffect(() => {
    console.log("turn: ", net.turn)
  }, [net.turn])

  return (
    <div>
      <Board computerPlayer={computerOpponent} />
      {net.lookingForOpponent ? <div>Waiting for opponent...</div> : undefined}
    </div>
  )
}

export default ({ width, height, computerOpponent }: Props) => (
  <NetworkProvider>
    <GridProvider
      width={width ?? 7}
      height={height ?? 6}
      computerOpponent={computerOpponent}
    >
      <ConnectFourGame computerOpponent={computerOpponent} />
    </GridProvider>
  </NetworkProvider>
)
