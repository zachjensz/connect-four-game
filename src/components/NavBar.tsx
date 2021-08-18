import { Link } from '.'

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>ConnectFour</h1>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/play">Play</Link>
            </div>
        </nav>
    )
}

export default Navbar