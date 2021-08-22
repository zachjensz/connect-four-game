import { useContext, useEffect, useState } from "react"
import { Board, GridContext, NetworkContext } from "../components"
import { useInterval } from "../hooks"
import { GameStates, GameResults } from "../types"
import GameOverBanner from "./GameOverBanner"

interface Props {
  initialGameState: GameStates
  computerOpponent: boolean
}

export default function ConnectFourGame({
  computerOpponent,
  initialGameState,
}: Props) {
  const net = useContext(NetworkContext)
  const { grid, dropDisc, computerMove, reset } = useContext(GridContext)
  const [gameState, setGameState] = useState<GameStates>(initialGameState)
  const [gameResult, setGameResult] = useState<GameResults>(
    GameResults.PLAYING
  )
  const [computerMoveStart, setComputerMoveStart] = useState(false)

  // delay the computer's move
  useInterval(
    () => {
      if (!computerMoveStart) return
      console.log("computer move")
      const computerWon = computerMove()
      setComputerMoveStart(false)
      setGameState(computerWon ? GameStates.GAME_OVER : GameStates.PLAYERS_TURN)
      if (computerWon) setGameResult(GameResults.WINNER_COMPUTER)
    },
    computerOpponent ? 500 : null
  )

  useEffect(() => {
    reset()
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
        const opponentWon = dropDisc(column, 2)
        setGameState(
          opponentWon ? GameStates.GAME_OVER : GameStates.PLAYERS_TURN
        )
        if (opponentWon) setGameResult(GameResults.WINNER_OPPONENT)
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
    console.log("gameState changed: ", gameState)
  }, [gameState])

  useEffect(() => {
    console.log("gameResults changed: ", gameResult)
  }, [gameResult])

  const onBoardClick = (x: number, y: number) => {
    if (gameState === GameStates.GAME_OVER) {
      reset()
      setGameState(GameStates.PLAYERS_TURN)
      setGameResult(GameResults.PLAYING)
      return
    }
    if (gameState !== GameStates.PLAYERS_TURN)
      return
    const playerWon = dropDisc(x, 1)
    if (playerWon) {
      setGameState(GameStates.GAME_OVER)
      setGameResult(GameResults.WINNER_PLAYER)
      return
    }
    if (!computerOpponent) {
      net.sendPlayerDrop(x)
    } else {
      setComputerMoveStart(true)
    }
    setGameState(GameStates.OPPONENTS_TURN)
  }

  return (
    <div>
      <Board onClick={onBoardClick} grid={grid} />
      {gameState === GameStates.WAITING_FOR_OPPONENT ? (
        <div>Waiting for opponent...</div>
      ) : undefined}
      <GameOverBanner gameResult={gameResult} />
    </div>
  )
}
