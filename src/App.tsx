import "./App.css"
import { PlayerVersesComputer, PlayerVersesPlayer, Home } from "./pages"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { NavBar } from "./components"

const Pages = () => (
  <Switch>
    <Route path="/" component={Home} exact />
    <Route path="/computer" component={PlayerVersesComputer} exact />
    <Route path="/play" component={PlayerVersesPlayer} exact />
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
