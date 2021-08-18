import React, { useContext } from "react"
import { GridContext } from "."

export default function Board() {
  const { height, width } = useContext(GridContext)
  return (
      <div></div>
  )
}
