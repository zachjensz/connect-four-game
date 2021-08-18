import React from "react"
import { Link } from "react-router-dom"
import { Page } from "../components"

export default function Home() {
  return (
    <section className="title">
      <div className="gamemode-select">
        <button id="dumbot">
          <Link to="play">Dumbot</Link>
        </button>
        <button id="smartbot">Smartbot</button>
        <button id="terminator">Terminator</button>
        <br />
        <button id="localMultiplayer">Local Multiplayer</button>
        <button id="onlineMultiplayer">
          <Link to="play">Online Multiplayer</Link>
        </button>
      </div>
    </section>
  )
}
