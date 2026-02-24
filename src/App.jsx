import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <>
      <Navbar name="Michael Chen" />

      <section id="home" className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold">Welcome</h1>
      </section>

      <section id="projects" className="min-h-screen flex items-center justify-center">
        <h2 className="text-3xl font-bold">Projects</h2>
      </section>

      <section id="about" className="min-h-screen flex items-center justify-center">
        <h2 className="text-3xl font-bold">About</h2>
      </section>

      <section id="contact" className="min-h-screen flex items-center justify-center">
        <h2 className="text-3xl font-bold">Contact</h2>
      </section>
    </>
  )
}

export default App
