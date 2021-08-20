export type Grid = number[][]
export type Player = 1 | 2
export type Opponent = "online" | "local" | "ai" | "smart-ai"
export enum GameStates {
  WAITING_FOR_OPPONENT,
  PLAYERS_TURN,
  OPPONENTS_TURN,
  GAME_OVER
}

export enum GameResults {
  PLAYING,
  WINNER_PLAYER,
  WINNER_OPPONENT,
  WINNER_COMPUTER,
  TIE_GAME,
}
