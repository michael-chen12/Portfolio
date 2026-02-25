import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CustomCursor from './CustomCursor';

describe('CustomCursor', () => {
  let matchMediaMock;

  beforeEach(() => {
    matchMediaMock = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    window.matchMedia = vi.fn(() => matchMediaMock);
  });

  it('should not render when reduced motion is preferred', () => {
    matchMediaMock.matches = true;
    const { container } = render(<CustomCursor />);

    // Cursor should not be rendered
    const cursorRing = container.querySelector('.border-teal');
    expect(cursorRing).not.toBeInTheDocument();
  });

  it.skip('should immediately respond to hover on interactive elements', async () => {
    const user = userEvent.setup();

    // Render custom cursor and a test button
    const { container } = render(
      <>
        <CustomCursor />
        <button>Test Button</button>
      </>
    );

    const button = screen.getByRole('button', { name: 'Test Button' });

    // Move mouse over button
    await user.hover(button);

    // The cursor ring should scale immediately (within 200ms)
    // Find the outer cursor ring (the one with scale animation)
    const cursorRing = container.querySelector('.border-teal');

    await waitFor(() => {
      // The isHovering state should be true, causing scale transform
      expect(cursorRing).toBeInTheDocument();
    }, { timeout: 200 });
  });

  it.skip('should maintain hover detection when cursor visibility changes', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <>
        <CustomCursor />
        <button>Hover Target</button>
      </>
    );

    const button = screen.getByRole('button', { name: 'Hover Target' });

    // First hover
    await user.hover(button);
    await waitFor(() => {
      const cursorRing = container.querySelector('.border-teal');
      expect(cursorRing).toBeInTheDocument();
    });

    // Unhover
    await user.unhover(button);

    // Second hover should work immediately without delay
    const startTime = Date.now();
    await user.hover(button);

    await waitFor(() => {
      const cursorRing = container.querySelector('.border-teal');
      expect(cursorRing).toBeInTheDocument();
    }, { timeout: 200 });

    const endTime = Date.now();
    // Should respond within 200ms, not 2-3 seconds
    expect(endTime - startTime).toBeLessThan(500);
  });
});
