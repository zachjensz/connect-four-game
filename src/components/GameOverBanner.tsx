import { GameResults } from "../types"

interface Props {
  gameResult: GameResults
  localMultiplayer: boolean
}

export default function GameOverBanner({ gameResult, localMultiplayer }: Props) {  
  const player1win = localMultiplayer ? "Player 1 Wins" : "You Win!"
  const player2win = localMultiplayer ? "Player 2 Wins" : "Opponent Wins!"
  return (
    <>
      {gameResult !== GameResults.PLAYING ? (
        <section className="game-over">
          <h2 id="game-over-result">{`${
            gameResult === GameResults.WINNER_PLAYER
              ? player1win
              : gameResult === GameResults.WINNER_COMPUTER
              ? "Computer Wins!"
              : gameResult === GameResults.WINNER_OPPONENT
              ? player2win
              : "Tie Game"
          }`}</h2>
        </section>
      ) : undefined}
    </>
  )
}
