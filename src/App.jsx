import './App.css'
import Header from './components/Header/Header'
import Home from './components/Home/Home'
import About from './components/About/About'
import Works from './components/Works/Works'
import Contact from './components/Contact/Contact'

function App() {

  return (
    <div className="app">
      <Header />
      <Home />
      <About />
      <Works />
      <Contact />
    </div>
  )
}

export default App
