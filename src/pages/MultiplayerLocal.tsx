import { ConnectFourGame, GridProvider } from "../components"
import { GameStates } from "../types"

interface Props {
  width?: number
  height?: number
}

const MultiplayerLocal = ({ width = 7, height = 6 }: Props) => (
  <GridProvider width={width} height={height}>
    <ConnectFourGame
      computerOpponent={false}
      initialGameState={GameStates.PLAYERS_TURN}
    />
  </GridProvider>
)

export default MultiplayerLocal
