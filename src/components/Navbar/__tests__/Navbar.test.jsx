import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from '../Navbar'

describe('Navbar', () => {
  let user

  beforeEach(() => {
    // Setup user-event instance for realistic interactions
    user = userEvent.setup()
  })

  // Test Case 1: Component renders without errors
  it('should render without errors', () => {
    render(<Navbar />)

    const nav = screen.getByRole('navigation', { name: /main navigation/i })
    expect(nav).toBeInTheDocument()
  })

  // Test Case 2: All navigation links render with correct text
  it('should render all navigation links with correct text', () => {
    render(<Navbar />)

    // Since the component has both desktop and mobile versions of the links,
    // we expect to find multiple instances of each link (2 each - one for desktop, one for mobile)
    const projectsLinks = screen.getAllByRole('link', { name: /^projects$/i })
    expect(projectsLinks).toHaveLength(2)

    const aboutLinks = screen.getAllByRole('link', { name: /^about$/i })
    expect(aboutLinks).toHaveLength(2)

    const contactLinks = screen.getAllByRole('link', { name: /^contact$/i })
    expect(contactLinks).toHaveLength(2)

    // Verify each link has correct href
    projectsLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '#projects')
    })
    aboutLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '#about')
    })
    contactLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '#contact')
    })
  })

  // Test Case 3: Logo/name displays correctly
  it('should display the logo/name correctly', () => {
    render(<Navbar />)

    const logo = screen.getByText(/michael chen/i)
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveClass('text-2xl', 'md:text-3xl', 'font-bold')
  })

  // Test Case 4: Mobile menu toggle changes state (opens/closes)
  it('should toggle mobile menu state when hamburger button is clicked', async () => {
    render(<Navbar />)

    const toggleButton = screen.getByRole('button', { name: /toggle menu/i })

    // Initially, menu should be closed
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')

    // Click to open menu
    await user.click(toggleButton)
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true')

    // Mobile drawer should be visible (check for dialog role)
    const mobileMenu = screen.getByRole('dialog')
    expect(mobileMenu).toBeInTheDocument()
    expect(mobileMenu).not.toHaveClass('translate-x-full')

    // Click again to close menu
    await user.click(toggleButton)
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    expect(mobileMenu).toHaveClass('translate-x-full')
  })

  // Test Case 5: Hamburger button visible on mobile, hidden on desktop
  it('should show hamburger button on mobile and hide on desktop', () => {
    render(<Navbar />)

    const toggleButton = screen.getByRole('button', { name: /toggle menu/i })

    // Button should have md:hidden class (hidden on desktop)
    expect(toggleButton).toHaveClass('md:hidden')
  })

  // Test Case 6: Desktop nav links visible on desktop, hidden on mobile
  it('should show desktop navigation links on desktop and hide on mobile', () => {
    render(<Navbar />)

    // Find the desktop navigation container
    const nav = screen.getByRole('navigation', { name: /main navigation/i })
    const desktopNavContainer = nav.querySelector('.hidden.md\\:flex')

    // Desktop nav should have hidden md:flex classes
    expect(desktopNavContainer).toBeInTheDocument()
    expect(desktopNavContainer).toHaveClass('hidden', 'md:flex')

    // Desktop nav should contain the links
    const projectsLink = within(desktopNavContainer).getByRole('link', { name: /^projects$/i })
    const aboutLink = within(desktopNavContainer).getByRole('link', { name: /^about$/i })
    const contactLink = within(desktopNavContainer).getByRole('link', { name: /^contact$/i })

    expect(projectsLink).toBeInTheDocument()
    expect(aboutLink).toBeInTheDocument()
    expect(contactLink).toBeInTheDocument()
  })

  // Test Case 7: Click backdrop closes mobile menu
  it('should close mobile menu when backdrop is clicked', async () => {
    render(<Navbar />)

    const toggleButton = screen.getByRole('button', { name: /toggle menu/i })

    // Open the menu
    await user.click(toggleButton)
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true')

    // Find and click the backdrop
    const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/50')
    expect(backdrop).toBeInTheDocument()

    await user.click(backdrop)

    // Menu should be closed
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')

    // Backdrop should be removed
    const backdropAfterClick = document.querySelector('.fixed.inset-0.bg-black\\/50')
    expect(backdropAfterClick).not.toBeInTheDocument()
  })

  // Test Case 8: Escape key closes mobile menu
  it('should close mobile menu when Escape key is pressed', async () => {
    render(<Navbar />)

    const toggleButton = screen.getByRole('button', { name: /toggle menu/i })

    // Open the menu
    await user.click(toggleButton)
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true')

    // Press Escape key
    await user.keyboard('{Escape}')

    // Menu should be closed
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')

    // Mobile drawer should be hidden
    const mobileMenu = screen.getByRole('dialog')
    expect(mobileMenu).toHaveClass('translate-x-full')
  })

  // Test Case 9: Focus states work correctly on all interactive elements
  it('should apply correct focus states on all interactive elements', async () => {
    render(<Navbar />)

    // Verify all interactive elements have the correct focus classes
    const toggleButton = screen.getByRole('button', { name: /toggle menu/i })
    expect(toggleButton).toHaveClass('focus:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-blue-500')

    // Test desktop navigation links focus classes
    const nav = screen.getByRole('navigation', { name: /main navigation/i })
    const desktopNavContainer = nav.querySelector('.hidden.md\\:flex')
    const desktopLinks = within(desktopNavContainer).getAllByRole('link')

    for (const link of desktopLinks) {
      expect(link).toHaveClass('focus:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-blue-500')
    }

    // Test mobile menu links focus classes
    const mobileMenu = screen.getByRole('dialog')
    const mobileLinks = within(mobileMenu).getAllByRole('link')

    for (const link of mobileLinks) {
      expect(link).toHaveClass('focus:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-blue-500')
    }

    // Test that focus ring appears when tabbing to the hamburger button
    toggleButton.focus()
    expect(toggleButton).toHaveFocus()

    // Test that desktop links can receive focus
    const firstDesktopLink = desktopLinks[0]
    firstDesktopLink.focus()
    expect(firstDesktopLink).toHaveFocus()
  })
})
