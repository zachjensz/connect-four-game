import "./App.css"
import { PlayerVersesComputer, PlayerVersesPlayer, Home } from "./pages"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { NavBar } from "./components"

const Pages = () => (

  <Switch>
    <Route path="/" exact>
      <Home />
    </Route>    
    <Route path="/computer" exact>
      <PlayerVersesComputer height={6} width={7} />
    </Route>
    <Route path="/play" exact>
      <PlayerVersesPlayer height={6} width={7} />
    </Route>
  </Switch>
)

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className="content">
          <Pages />
        </div>
      </div>
    </Router>
  )
}

export default App
