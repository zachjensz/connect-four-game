import { ConnectFourGame, GridProvider, NetworkProvider } from "../components"
import { GameStates } from "../types"

interface Props {
  width?: number
  height?: number
}

export default ({ width = 7, height = 6 }: Props) => (
  <GridProvider width={width} height={height}>
    <ConnectFourGame
      computerOpponent={true}
      initialGameState={GameStates.PLAYERS_TURN}
    />
  </GridProvider>
)
