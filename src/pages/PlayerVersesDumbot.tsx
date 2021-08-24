import { ConnectFourGame, GridProvider } from "../components"
import { GameStates } from "../types"

interface Props {
  width?: number
  height?: number
}

const PlayerVersesDumbot = ({ width = 7, height = 6 }: Props) => (
  <GridProvider width={width} height={height}>
    <ConnectFourGame
      computerOpponent={true}
      initialGameState={GameStates.PLAYERS_TURN}
    />
  </GridProvider>
)

export default PlayerVersesDumbot