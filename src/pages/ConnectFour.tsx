import { Board, GridProvider, NetworkProvider } from "../components"

interface Props {
  width: number
  height: number
}

export default function ConnectFour({ width, height }: Props) {
  return (
    <NetworkProvider>
      <GridProvider width={width} height={height}>
        <Board computerPlayer={false} />
      </GridProvider>
    </NetworkProvider>
  )
}
