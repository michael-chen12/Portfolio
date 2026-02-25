import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Code } from 'lucide-react';
import ServiceCard from './ServiceCard';

const mockService = {
  number: '01',
  icon: Code,
  title: 'Web Development',
  description: 'Building modern web applications',
};

describe('ServiceCard', () => {
  let matchMediaMock;

  beforeEach(() => {
    matchMediaMock = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    window.matchMedia = vi.fn(() => matchMediaMock);
  });

  it('should render service title', () => {
    render(<ServiceCard service={mockService} index={0} />);
    expect(screen.getByText('Web Development')).toBeInTheDocument();
  });

  it('should render service description', () => {
    render(<ServiceCard service={mockService} index={0} />);
    expect(screen.getByText('Building modern web applications')).toBeInTheDocument();
  });

  it('should render service number', () => {
    render(<ServiceCard service={mockService} index={0} />);
    expect(screen.getByText('01')).toBeInTheDocument();
  });

  it('should disable 3D tilt when reduced motion is preferred', () => {
    matchMediaMock.matches = true;
    const { container } = render(<ServiceCard service={mockService} index={0} />);
    const article = container.querySelector('article');

    // When reduced motion is enabled, the style should not include 3D transforms
    const hasTransform3D = article?.style?.transformStyle === 'preserve-3d';
    expect(hasTransform3D).toBe(false);
  });
});
