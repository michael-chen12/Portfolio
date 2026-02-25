# Contact Form Email Integration Plan

## Goal
Add functional email sending to the Contact form that delivers messages to chen.michael40@gmail.com when users click "Send Message".

## Approach
- **Email Service**: Resend API (free tier: 100 emails/day)
- **Backend**: Netlify Functions (serverless)
- **Testing**: Test mode first, then real email delivery

## Implementation Steps

### 1. Resend Setup
- Sign up at https://resend.com
- Generate API key from dashboard
- Start with test mode (emails won't actually send until verified)
- For production: verify domain or use onboarding@resend.dev sender

### 2. Create Netlify Function

**File**: `/netlify/functions/send-email.js` (new file, new directory)

Implementation requirements:
- Import Resend SDK
- Export handler function with Netlify signature: `async (event, context) => {}`
- Parse JSON body from `event.body`
- Validate inputs: name, email, message (all required)
- Send email via Resend API:
  - From: `onboarding@resend.dev` (or verified domain)
  - To: `chen.michael40@gmail.com`
  - Subject: `Portfolio Contact: ${name}`
  - Body: Include name, email, and message
- Return appropriate responses:
  - 200: Success with JSON `{ success: true }`
  - 400: Invalid input with error details
  - 500: Server error with generic message
- Add CORS headers for local development

**Dependencies**: Add `resend` to package.json

### 3. Update Contact Component

**File**: `/src/components/Contact/Contact.jsx` (lines 41-57, handleSubmit function)

Changes needed:
1. Add error state: `const [error, setError] = useState(null);`
2. Replace setTimeout simulation with real API call:
   - POST to `/.netlify/functions/send-email`
   - Send JSON body: `{ name, email, message }`
   - Handle response:
     - Success: Set success state (keep existing flow)
     - Error: Set error state with message
3. Add error UI above form or below submit button:
   - Red background, white text
   - Matches existing design system (framer-motion animations)
   - Auto-dismisses on new submission or after timeout
4. Preserve form data on error (don't clear inputs)
5. Clear error state at start of new submission

### 4. Environment Variables

**Local**: Create `/.env` file:
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Netlify**: Set via dashboard or CLI:
```bash
netlify env:set RESEND_API_KEY re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Git**: Ensure `.env` is in `.gitignore`

### 5. Local Testing Setup

**Netlify CLI setup**:
```bash
npm install -g netlify-cli
netlify dev
```

This runs both Vite dev server and Netlify Functions locally.

### 6. Testing Strategy

**Phase 1 - Test Mode (sandbox)**:
1. Run `netlify dev` locally
2. Submit form with test data
3. Check Resend dashboard for test email (won't actually send)
4. Verify function logs show successful processing
5. Test error scenarios: empty fields, invalid email

**Phase 2 - Real Email Delivery**:
1. Verify sender domain in Resend (or use onboarding@resend.dev)
2. Deploy to Netlify preview
3. Submit form with real data
4. Check chen.michael40@gmail.com inbox for email
5. Verify email content matches submission

**Phase 3 - End-to-End Validation**:
1. Test from production deployment
2. Submit multiple test emails
3. Verify delivery to Gmail
4. Check spam folder if needed
5. Monitor Netlify function logs for errors

### 7. Update Tests

**Unit tests**: `/src/components/Contact/Contact.test.jsx`
- Mock fetch API calls
- Test successful submission flow
- Test error handling and display
- Test form reset behavior

**E2E tests**: Create `/tests/e2e/contact-form.spec.js`
- Test full form submission (with mocked API)
- Test validation errors
- Test success state display
- Test error state display

## Critical Files
1. `/netlify/functions/send-email.js` - New serverless function
2. `/src/components/Contact/Contact.jsx` - Update handleSubmit (lines 41-57), add error state/UI
3. `/.env` - New file for local API key (git-ignored)
4. `/package.json` - Add `resend` dependency
5. `/src/components/Contact/Contact.test.jsx` - Update tests
6. `/tests/e2e/contact-form.spec.js` - New E2E test file

## Security Considerations
- API key stored in environment variables only
- Input validation on server side
- Error messages sanitized (no key leakage)
- CORS configured appropriately
- HTTPS enforced by Netlify

## Success Criteria
✅ Form submission triggers Netlify function
✅ Email arrives at chen.michael40@gmail.com
✅ Success message displays after send
✅ Error handling works for failures
✅ Tests pass (unit + e2e)
✅ No API key exposure in code

## Rollback Plan
If issues occur:
- Remove API call from Contact.jsx
- Restore setTimeout simulation
- Users can still use direct email link (already in UI)
- No breaking changes to existing functionality
