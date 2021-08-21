import {
  GridProvider,
  NetworkProvider,
} from "../components"
import { ConnectFourGame } from "../components"

interface Props {
  width?: number
  height?: number
}

export default ({ width, height }: Props) => (
  <NetworkProvider>
    <GridProvider
      width={width ?? 7}
      height={height ?? 6}
      computerOpponent={false}
    >
      <ConnectFourGame computerOpponent={false} />
    </GridProvider>
  </NetworkProvider>
)
