export type Grid = number[][]
export type Player = 1 | 2
export type Opponent = "online" | "local" | "ai" | "smart-ai"
export enum GameStates {
    PLAYING,
    WINNER_PLAYER,
    WINNER_OPPONENT,
    WINNER_COMPUTER,
    TIE_GAME
  }
  