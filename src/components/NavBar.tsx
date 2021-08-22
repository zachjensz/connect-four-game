import { NavLink } from "."

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>ConnectFour</h1>
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
