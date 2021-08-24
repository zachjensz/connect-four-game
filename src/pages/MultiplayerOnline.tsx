import { ConnectFourGame, GridProvider } from "../components"
import { useServerConnection } from "../hooks"
import { GameStates } from "../types"

interface Props {
  width?: number
  height?: number
}

const MultiplayerOnline = ({ width = 7, height = 6 }: Props) => {
  const serverConnection = useServerConnection('http://localhost:5000/')

  return (
    <GridProvider width={width} height={height}>
      <ConnectFourGame
        serverConnection={serverConnection}
        initialGameState={GameStates.WAITING_FOR_OPPONENT}
      />
    </GridProvider>
  )
}

export default MultiplayerOnline