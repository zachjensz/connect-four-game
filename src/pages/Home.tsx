import { NavLink } from "../components"
import { ReactComponent as Dumbot } from '../assets/Dumbot.svg'
import { ReactComponent as Smartbot } from '../assets/Smartbot.svg'
import { ReactComponent as Online } from '../assets/Online.svg'
import { ReactComponent as Local } from '../assets/Local.svg'

export function Home() {
  return (
    <section className="title">
      <div className="gamemode-select">
        <NavLink id="dumbot" to="dumbot">
          <Dumbot/>
        </NavLink>
        <NavLink id="smartbot" to="smartbot">
          <Smartbot />
        </NavLink>
        <br />
        <NavLink id="localMultiplayer" to="multiplayer-local">
          <Local />
        </NavLink>
        <NavLink id="onlineMultiplayer" to="multiplayer">
          <Online />
        </NavLink>
      </div>
    </section>
  )
}

export default Home
