import { NavLink } from "."
import { ReactComponent as Logo } from '../assets/Logo.svg'

const Navbar = () => {
  return (
    <nav className="navbar">
      <Logo />
      <div className="links">
        <NavLink to="/">[ Home ]</NavLink>
        <NavLink to="/dumbot">[ Play Dumbot ]</NavLink>
        <NavLink to="/smartbot">[ Play Smartbot ]</NavLink>
        <NavLink to="/multiplayer">[ Play Online ]</NavLink>
        <NavLink to="/multiplayer-local">[ Multiplayer Locally ]</NavLink>
      </div>
    </nav>
  )
}

export default Navbar
