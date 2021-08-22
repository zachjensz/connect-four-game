import "./App.css"
import {
  Home,
  MultiplayerLocal,
  MultiplayerOnline,
  PlayerVersesDumbot,
  PlayerVersesSmartbot,
} from "./pages"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { NavBar } from "./components"

const Pages = () => (
  <Switch>
    <Route path="/" component={Home} exact />
    <Route path="/dumbot" component={PlayerVersesDumbot} exact />
    <Route path="/smartbot" component={PlayerVersesSmartbot} exact />
    <Route path="/multiplayer" component={MultiplayerOnline} exact />
    <Route path="/multiplayer-local" component={MultiplayerLocal} exact />
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
