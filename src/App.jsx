import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <>
      <Navbar />

      <section id="projects" className="min-h-screen">
        Projects
      </section>

      <section id="about" className="min-h-screen">
        About
      </section>

      <section id="contact" className="min-h-screen">
        Contact
      </section>
    </>
  )
}

export default App
