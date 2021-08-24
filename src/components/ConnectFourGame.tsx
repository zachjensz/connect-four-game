import { useContext, useEffect, useState } from "react"
import { Board, GridContext } from "../components"
import { useInterval } from "../hooks"
import { ServerConnection } from "../hooks/useServerConnection"
import { getColumnHeight } from "../support/logic"
import { GameStates, GameResults } from "../types"
import GameOverBanner from "./GameOverBanner"

interface Props {
  initialGameState: GameStates
  computerOpponent?: boolean
  serverConnection?: ServerConnection
}

export default function ConnectFourGame({
  computerOpponent,
  initialGameState,
  serverConnection,
}: Props) {
  const {
    socket,
    isConnected,
    close: closeSocket,
  } = serverConnection ?? {
    socket: undefined,
    isConnected: false,
    close: () => undefined,
  }
  const { grid, dropDisc, computerMove, reset, isColumnFull } =
    useContext(GridContext)
  const [gameState, setGameState] = useState<GameStates>(initialGameState)
  const [gameResult, setGameResult] = useState<GameResults>(GameResults.PLAYING)
  const [computerMoveStart, setComputerMoveStart] = useState(false)
  const [opponentDrop, setOpponentDrop] = useState<number | null>(null)

  useEffect(() => {
    if (!socket) return

    const onOpponentFound = ({
      id,
      startingPlayer,
    }: {
      id: string
      startingPlayer: number
    }) => {
      console.log(`Opponent found:`, id, startingPlayer)
      setGameState(
        startingPlayer ? GameStates.PLAYERS_TURN : GameStates.OPPONENTS_TURN
      )
    }

    const onOpponentDrop = (column: number) => {
      setOpponentDrop(column)
    }

    socket.on("drop", onOpponentDrop)
    socket.on("opponent-found", onOpponentFound)

    return () => {
      socket.off("drop", onOpponentDrop)
      socket.off("opponent-found", onOpponentFound)
    }
  }, [socket])

  useEffect(() => {
    if (opponentDrop === null) return
    const opponentWon = dropDisc(opponentDrop, 2)
    setGameState(opponentWon ? GameStates.GAME_OVER : GameStates.PLAYERS_TURN)
    if (opponentWon) setGameResult(GameResults.WINNER_OPPONENT)
    setOpponentDrop(null)
  }, [opponentDrop])

  useEffect(() => {
    reset()
  }, [])

  useEffect(() => {
    if (computerOpponent || !socket) return
    if (socket && isConnected) {
      // Find Opponent
      socket.emit("find-opponent")
    }
  }, [isConnected])

  useEffect(() => {
    console.log("gameState changed: ", gameState)
  }, [gameState])

  useEffect(() => {
    console.log("gameResults changed: ", gameResult)
  }, [gameResult])

  // delay the computer's move
  useInterval(
    () => {
      if (!computerMoveStart) return
      const computerWon = computerMove()
      setComputerMoveStart(false)
      setGameState(computerWon ? GameStates.GAME_OVER : GameStates.PLAYERS_TURN)
      if (computerWon) setGameResult(GameResults.WINNER_COMPUTER)
    },
    computerOpponent ? 500 : null
  )

  const onBoardClick = (x: number, y: number) => {
    if (gameState === GameStates.GAME_OVER) {
      reset()
      setGameState(GameStates.PLAYERS_TURN)
      setGameResult(GameResults.PLAYING)
      return
    }

    if (isColumnFull(x)) return
    if (gameState !== GameStates.PLAYERS_TURN && socket) return
    if (socket) socket.emit("drop", x)
    const playerWon = dropDisc(x, gameState === GameStates.PLAYERS_TURN ? 1 : 2)
    if (playerWon) {
      setGameState(GameStates.GAME_OVER)
      setGameResult(GameResults.WINNER_PLAYER)
      return
    }
    setGameState(
      gameState === GameStates.PLAYERS_TURN
        ? GameStates.OPPONENTS_TURN
        : GameStates.PLAYERS_TURN
    )
    if (computerOpponent) setComputerMoveStart(true)
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
