# Contact Form Loading & Success States - Design Document

**Date:** 2026-02-26
**Status:** Approved

## Problem Statement

The contact form has state management in place but visual feedback is incomplete:
1. Loading spinner on submit button is not animating
2. Success overlay appears/disappears abruptly without smooth transitions

## Solution Overview

Apply minimal fixes to enhance visual feedback using existing Framer Motion library and Tailwind utilities. No changes to state management or data flow.

## Design Details

### Component Changes

**File:** `src/components/Contact/Contact.jsx`

#### 1. Loading Spinner Animation (line ~255)
- Add `animate-spin` class to the spinner div
- Provides 360° rotation at 1s linear infinite
- Automatically respects `prefers-reduced-motion`

#### 2. Success Overlay Fade Animation (line ~136-144)
- Import `AnimatePresence` from Framer Motion
- Wrap success overlay conditional in `AnimatePresence`
- Convert overlay div to `motion.div`
- Add animation props:
  - **Initial:** `opacity: 0, scale: 0.95`
  - **Animate:** `opacity: 1, scale: 1`
  - **Exit:** `opacity: 0, scale: 0.95`
  - **Duration:** ~300ms with ease-in-out

### Data Flow

No changes to existing state management:
- `isSubmitting` - controls button disabled state and loading UI
- `isSuccess` - controls overlay visibility
- `error` - manages error display
- Existing 3-second auto-dismiss remains unchanged

### Accessibility

- Spinner animation respects `prefers-reduced-motion` via Tailwind
- Success overlay maintains semantic content (icon + descriptive text)
- Form keyboard navigation preserved during all states
- Button properly disabled during submission

## Testing Considerations

Manual testing should verify:
1. Spinner rotates smoothly when form is submitting
2. Success overlay fades in smoothly when message is sent
3. Success overlay fades out smoothly after 3 seconds
4. No animations occur when `prefers-reduced-motion` is enabled
5. Form remains keyboard accessible throughout all states

## Out of Scope

- Additional loading states for form fields
- Enhanced error animations
- Celebration effects or confetti
- Progress indicators beyond button spinner

## Implementation Notes

- Changes are purely presentational
- No new dependencies required
- Minimal code changes reduce regression risk
- Leverages existing Framer Motion setup
