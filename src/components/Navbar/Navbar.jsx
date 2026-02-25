import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

function Navbar({ name = 'Your Name' }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all sections
    const sections = NAV_LINKS.map(link => link.id)
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        observer.observe(element)
      }
    })

    // Cleanup
    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleNavClick = (sectionId) => {
    setIsMobileMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-soft z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Name */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-display font-bold text-black">{name}</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`relative text-sm font-semibold transition-colors cursor-pointer group ${
                  activeSection === link.id ? 'text-teal' : 'text-gray-700 hover:text-teal'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 bg-teal transform origin-left transition-transform duration-300 ${
                    activeSection === link.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="text-gray-700 hover:text-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-lg p-2 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="px-6 pt-2 pb-4 space-y-1 bg-white/95 backdrop-blur-md shadow-lg">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left px-4 py-3 text-base font-semibold rounded-xl transition-all cursor-pointer ${
                activeSection === link.id
                  ? 'text-white bg-teal'
                  : 'text-gray-700 hover:bg-teal/10 hover:text-teal'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
