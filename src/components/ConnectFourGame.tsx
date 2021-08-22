import { useContext, useEffect, useState } from 'react'
import { Board, GridContext, NetworkContext } from '../components'
import { useInterval } from '../hooks'
import { GameStates, GameResults } from '../types'
import GameOverBanner from './GameOverBanner'

interface Props {
  initialGameState: GameStates
  computerOpponent: boolean
}

export default function ConnectFourGame({
  computerOpponent,
  initialGameState
}: Props) {
  const net = useContext(NetworkContext)
  const { grid, dropDisc, computerMove } = useContext(GridContext)
  const [gameState, setGameState] = useState<GameStates>(initialGameState)
  const [gameResults, setGameResults] = useState<GameResults>(
    GameResults.PLAYING
  )
  const [computerMoveStart, setComputerMoveStart] = useState(false)

  // delay the computer's move
  useInterval(
    () => {
      if (!computerMoveStart) return
      console.log('computer move')
      const computerWon = computerMove()
      setComputerMoveStart(false)
      setGameState(computerWon ? GameStates.GAME_OVER : GameStates.PLAYERS_TURN)
    },
    computerOpponent ? 500 : null
  )

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
        const playerWon = dropDisc(column, 2)
        setGameState(playerWon ? GameStates.GAME_OVER : GameStates.PLAYERS_TURN)
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
    console.log('gameState: ', gameState)
  }, [gameState])

  const onBoardClick = (x: number, y: number) => {
    if (
      gameState === GameStates.GAME_OVER ||
      gameState !== GameStates.PLAYERS_TURN
    )
      return
    const playerWon = dropDisc(x, 1)
    console.log(playerWon)
    if (playerWon) {
      setGameState(GameStates.GAME_OVER)
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
      <GameOverBanner isVisible={false} />
    </div>
  )
}
