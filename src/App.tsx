import "./App.css"
import { ConnectFour } from "./pages"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

const Pages = () => (
    <ConnectFour height={6} width={7} />
)

function App() {
  return (
    <Router>
      <div className="App">
        <div className="content">
          <Switch>
            <Pages />
          </Switch>
        </div>
      </div>
    </Router>
  )
}

export default App
