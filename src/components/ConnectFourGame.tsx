import { useContext, useEffect, useRef, useState } from "react"
import { Board, GridContext, NetworkContext } from "../components"
import { useInterval } from "../hooks"
import { GameStates, GameResults } from "../types"

interface Props {
  initialGameState: GameStates
  computerOpponent: boolean
}

export default function ConnectFourGame({
  computerOpponent,
  initialGameState,
}: Props) {
  const net = useContext(NetworkContext)
  const { dropDisc, computerMove } = useContext(GridContext)
  const [gameState, setGameState] = useState<GameStates>(initialGameState)
  const [gameResults, setGameResults] = useState<GameResults>(
    GameResults.PLAYING
  )
  const [computerMoveStart, setComputerMoveStart] = useState(false)

  // delay the computer's move
  useInterval(() => {
    if (!computerMoveStart) return
    computerMove()
    setComputerMoveStart(false)
    setGameState(GameStates.PLAYERS_TURN)
  }, computerOpponent ? 500 : null)

  useEffect(() => {
    return () => {
      // disconnect when component unloads
      net.disconnect()
    }
  }, [])

  useEffect(() => {
    if (computerOpponent) {
      net.disconnect()
    } else {
      net.connect()
    }
  }, [computerOpponent])

  useEffect(() => {
    if (computerOpponent) return
    if (net.isConnected) {
      console.log(`Connected to server as ${net.socket?.id}`)
      net.onOpponentDrop((column) => {
        console.log(`Opponent drop: ${column}`)
        dropDisc(column, 2)
        setGameState(GameStates.PLAYERS_TURN)
      })
      net.onOpponentFound(({ id, startingPlayer }) => {
        console.log(`Opponent found:`, id, startingPlayer)
        setGameState(
          startingPlayer ? GameStates.PLAYERS_TURN : GameStates.OPPONENTS_TURN
        )
      })
      net.findOpponent()
    }
    //console.log(`Connection state change ${net.isConnected}`)
  }, [net.isConnected])

  useEffect(() => {
    console.log("gameState: ", gameState)
  }, [gameState])

  const onBoardClick = (x: number, y: number) => {
    if (gameState !== GameStates.PLAYERS_TURN) return
    dropDisc(x, 1)
    if (!computerOpponent) {
      net.sendPlayerDrop(x)
    } else {
      setComputerMoveStart(true)
    }
    setGameState(GameStates.OPPONENTS_TURN)
  }

  return (
    <div>
      <Board onClick={onBoardClick} />
      {gameState === GameStates.WAITING_FOR_OPPONENT ? (
        <div>Waiting for opponent...</div>
      ) : undefined}
    </div>
  )
}
