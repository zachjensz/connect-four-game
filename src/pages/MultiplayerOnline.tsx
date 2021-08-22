import { GridProvider, NetworkProvider } from "../components"
import { ConnectFourGame } from "../components"
import { GameStates } from "../types"

interface Props {
  width?: number
  height?: number
}

export default ({ width = 7, height = 6 }: Props) => (
  <NetworkProvider>
    <GridProvider width={width} height={height}>
      <ConnectFourGame
        computerOpponent={false}
        initialGameState={GameStates.WAITING_FOR_OPPONENT}
      />
    </GridProvider>
  </NetworkProvider>
)
