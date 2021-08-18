import React from "react"
import { GridProvider, Board } from "../components"

interface Props {
  width: number
  height: number
}

export default function ConnectFour({ width, height }: Props) {
  return (
    <GridProvider width={width} height={height}>
      <Board />
    </GridProvider>
  )
}
