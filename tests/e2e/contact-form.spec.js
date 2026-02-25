import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the page
    await page.goto('/');

    // Scroll to contact section
    await page.getByRole('heading', { name: /let's create together/i }).scrollIntoViewIfNeeded();
  });

  test('should display contact form with all fields', async ({ page }) => {
    // Verify form elements are present
    await expect(page.getByLabelText(/your name/i)).toBeVisible();
    await expect(page.getByLabelText(/email address/i)).toBeVisible();
    await expect(page.getByLabelText(/your message/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /send message/i })).toBeVisible();
  });

  test('should successfully submit form with valid data', async ({ page }) => {
    // Mock the API endpoint
    await page.route('/.netlify/functions/send-email', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, id: 'test-id' }),
      });
    });

    // Fill out the form
    await page.getByLabelText(/your name/i).fill('Jane Doe');
    await page.getByLabelText(/email address/i).fill('jane@example.com');
    await page.getByLabelText(/your message/i).fill('This is a test message for the contact form.');

    // Submit the form
    await page.getByRole('button', { name: /send message/i }).click();

    // Verify success message appears
    await expect(page.getByText(/message sent!/i)).toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/i'll get back to you soon/i)).toBeVisible();

    // Wait for form to reset (3 second delay)
    await page.waitForTimeout(3500);

    // Verify form is cleared
    await expect(page.getByLabelText(/your name/i)).toHaveValue('');
    await expect(page.getByLabelText(/email address/i)).toHaveValue('');
    await expect(page.getByLabelText(/your message/i)).toHaveValue('');
  });

  test('should show error message when submission fails', async ({ page }) => {
    // Mock the API endpoint to return an error
    await page.route('/.netlify/functions/send-email', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Failed to send email. Please try again later.' }),
      });
    });

    // Fill out the form
    await page.getByLabelText(/your name/i).fill('John Doe');
    await page.getByLabelText(/email address/i).fill('john@example.com');
    await page.getByLabelText(/your message/i).fill('Test message');

    // Submit the form
    await page.getByRole('button', { name: /send message/i }).click();

    // Verify error message appears
    await expect(page.getByText(/failed to send email/i)).toBeVisible({ timeout: 3000 });
  });

  test('should preserve form data when submission fails', async ({ page }) => {
    // Mock API error
    await page.route('/.netlify/functions/send-email', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid input' }),
      });
    });

    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Important message that should not be lost',
    };

    // Fill out the form
    await page.getByLabelText(/your name/i).fill(testData.name);
    await page.getByLabelText(/email address/i).fill(testData.email);
    await page.getByLabelText(/your message/i).fill(testData.message);

    // Submit the form
    await page.getByRole('button', { name: /send message/i }).click();

    // Wait for error to appear
    await expect(page.getByText(/invalid input/i)).toBeVisible();

    // Verify form data is preserved
    await expect(page.getByLabelText(/your name/i)).toHaveValue(testData.name);
    await expect(page.getByLabelText(/email address/i)).toHaveValue(testData.email);
    await expect(page.getByLabelText(/your message/i)).toHaveValue(testData.message);
  });

  test('should dismiss error when dismiss button is clicked', async ({ page }) => {
    // Mock API error
    await page.route('/.netlify/functions/send-email', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error occurred' }),
      });
    });

    // Fill and submit form
    await page.getByLabelText(/your name/i).fill('Test User');
    await page.getByLabelText(/email address/i).fill('test@example.com');
    await page.getByLabelText(/your message/i).fill('Test message');
    await page.getByRole('button', { name: /send message/i }).click();

    // Wait for error to appear
    await expect(page.getByText(/server error occurred/i)).toBeVisible();

    // Click dismiss button
    await page.getByRole('button', { name: /dismiss error/i }).click();

    // Verify error is dismissed
    await expect(page.getByText(/server error occurred/i)).not.toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /send message/i });
    await submitButton.click();

    // Browser's built-in validation should prevent submission
    // Check that success message doesn't appear
    await page.waitForTimeout(500);
    await expect(page.getByText(/message sent!/i)).not.toBeVisible();
  });

  test('should show loading state during submission', async ({ page }) => {
    // Mock API with delay
    await page.route('/.netlify/functions/send-email', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Fill out the form
    await page.getByLabelText(/your name/i).fill('Test User');
    await page.getByLabelText(/email address/i).fill('test@example.com');
    await page.getByLabelText(/your message/i).fill('Test message');

    // Submit the form
    await page.getByRole('button', { name: /send message/i }).click();

    // Verify loading state appears
    await expect(page.getByText(/sending.../i)).toBeVisible();

    // Wait for success
    await expect(page.getByText(/message sent!/i)).toBeVisible({ timeout: 3000 });
  });

  test('should display contact information links', async ({ page }) => {
    // Verify email link exists and has correct href
    const emailLink = page.getByRole('link', { name: /send email/i });
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute('href', /^mailto:/);

    // Verify phone link exists and has correct href
    const phoneLink = page.getByRole('link', { name: /call/i });
    await expect(phoneLink).toBeVisible();
    await expect(phoneLink).toHaveAttribute('href', /^tel:/);

    // Verify location is displayed (not a link)
    await expect(page.getByText(/san francisco, ca/i)).toBeVisible();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check form inputs have proper labels
    const nameInput = page.getByLabelText(/your name/i);
    const emailInput = page.getByLabelText(/email address/i);
    const messageInput = page.getByLabelText(/your message/i);

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageInput).toBeVisible();

    // Verify autocomplete attributes
    await expect(nameInput).toHaveAttribute('autocomplete', 'name');
    await expect(emailInput).toHaveAttribute('autocomplete', 'email');

    // Verify required attributes
    await expect(nameInput).toHaveAttribute('required');
    await expect(emailInput).toHaveAttribute('required');
    await expect(messageInput).toHaveAttribute('required');
  });
});
