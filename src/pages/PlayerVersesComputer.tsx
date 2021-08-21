import { ConnectFourGame, GridProvider, NetworkProvider } from "../components"
import { GameStates, GameResults, Player } from "../types"

interface Props {
  width?: number
  height?: number
}

export default ({ width = 7, height = 6 }: Props) => (
  <GridProvider width={width} height={height} computerOpponent={true}>
    <ConnectFourGame
      computerOpponent={true}
      initialGameState={GameStates.PLAYERS_TURN}
    />
  </GridProvider>
)
