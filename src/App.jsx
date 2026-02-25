import Navbar from './components/Navbar'
import Hero from './components/Hero/Hero'
import Projects from './components/Projects/Projects'
import About from './components/About/About'
import Contact from './components/Contact/Contact'
import './App.css'

function App() {
  return (
    <>
      <Navbar name="Michael Chen" />
      <Hero />
      <Projects />
      <About />
      <Contact />
    </>
  )
}

export default App
