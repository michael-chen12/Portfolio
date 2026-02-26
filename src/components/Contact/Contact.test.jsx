import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
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
    expect(emailLink).toHaveAttribute('aria-label', 'Send email to chen.michael40@gmail.com');
  });

  it('should have aria-label on phone link', () => {
    render(<Contact />);
    const phoneLink = screen.getByRole('link', { name: /call/i });
    expect(phoneLink).toHaveAttribute('aria-label', 'Call +886-901-365-501');
  });

  it('should render location as div, not link', () => {
    render(<Contact />);
    const locationText = screen.getByText(/new taipei city, taiwan/i);
    // Location should be inside a div wrapper, not an anchor
    expect(locationText.closest('a')).toBeNull();
  });

  it('should allow form inputs to be clicked when success overlay is hidden', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    // Form inputs should be clickable on initial render (before any submission)
    const nameInput = screen.getByLabelText(/your name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const messageInput = screen.getByLabelText(/your message/i);

    // These interactions should work (not be blocked by the hidden success overlay)
    await user.click(nameInput);
    await user.type(nameInput, 'Test');
    expect(nameInput).toHaveValue('Test');

    await user.click(emailInput);
    await user.type(emailInput, 'test@example.com');
    expect(emailInput).toHaveValue('test@example.com');

    await user.click(messageInput);
    await user.type(messageInput, 'Test message');
    expect(messageInput).toHaveValue('Test message');
  });

  describe('Form Submission', () => {
    let fetchSpy;

    beforeEach(() => {
      // Mock fetch globally
      fetchSpy = vi.spyOn(global, 'fetch');
    });

    afterEach(() => {
      fetchSpy.mockRestore();
    });

    it('should submit form successfully and show success message', async () => {
      const user = userEvent.setup();

      // Mock successful API response
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, id: 'test-id' }),
      });

      render(<Contact />);

      // Fill out form
      const nameInput = screen.getByLabelText(/your name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const messageInput = screen.getByLabelText(/your message/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'Test message');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Verify fetch was called with correct data
      expect(fetchSpy).toHaveBeenCalledWith(
        '/.netlify/functions/send-email',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            message: 'Test message',
          }),
        })
      );

      // Wait for success message to appear
      await waitFor(() => {
        expect(screen.getByText(/message sent!/i)).toBeInTheDocument();
      });
    });

    it('should display error message when API call fails', async () => {
      const user = userEvent.setup();

      // Mock failed API response
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Failed to send email' }),
      });

      render(<Contact />);

      // Fill out form
      await user.type(screen.getByLabelText(/your name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/your message/i), 'Test message');

      // Submit form
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Wait for error message to appear
      await waitFor(() => {
        expect(screen.getByText(/failed to send email/i)).toBeInTheDocument();
      });
    });

    it('should preserve form data when submission fails', async () => {
      const user = userEvent.setup();

      // Mock failed API response
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Network error' }),
      });

      render(<Contact />);

      const testName = 'Jane Doe';
      const testEmail = 'jane@example.com';
      const testMessage = 'Important message';

      // Fill out form
      await user.type(screen.getByLabelText(/your name/i), testName);
      await user.type(screen.getByLabelText(/email address/i), testEmail);
      await user.type(screen.getByLabelText(/your message/i), testMessage);

      // Submit form
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Wait for error
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });

      // Verify form data is still present
      expect(screen.getByLabelText(/your name/i)).toHaveValue(testName);
      expect(screen.getByLabelText(/email address/i)).toHaveValue(testEmail);
      expect(screen.getByLabelText(/your message/i)).toHaveValue(testMessage);
    });

    it('should clear form after successful submission', async () => {
      const user = userEvent.setup();

      // Mock successful API response
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<Contact />);

      // Fill out form
      await user.type(screen.getByLabelText(/your name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/your message/i), 'Test message');

      // Submit form
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText(/message sent!/i)).toBeInTheDocument();
      });

      // Wait for form to clear (happens after 3 second delay)
      await waitFor(
        () => {
          expect(screen.getByLabelText(/your name/i)).toHaveValue('');
          expect(screen.getByLabelText(/email address/i)).toHaveValue('');
          expect(screen.getByLabelText(/your message/i)).toHaveValue('');
        },
        { timeout: 4000 }
      );
    });

    it('should dismiss error when dismiss button is clicked', async () => {
      const user = userEvent.setup();

      // Mock failed API response
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Test error' }),
      });

      render(<Contact />);

      // Fill and submit form
      await user.type(screen.getByLabelText(/your name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/your message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/test error/i)).toBeInTheDocument();
      });

      // Click dismiss button
      const dismissButton = screen.getByRole('button', { name: /dismiss error/i });
      await user.click(dismissButton);

      // Error should be removed
      await waitFor(() => {
        expect(screen.queryByText(/test error/i)).not.toBeInTheDocument();
      });
    });

    it('should clear error when starting new submission', async () => {
      const user = userEvent.setup();

      // First submission fails
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'First error' }),
      });

      render(<Contact />);

      // Fill and submit form (first time)
      await user.type(screen.getByLabelText(/your name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/your message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Wait for error
      await waitFor(() => {
        expect(screen.getByText(/first error/i)).toBeInTheDocument();
      });

      // Mock second submission (will succeed)
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      // Submit again
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Error should be cleared immediately
      await waitFor(() => {
        expect(screen.queryByText(/first error/i)).not.toBeInTheDocument();
      });
    });
  });
});
