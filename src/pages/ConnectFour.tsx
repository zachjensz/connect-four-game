import { Board, GridProvider, NetworkProvider } from "../components"

interface Props {
  width: number
  height: number
  computerMoves: boolean
}

export default function ConnectFour({ width, height, computerMoves }: Props) {
  return (
    <NetworkProvider>
      <GridProvider width={width} height={height}>
        <Board computerPlayer={computerMoves} />
      </GridProvider>
    </NetworkProvider>
  )
}
