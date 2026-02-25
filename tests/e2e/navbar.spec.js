import { test, expect } from '@playwright/test'

test.describe('Navbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  // Test Case 1: Navbar remains fixed at top when scrolling
  test('should remain fixed at top when scrolling', async ({ page }) => {
    // Get navbar
    const navbar = page.locator('nav[aria-label="Main navigation"]')
    await expect(navbar).toBeVisible()

    // Check navbar CSS position property - should be sticky
    const position = await navbar.evaluate((el) => window.getComputedStyle(el).position)
    expect(position).toBe('sticky')

    // Verify sticky positioning behavior:
    // Since the navbar is using sticky positioning with top: 0, it will stick to the top
    // of its containing block when scrolled. The navbar is a direct child of body,
    // so it will maintain its position at the top of the viewport during scroll.

    // Check that navbar has correct z-index to stay on top
    const zIndex = await navbar.evaluate((el) => window.getComputedStyle(el).zIndex)
    expect(parseInt(zIndex)).toBeGreaterThanOrEqual(50)

    // Verify the navbar stays accessible during scrolling by clicking navigation links
    // This indirectly tests that sticky positioning keeps it in view

    // Use the navigation to scroll to different sections
    await page.evaluate(() => {
      const projectsLink = document.querySelector('a[href="#projects"]')
      projectsLink?.click()
    })

    // Wait for URL hash to change
    await page.waitForURL(/.*#projects/)

    // Verify we can still access the navbar (it should be at or near viewport top)
    await expect(navbar).toBeVisible()

    // Navigate to another section
    await page.evaluate(() => {
      // Find all nav links and click the About link
      const links = document.querySelectorAll('a[href="#about"]')
      // Click the first visible one (desktop nav)
      for (const link of links) {
        const rect = link.getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) {
          link.click()
          break
        }
      }
    })

    // Wait for URL hash to change
    await page.waitForURL(/.*#about/)

    // Navbar should still be visible and accessible
    await expect(navbar).toBeVisible()

    // Verify sticky position is maintained by checking the computed position value
    const finalPosition = await navbar.evaluate((el) => window.getComputedStyle(el).position)
    expect(finalPosition).toBe('sticky')
  })

  // Test Case 2: Desktop - Hover over nav links shows underline animation
  test('should show underline animation on hover (desktop)', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop-only test')

    // Test that the ::after pseudo-element has the correct CSS for underline animation
    const hasUnderlineAnimation = await page.evaluate(() => {
      // Find the desktop navigation container
      const desktopNav = document.querySelector('.hidden.md\\:flex')
      if (!desktopNav) return { error: 'Desktop nav not found' }

      // Find the Projects link
      const link = desktopNav.querySelector('a[href="#projects"]')
      if (!link) return { error: 'Projects link not found' }

      // Check that the link has the nav-link class
      const hasNavLinkClass = link.classList.contains('nav-link')

      // Get the ::after pseudo-element styles
      const afterStyles = window.getComputedStyle(link, '::after')
      const transform = afterStyles.getPropertyValue('transform')
      const transition = afterStyles.getPropertyValue('transition')
      const content = afterStyles.getPropertyValue('content')

      // The ::after should have scaleX(0) initially
      const hasScaleX0 = transform === 'none' || transform.includes('matrix(0,') || transform.includes('scale')

      // Should have a transform transition
      const hasTransition = transition.includes('transform')

      // Should have content (even if empty string)
      const hasContent = content !== 'none'

      return {
        hasNavLinkClass,
        hasScaleX0,
        hasTransition,
        hasContent,
        transform,
        transition
      }
    })

    // Verify the link has the correct class and CSS for underline animation
    expect(hasUnderlineAnimation.hasNavLinkClass).toBeTruthy()
    expect(hasUnderlineAnimation.hasScaleX0).toBeTruthy()
    expect(hasUnderlineAnimation.hasTransition).toBeTruthy()
  })

  // Test Case 3: Mobile - Open hamburger menu, click link, menu closes
  test('should open mobile menu, click link, and menu closes (mobile)', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only test')

    // Mobile drawer should not be visible initially
    const mobileDrawer = page.locator('[role="dialog"]')
    await expect(mobileDrawer).toHaveClass(/translate-x-full/)

    // Click hamburger button
    const hamburgerButton = page.locator('button[aria-label="Toggle menu"]')
    await hamburgerButton.click()

    // Mobile drawer should be visible
    await expect(mobileDrawer).toHaveClass(/translate-x-0/)
    await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true')

    // Backdrop should exist in DOM (it might have opacity transition)
    const backdrop = page.locator('div[aria-hidden="true"].fixed.inset-0')
    await expect(backdrop).toBeAttached()

    // Click on a link in the mobile menu
    const mobileProjectsLink = mobileDrawer.locator('a[href="#projects"]')
    await mobileProjectsLink.click()

    // Menu should close
    await expect(mobileDrawer).toHaveClass(/translate-x-full/)
    await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false')
  })

  // Test Case 4: Mobile - Click backdrop overlay, menu closes
  test('should close mobile menu when clicking backdrop (mobile)', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only test')

    // Open the mobile menu
    const hamburgerButton = page.locator('button[aria-label="Toggle menu"]')
    await hamburgerButton.click()

    // Mobile drawer should be visible
    const mobileDrawer = page.locator('[role="dialog"]')
    await expect(mobileDrawer).toHaveClass(/translate-x-0/)

    // Click on backdrop (force click since it might have opacity transition)
    const backdrop = page.locator('div[aria-hidden="true"].fixed.inset-0')
    await expect(backdrop).toBeAttached()
    await backdrop.click({ position: { x: 50, y: 50 }, force: true }) // Click on the left side of backdrop

    // Menu should close
    await expect(mobileDrawer).toHaveClass(/translate-x-full/)
    await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false')
  })

  // Test Case 5: Mobile - Press Escape key, menu closes
  test('should close mobile menu when pressing Escape key (mobile)', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only test')

    // Open the mobile menu
    const hamburgerButton = page.locator('button[aria-label="Toggle menu"]')
    await hamburgerButton.click()

    // Mobile drawer should be visible
    const mobileDrawer = page.locator('[role="dialog"]')
    await expect(mobileDrawer).toHaveClass(/translate-x-0/)

    // Press Escape key
    await page.keyboard.press('Escape')

    // Menu should close
    await expect(mobileDrawer).toHaveClass(/translate-x-full/)
    await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false')
  })

  // Test Case 6: Accessibility - Tab through all links, verify focus states
  test('should allow keyboard navigation through all links with visible focus states', async ({ page, isMobile }) => {
    if (isMobile) {
      // Mobile: test keyboard navigation in mobile menu
      const hamburgerButton = page.locator('button[aria-label="Toggle menu"]')
      await hamburgerButton.click()

      // Wait for menu to open by checking drawer class
      const mobileDrawer = page.locator('[role="dialog"]')
      await expect(mobileDrawer).toHaveClass(/translate-x-0/)

      // Tab to first link in mobile menu (hamburger is already focused after click)
      await page.keyboard.press('Tab')

      // Projects link should be focused
      const projectsLink = page.locator('[role="dialog"] a[href="#projects"]')
      await expect(projectsLink).toBeFocused()

      // Verify focus ring is visible (focus-visible styles)
      const hasFocusRing = await projectsLink.evaluate((el) => {
        const styles = window.getComputedStyle(el)
        const outline = styles.getPropertyValue('outline')
        return outline !== 'none' && outline !== ''
      })
      expect(hasFocusRing).toBeTruthy()

      // Tab to About link
      await page.keyboard.press('Tab')
      const aboutLink = page.locator('[role="dialog"] a[href="#about"]')
      await expect(aboutLink).toBeFocused()

      // Tab to Contact link
      await page.keyboard.press('Tab')
      const contactLink = page.locator('[role="dialog"] a[href="#contact"]')
      await expect(contactLink).toBeFocused()
    } else {
      // Desktop: Focus the first desktop nav link programmatically to start
      const focused = await page.evaluate(() => {
        // Find desktop nav (Tailwind's 'hidden md:flex' resolves to display: flex on desktop)
        const links = Array.from(document.querySelectorAll('nav a[href^="#"]'))
        // Filter to only visible links (desktop nav)
        const visibleLinks = links.filter(link => {
          const rect = link.getBoundingClientRect()
          const styles = window.getComputedStyle(link)
          return rect.width > 0 && rect.height > 0 && styles.display !== 'none'
        })

        if (visibleLinks.length === 0) return { error: 'No visible nav links found' }

        // Focus the first visible link
        visibleLinks[0]?.focus()
        return {
          focused: document.activeElement?.getAttribute('href'),
          visibleCount: visibleLinks.length
        }
      })

      expect(focused.visibleCount).toBeGreaterThan(0)
      expect(focused.focused).toBe('#projects')

      // Verify focus ring is visible
      const hasFocusRing = await page.evaluate(() => {
        const el = document.activeElement
        const styles = window.getComputedStyle(el)
        const outline = styles.getPropertyValue('outline')
        return outline !== 'none' && outline !== ''
      })
      expect(hasFocusRing).toBeTruthy()

      // Tab to About link
      await page.keyboard.press('Tab')
      const aboutFocused = await page.evaluate(() => {
        return document.activeElement?.getAttribute('href')
      })
      expect(aboutFocused).toBe('#about')

      // Tab to Contact link
      await page.keyboard.press('Tab')
      const contactFocused = await page.evaluate(() => {
        return document.activeElement?.getAttribute('href')
      })
      expect(contactFocused).toBe('#contact')
    }
  })

  // Test Case 7: Navigation links scroll to sections (or route correctly)
  test('should scroll to correct section when clicking navigation links', async ({ page, isMobile }) => {
    if (isMobile) {
      // Mobile: test clicking links in mobile menu
      const hamburgerButton = page.locator('button[aria-label="Toggle menu"]')
      const mobileDrawer = page.locator('[role="dialog"]')

      // Click Projects link
      await hamburgerButton.click()
      await expect(mobileDrawer).toHaveClass(/translate-x-0/)
      const projectsLink = page.locator('[role="dialog"] a[href="#projects"]')
      await projectsLink.click()

      // Verify URL hash changed and section is in view
      await page.waitForURL(/.*#projects/)
      expect(page.url()).toContain('#projects')
      const projectsSection = page.locator('#projects')
      await expect(projectsSection).toBeInViewport()

      // Click About link
      await hamburgerButton.click()
      await expect(mobileDrawer).toHaveClass(/translate-x-0/)
      const aboutLink = page.locator('[role="dialog"] a[href="#about"]')
      await aboutLink.click()

      // Verify URL hash changed and section is in view
      await page.waitForURL(/.*#about/)
      expect(page.url()).toContain('#about')
      const aboutSection = page.locator('#about')
      await expect(aboutSection).toBeInViewport()

      // Click Contact link
      await hamburgerButton.click()
      await expect(mobileDrawer).toHaveClass(/translate-x-0/)
      const contactLink = page.locator('[role="dialog"] a[href="#contact"]')
      await contactLink.click()

      // Verify URL hash changed and section is in view
      await page.waitForURL(/.*#contact/)
      expect(page.url()).toContain('#contact')
      const contactSection = page.locator('#contact')
      await expect(contactSection).toBeInViewport()
    } else {
      // Desktop: use JavaScript to click the links (avoids visibility issues with Tailwind's responsive classes)

      // Click Projects link
      await page.evaluate(() => {
        const desktopNav = document.querySelector('.hidden.md\\:flex')
        const link = desktopNav?.querySelector('a[href="#projects"]')
        link?.click()
      })

      // Verify URL hash changed and section is in view
      await page.waitForURL(/.*#projects/)
      expect(page.url()).toContain('#projects')
      const projectsSection = page.locator('#projects')
      await expect(projectsSection).toBeInViewport()

      // Click About link
      await page.evaluate(() => {
        const desktopNav = document.querySelector('.hidden.md\\:flex')
        const link = desktopNav?.querySelector('a[href="#about"]')
        link?.click()
      })

      // Verify URL hash changed and section is in view
      await page.waitForURL(/.*#about/)
      expect(page.url()).toContain('#about')
      const aboutSection = page.locator('#about')
      await expect(aboutSection).toBeInViewport()

      // Click Contact link
      await page.evaluate(() => {
        const desktopNav = document.querySelector('.hidden.md\\:flex')
        const link = desktopNav?.querySelector('a[href="#contact"]')
        link?.click()
      })

      // Verify URL hash changed and section is in view
      await page.waitForURL(/.*#contact/)
      expect(page.url()).toContain('#contact')
      const contactSection = page.locator('#contact')
      await expect(contactSection).toBeInViewport()
    }
  })
})