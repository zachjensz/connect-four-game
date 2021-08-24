import { useCallback, useContext, useEffect, useState } from "react"
import { Board, GridContext, NetworkContext } from "../components"
import { useInterval } from "../hooks"
import { GameStates, GameResults } from "../types"
import GameOverBanner from "./GameOverBanner"

interface Props {
  initialGameState: GameStates
  computerOpponent: boolean
  offline?: boolean
}

export default function ConnectFourGame({
  computerOpponent,
  initialGameState,
  offline,
}: Props) {
  const net = useContext(NetworkContext)
  const { grid, dropDisc, computerMove, reset } = useContext(GridContext)
  const [gameState, setGameState] = useState<GameStates>(initialGameState)
  const [gameResult, setGameResult] = useState<GameResults>(GameResults.PLAYING)
  const [computerMoveStart, setComputerMoveStart] = useState(false)

  useEffect(() => {
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
      console.log(`Opponent drop: ${column}`)
      console.log(grid)
      const opponentWon = dropDisc(column, 2)
      setGameState(opponentWon ? GameStates.GAME_OVER : GameStates.PLAYERS_TURN)
      if (opponentWon) setGameResult(GameResults.WINNER_OPPONENT)
    }

    net.socket?.on("drop", onOpponentDrop)
    net.socket?.on("opponent-found", onOpponentFound)

    return () => {
      net.socket?.off("drop", onOpponentDrop)
      net.socket?.off("opponent-found", onOpponentFound)
    }
  }, [net.socket])

  useEffect(() => {
    reset()
    return () => {
      // disconnect when component unloads
      net.close()
    }
  }, [])

  useEffect(() => {
    if (computerOpponent || offline) return
    if (net.socket && net.isConnected) {
      console.log(`Connected to server as ${net.socket?.id}`)
      // Find Opponent
      net.socket.emit("find-opponent")
    }
  }, [net.isConnected])

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
      console.log("computer move")
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
    if (gameState !== GameStates.PLAYERS_TURN && !offline) return
    const playerWon = dropDisc(x, gameState === GameStates.PLAYERS_TURN ? 1 : 2)
    if (playerWon) {
      setGameState(GameStates.GAME_OVER)
      setGameResult(GameResults.WINNER_PLAYER)
      return
    }
  
    if (computerOpponent) setComputerMoveStart(true)
    else if (!offline) net.socket?.emit("drop", x)
    setGameState(
      gameState === GameStates.PLAYERS_TURN
        ? GameStates.OPPONENTS_TURN
        : GameStates.PLAYERS_TURN
    )
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
