import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Hero from './Hero';

describe('Hero', () => {
  it('should have width and height attributes on profile image', () => {
    render(<Hero />);
    const profileImage = screen.getByAltText(/profile/i);
    expect(profileImage).toHaveAttribute('width', '400');
    expect(profileImage).toHaveAttribute('height', '500');
  });

  it('should have eager loading on profile image', () => {
    render(<Hero />);
    const profileImage = screen.getByAltText(/profile/i);
    expect(profileImage).toHaveAttribute('loading', 'eager');
  });

  it('should have aria-label on GitHub social link', () => {
    render(<Hero />);
    const githubLink = screen.getByRole('link', { name: /github profile/i });
    expect(githubLink).toHaveAttribute('aria-label', 'GitHub Profile');
  });

  it('should have aria-label on LinkedIn social link', () => {
    render(<Hero />);
    const linkedinLink = screen.getByRole('link', { name: /linkedin profile/i });
    expect(linkedinLink).toHaveAttribute('aria-label', 'LinkedIn Profile');
  });

  it('should have aria-label on email social link', () => {
    render(<Hero />);
    const emailLink = screen.getByRole('link', { name: /send email/i });
    expect(emailLink).toHaveAttribute('aria-label', 'Send Email');
  });
});
