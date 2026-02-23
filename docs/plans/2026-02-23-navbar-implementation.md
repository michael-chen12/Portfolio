# Navbar Component Implementation Plan

**Date:** 2026-02-23
**Component:** Portfolio Website Navigation Bar

## Overview

Create a modern, responsive navbar component with glass morphism styling, smooth animations, and mobile-friendly hamburger menu. The navbar will feature a fixed/sticky position, animated hover effects, and comprehensive test coverage.

---

## Design Specifications

### Layout Structure

**Desktop (md and up):**
- Left: Logo/Name (stylized text)
- Center: Navigation links (Projects, About)
- Right: Contact link

**Mobile (<768px):**
- Left: Logo/Name
- Right: Hamburger menu icon
- Drawer: Slide-in from right with overlay backdrop

### Visual Design

**Glass Morphism Effect:**
- Background: `bg-white/80 dark:bg-gray-900/80` (80% opacity)
- Backdrop blur: `backdrop-blur-lg` (16px blur radius)
- Border: `border-b border-gray-200/20` (subtle separator)
- Shadow: `shadow-sm` for depth

**Typography & Spacing:**
- Logo/Name: `text-2xl md:text-3xl font-bold`
- Nav links: `text-base font-medium`
- Vertical padding: `py-4`
- Horizontal padding: `px-6 md:px-12`

**Interactions:**
- Scroll behavior: Fixed/sticky at top (`sticky top-0 z-50`)
- Link hover: Animated underline that slides in from left (0.3s ease transition)
- Mobile menu: Slides in from right with backdrop fade (0.3s ease-in-out)

---

## Implementation Steps

### 1. Create Component Files

**Files to create:**
- `src/components/Navbar.jsx` - Main navbar component
- `src/components/Navbar.css` - Custom underline animation styles
- `src/components/__tests__/Navbar.test.jsx` - Component unit tests
- `tests/e2e/navbar.spec.js` - E2E tests

### 2. Component Structure

```jsx
// Navbar.jsx structure
import { useState } from 'react'
import './Navbar.css'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Desktop navbar (visible md and up)
  // Mobile hamburger button (visible below md)
  // Mobile drawer (slides in when open)
  // Backdrop overlay (dims content when drawer open)
}
```

### 3. Styling Implementation

**Tailwind classes for glass morphism:**
```jsx
className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200/20 shadow-sm"
```

**Custom CSS for underline animation:**
```css
.nav-link {
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.nav-link:hover::after {
  transform: scaleX(1);
}
```

### 4. Mobile Menu Implementation

**Hamburger Icon:**
- Three-line icon that transforms to X when open
- Positioned in top-right on mobile
- 44x44px minimum touch target
- `aria-label="Toggle menu"` and `aria-expanded={isMobileMenuOpen}`

**Drawer Animation:**
- Initial state: `translate-x-full` (off-screen right)
- Open state: `translate-x-0` (visible)
- Transition: `transition-transform duration-300 ease-in-out`
- Full height: `h-screen`
- Glass morphism styling matches navbar

**Backdrop:**
- `bg-black/50` overlay
- `transition-opacity duration-300`
- Clicks on backdrop close drawer

### 5. Accessibility Features

**Keyboard Navigation:**
- All links focusable with visible focus states: `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`
- Tab order: Logo → Projects → About → Contact → Hamburger (mobile)
- Escape key closes mobile drawer

**ARIA Attributes:**
- `<nav aria-label="Main navigation">`
- Hamburger: `aria-label="Toggle menu"` `aria-expanded={isMobileMenuOpen}`
- Mobile drawer: `role="dialog"` `aria-modal="true"`

### 6. Integration with App.jsx

- Import Navbar component in `App.jsx`
- Render at top of component tree
- Remove default Vite template content
- Add placeholder sections for Projects, About, Contact (for scroll testing)

---

## Testing Strategy

### Unit/Component Tests (Vitest + React Testing Library)

**Setup:**
```bash
npm install -D vitest @vitest/ui jsdom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Configuration in `vite.config.js`:**
```javascript
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
```

**Test Cases (`src/components/__tests__/Navbar.test.jsx`):**
1. ✅ Component renders without errors
2. ✅ All navigation links render with correct text (Projects, About, Contact)
3. ✅ Logo/name displays correctly
4. ✅ Mobile menu toggle changes state (opens/closes)
5. ✅ Hamburger button visible on mobile, hidden on desktop
6. ✅ Desktop nav links visible on desktop, hidden on mobile
7. ✅ Click backdrop closes mobile menu
8. ✅ Escape key closes mobile menu
9. ✅ Focus states work correctly on all interactive elements

**Best Practices from Testing Library:**
- Use `userEvent` instead of `fireEvent` for realistic user interactions
- Query by role and accessible text (not test IDs)
- Wait for async state updates with `findBy` queries

### E2E Tests (Playwright)

**Setup:**
```bash
npm install -D @playwright/test
npx playwright install
```

**Configuration (`playwright.config.js`):**
```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:5173',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
```

**Test Cases (`tests/e2e/navbar.spec.js`):**
1. ✅ Navbar remains fixed at top when scrolling
2. ✅ Desktop: Hover over nav links shows underline animation
3. ✅ Mobile: Open hamburger menu, click link, menu closes
4. ✅ Mobile: Click backdrop overlay, menu closes
5. ✅ Mobile: Press Escape key, menu closes
6. ✅ Accessibility: Tab through all links, verify focus states
7. ✅ Navigation links scroll to sections (or route correctly)

**Test Commands:**
```bash
# Component tests
npm run test           # Run all tests
npm run test:ui        # Open Vitest UI
npm run test:coverage  # Generate coverage report

# E2E tests
npx playwright test              # Run all E2E tests
npx playwright test --ui         # Run with UI mode
npx playwright test --project=chromium  # Desktop only
npx playwright test --project="Mobile Chrome"  # Mobile only
```

---

## Package.json Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

## Critical Files

### Files to Create:
1. `src/components/Navbar.jsx` - Main component
2. `src/components/Navbar.css` - Animations
3. `src/components/__tests__/Navbar.test.jsx` - Unit tests
4. `src/test/setup.js` - Vitest setup file
5. `tests/e2e/navbar.spec.js` - E2E tests
6. `playwright.config.js` - Playwright configuration
7. `docs/plans/2026-02-23-navbar-implementation.md` - Design documentation

### Files to Modify:
1. `src/App.jsx` - Import and render Navbar
2. `vite.config.js` - Add Vitest configuration
3. `package.json` - Add test scripts and dependencies

---

## Verification Steps

### 1. Development Preview
```bash
npm run dev
# Open http://localhost:5173
# Verify navbar appears with glass morphism effect
# Test hover animations on desktop
# Resize browser to mobile view, test hamburger menu
```

### 2. Run Unit Tests
```bash
npm run test
# All tests should pass (9 test cases)
# Verify coverage report includes Navbar component
```

### 3. Run E2E Tests
```bash
npx playwright test
# All E2E tests should pass (7 test cases)
# Tests run on both desktop Chrome and mobile emulation
```

### 4. Visual Verification
- Glass morphism effect visible (background blur + transparency)
- Smooth underline animation on hover (desktop)
- Mobile drawer slides in smoothly from right
- Backdrop overlay dims background content
- Navbar stays fixed at top when scrolling
- Focus states visible when tabbing through links

### 5. Accessibility Check
```bash
# Manual testing:
# - Tab through all interactive elements
# - Press Escape when mobile menu open
# - Verify ARIA attributes with browser dev tools
# - Test with screen reader (VoiceOver/NVDA)
```

---

## Success Criteria

✅ Navbar component renders correctly on all screen sizes
✅ Glass morphism styling matches design specifications
✅ Hover animations work smoothly on desktop
✅ Mobile menu opens/closes with smooth transitions
✅ All accessibility requirements met (keyboard nav, ARIA, focus states)
✅ All unit tests pass (9/9)
✅ All E2E tests pass (7/7)
✅ No console errors or warnings
✅ Component follows project naming conventions (pascalCase variables)
✅ Code adheres to ESLint rules

---

## Notes

- This navbar uses a component-based approach with Tailwind CSS (no external UI libraries)
- Glass morphism requires `backdrop-blur` support (modern browsers only)
- Mobile breakpoint is `md:` (768px) following Tailwind defaults
- Testing uses latest best practices: `userEvent` over `fireEvent`, query by role/text
- All tests use Vitest (Vite-native) instead of Jest for faster execution
- Playwright tests run on both desktop and mobile viewports for comprehensive coverage
