import React from "react"
import { Player } from "../types"

interface Props {
  isVisible: boolean
  winner?: Player
}

export default function GameOverBanner({ isVisible, winner }: Props) {
  return (
    <>
      {isVisible ? (
        <section className="game-over">
          <h2 id="game-over-result">{`${
            winner === 1
              ? "You Win!"
              : winner === 2
              ? "Computer Wins!"
              : "Tie Game"
          }`}</h2>
        </section>
      ) : undefined}
    </>
  )
}
