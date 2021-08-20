import "./App.css"
import { ConnectFour, Home } from "./pages"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { NavBar } from "./components"

const Pages = () => (

  <Switch>
    <Route path="/" exact>
      <Home />
    </Route>    
    <Route path="/computer" exact>
      <ConnectFour height={6} width={7} computerOpponent={true} />
    </Route>
    <Route path="/play" exact>
      <ConnectFour height={6} width={7} computerOpponent={false} />
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
