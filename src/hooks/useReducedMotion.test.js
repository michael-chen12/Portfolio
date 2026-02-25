import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useReducedMotion } from './useReducedMotion';

describe('useReducedMotion', () => {
  let matchMediaMock;
  let listeners = [];

  beforeEach(() => {
    listeners = [];
    matchMediaMock = {
      matches: false,
      addEventListener: vi.fn((event, handler) => {
        listeners.push(handler);
      }),
      removeEventListener: vi.fn((event, handler) => {
        listeners = listeners.filter((l) => l !== handler);
      }),
    };

    window.matchMedia = vi.fn(() => matchMediaMock);
  });

  it('should return false when prefers-reduced-motion is not set', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('should return true when prefers-reduced-motion is enabled', () => {
    matchMediaMock.matches = true;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('should update when media query changes', () => {
    const { result, rerender } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    // Simulate media query change
    matchMediaMock.matches = true;
    listeners.forEach((listener) => listener({ matches: true }));
    rerender();

    expect(result.current).toBe(true);
  });

  it('should clean up event listener on unmount', () => {
    const { unmount } = renderHook(() => useReducedMotion());
    expect(matchMediaMock.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );

    unmount();
    expect(matchMediaMock.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });
});
