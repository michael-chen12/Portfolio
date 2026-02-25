import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Contact from './Contact';

describe('Contact', () => {
  it('should have autocomplete attribute on name input', () => {
    render(<Contact />);
    const nameInput = screen.getByLabelText(/your name/i);
    expect(nameInput).toHaveAttribute('autocomplete', 'name');
  });

  it('should have autocomplete attribute on email input', () => {
    render(<Contact />);
    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toHaveAttribute('autocomplete', 'email');
  });

  it('should not have autocomplete on message textarea', () => {
    render(<Contact />);
    const messageTextarea = screen.getByLabelText(/your message/i);
    expect(messageTextarea).not.toHaveAttribute('autocomplete');
  });

  it('should have aria-label on email link', () => {
    render(<Contact />);
    const emailLink = screen.getByRole('link', { name: /send email/i });
    expect(emailLink).toHaveAttribute('aria-label', 'Send email to hello@example.com');
  });

  it('should have aria-label on phone link', () => {
    render(<Contact />);
    const phoneLink = screen.getByRole('link', { name: /call/i });
    expect(phoneLink).toHaveAttribute('aria-label', 'Call +1 (555) 123-4567');
  });

  it('should render location as div, not link', () => {
    render(<Contact />);
    const locationText = screen.getByText(/san francisco, ca/i);
    // Location should be inside a div wrapper, not an anchor
    expect(locationText.closest('a')).toBeNull();
  });
});
