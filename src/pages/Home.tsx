import React from "react"
import { Page } from "../components"

export default function Home() {
  return (
    <section className="title">
      <div className="gamemode-select">
        <button id="dumbot">Dumbot</button>
        <button id="smartbot">Smartbot</button>
        <button id="terminator">Terminator</button>
        <br />
        <button id="localMultiplayer">Local Multiplayer</button>
        <button id="onlineMultiplayer">Online Multiplayer</button>
      </div>
    </section>
  )
}
