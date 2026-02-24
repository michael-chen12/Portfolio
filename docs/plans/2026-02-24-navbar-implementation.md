# Navbar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a professional, minimal navigation bar with fixed positioning, smooth scrolling, active link highlighting, and responsive mobile menu.

**Architecture:** Single React component using Intersection Observer API for scroll tracking, useState for mobile menu state, and Tailwind CSS for styling. No external dependencies. Component accepts name prop and manages all navigation state internally.

**Tech Stack:** React 19, Intersection Observer API, Tailwind CSS 4, native smooth scrolling

---

## Task 1: Update App Structure for Navigation

**Files:**
- Modify: `src/App.jsx`

**Step 1: Add IDs to sections and home section**

Update `src/App.jsx` to add section IDs and create a home section:

```jsx
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
```

**Step 2: Add smooth scroll behavior to CSS**

Modify `src/index.css` to add smooth scrolling:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}
```

**Step 3: Commit**

```bash
git add src/App.jsx src/index.css
git commit -m "feat: add section IDs and smooth scroll behavior

- Add home section with welcome content
- Add IDs to all sections for navigation
- Enable CSS smooth scroll behavior
- Pass name prop to Navbar component

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Create Navbar Component Structure

**Files:**
- Create: `src/components/Navbar/Navbar.jsx`
- Create: `src/components/Navbar/index.js`

**Step 1: Create component directory**

```bash
mkdir -p src/components/Navbar
```

**Step 2: Create basic Navbar component**

Create `src/components/Navbar/Navbar.jsx`:

```jsx
import { useState, useEffect } from 'react'

function Navbar({ name = 'Your Name' }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ]

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
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Name */}
          <div className="flex-shrink-0">
            <span className="text-xl font-semibold text-gray-900">{name}</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-gray-700 hover:text-blue-600 transition-colors ${
                  activeSection === link.id ? 'text-blue-600 font-medium' : ''
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded p-2"
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
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left px-3 py-3 text-base font-medium rounded-md hover:bg-gray-100 transition-colors ${
                activeSection === link.id
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700'
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
```

**Step 3: Create barrel export**

Create `src/components/Navbar/index.js`:

```js
export { default } from './Navbar'
```

**Step 4: Commit**

```bash
git add src/components/Navbar/
git commit -m "feat: create Navbar component with mobile menu

- Add desktop horizontal navigation
- Add mobile hamburger menu with toggle
- Add name prop for branding
- Include ARIA labels for accessibility
- Style with Tailwind CSS

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Add Intersection Observer for Active Section Tracking

**Files:**
- Modify: `src/components/Navbar/Navbar.jsx`

**Step 1: Add Intersection Observer useEffect**

Add this `useEffect` hook inside the `Navbar` component, after the state declarations:

```jsx
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
  const sections = ['home', 'projects', 'about', 'contact']
  sections.forEach((sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      observer.observe(element)
    }
  })

  // Cleanup
  return () => {
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        observer.unobserve(element)
      }
    })
  }
}, [])
```

**Step 2: Verify the implementation**

The complete `Navbar.jsx` should now have:
- State for `isMobileMenuOpen` and `activeSection`
- `useEffect` with Intersection Observer
- `toggleMobileMenu` and `handleNavClick` functions
- Desktop and mobile navigation rendering with active state highlighting

**Step 3: Commit**

```bash
git add src/components/Navbar/Navbar.jsx
git commit -m "feat: add Intersection Observer for active link tracking

- Observe all sections with 50% threshold
- Update active section state when section is in view
- Highlight active link in navigation
- Clean up observers on unmount

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Add Keyboard Navigation Support

**Files:**
- Modify: `src/components/Navbar/Navbar.jsx`

**Step 1: Add Escape key handler for mobile menu**

Add this `useEffect` after the Intersection Observer effect:

```jsx
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
```

**Step 2: Verify focus styles are visible**

Ensure the hamburger button and navigation links have visible focus rings (already included in the Tailwind classes: `focus:outline-none focus:ring-2 focus:ring-blue-600`).

**Step 3: Commit**

```bash
git add src/components/Navbar/Navbar.jsx
git commit -m "feat: add keyboard navigation support

- Add Escape key to close mobile menu
- Maintain visible focus rings for keyboard users
- Improve accessibility compliance

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Manual Testing and Final Adjustments

**Step 1: Start development server**

```bash
npm run dev
```

Expected: Server starts at http://localhost:5173

**Step 2: Test desktop navigation**

Manual testing checklist:
- [ ] Navbar is fixed at top
- [ ] "Michael Chen" appears on left
- [ ] Four links appear horizontally on desktop (≥768px)
- [ ] Clicking links scrolls smoothly to sections
- [ ] Active link highlights correctly as you scroll
- [ ] Focus rings visible when tabbing through links

**Step 3: Test mobile navigation**

Manual testing checklist (resize browser to <768px):
- [ ] Hamburger menu appears instead of links
- [ ] Clicking hamburger opens/closes menu
- [ ] Mobile menu shows links vertically
- [ ] Clicking link scrolls to section and closes menu
- [ ] Escape key closes mobile menu
- [ ] Active link highlights in mobile menu

**Step 4: Make any necessary styling adjustments**

If needed, adjust:
- Colors (currently blue-600 for active state)
- Spacing or padding
- Shadow depth
- Font sizes

**Step 5: Final commit if changes made**

```bash
git add src/components/Navbar/Navbar.jsx
git commit -m "style: adjust Navbar visual appearance

[Describe specific changes made]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Verify ESLint Compliance

**Step 1: Run ESLint**

```bash
npm run lint
```

Expected: No errors for Navbar component files

**Step 2: Fix any linting issues**

If there are warnings or errors, fix them according to the project's ESLint rules.

**Step 3: Commit lint fixes if needed**

```bash
git add src/components/Navbar/
git commit -m "chore: fix ESLint issues in Navbar

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Success Criteria Verification

Before considering this complete, verify:

- [x] Fixed navigation bar stays visible on scroll
- [x] "Michael Chen" branding displayed on left
- [x] Four navigation links: Home, Projects, About, Contact
- [x] Active link highlights based on scroll position
- [x] Smooth scrolling to sections on link click
- [x] Responsive hamburger menu on mobile
- [x] Mobile menu opens/closes smoothly
- [x] Keyboard accessible navigation (Tab, Enter, Escape)
- [x] Clean, minimal, professional appearance
- [x] ESLint passes

---

## Notes

- No tests required per user request
- All styling uses Tailwind CSS
- Intersection Observer handles scroll tracking (no scroll listeners)
- Native smooth scroll via CSS and scrollIntoView
- Component is self-contained with no external dependencies
