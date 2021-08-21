import { ConnectFourGame, GridProvider, NetworkProvider } from "../components"
import { GameStates, GameResults, Player } from "../types"

interface Props {
  width?: number
  height?: number
}

export default ({ width, height }: Props) => (
  <GridProvider width={width ?? 7} height={height ?? 6} computerOpponent={true}>
    <ConnectFourGame
      computerOpponent={true}
      initialGameState={GameStates.PLAYERS_TURN}
    />
  </GridProvider>
)
