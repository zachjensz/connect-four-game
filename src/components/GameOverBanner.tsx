import { GameResults } from "../types"

interface Props {
  gameResult: GameResults
}

export default function GameOverBanner({ gameResult }: Props) {  
  return (
    <>
      {gameResult !== GameResults.PLAYING ? (
        <section className="game-over">
          <h2 id="game-over-result">{`${
            gameResult === GameResults.WINNER_PLAYER
              ? "You Win!"
              : gameResult === GameResults.WINNER_COMPUTER
              ? "Computer Wins!"
              : gameResult === GameResults.WINNER_OPPONENT
              ? "Opponent Wins!"
              : "Tie Game"
          }`}</h2>
        </section>
      ) : undefined}
    </>
  )
}
