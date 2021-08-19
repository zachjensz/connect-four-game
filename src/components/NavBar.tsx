import { NavLink } from "."

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>ConnectFour</h1>
      <div className="links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/computer">Play Computer</NavLink>
        <NavLink to="/play">Play Online</NavLink>
      </div>
    </nav>
  )
}

export default Navbar
