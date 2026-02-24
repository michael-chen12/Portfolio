import { useState, useEffect } from 'react'
import './Navbar.css'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMobileMenuOpen])

  return (
    <nav aria-label="Main navigation" className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200/20 shadow-sm">
      <div className="px-6 md:px-12 py-4">
        {/* Desktop and Mobile Container */}
        <div className="flex items-center justify-between">
          {/* Logo/Name */}
          <div className="text-2xl md:text-3xl font-bold">
            Michael Chen
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#projects" className="nav-link text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded">
              Projects
            </a>
            <a href="#about" className="nav-link text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded">
              About
            </a>
            <a href="#contact" className="nav-link text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded">
              Contact
            </a>
          </div>

          {/* Mobile Hamburger Button - Hidden on desktop */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            className="md:hidden w-11 h-11 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
          >
            {/* Hamburger Icon */}
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-0.5 w-full bg-current transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block h-0.5 w-full bg-current transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-full bg-current transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Backdrop Overlay - Only visible when mobile menu is open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 transition-opacity duration-300 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Mobile Drawer - Slides in from right */}
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed top-0 right-0 h-screen w-64 backdrop-blur-lg bg-white/80 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6 p-8 pt-20">
          <a
            href="#projects"
            onClick={() => setIsMobileMenuOpen(false)}
            className="nav-link text-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
          >
            Projects
          </a>
          <a
            href="#about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="nav-link text-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
          >
            About
          </a>
          <a
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="nav-link text-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  )
}
