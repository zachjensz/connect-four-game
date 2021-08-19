import { NavLink } from "."

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>ConnectFour</h1>
      <div className="links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/play">Play</NavLink>
      </div>
    </nav>
  )
}

export default Navbar
