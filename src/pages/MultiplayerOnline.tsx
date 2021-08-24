import { GridProvider, NetworkProvider } from "../components"
import { ConnectFourGame } from "../components"
import { GameStates } from "../types"

interface Props {
  width?: number
  height?: number
}

export default ({ width = 7, height = 6 }: Props) => (
  <GridProvider width={width} height={height}>
    <NetworkProvider serverUrl="http://localhost:5000">
      <ConnectFourGame
        computerOpponent={false}
        initialGameState={GameStates.WAITING_FOR_OPPONENT}
      />
    </NetworkProvider>
  </GridProvider>
)
