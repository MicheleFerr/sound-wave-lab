---
description: Perform a comprehensive security audit on the codebase
---

## Context

- Package dependencies: @package.json
- Environment configuration: @.env.example

## Your Task

Perform a comprehensive security audit of this Next.js e-commerce application. Focus on:

### 1. Dependency Vulnerabilities
- Run `npm audit` to check for known CVEs
- Review outdated packages that may have security patches

### 2. Authentication & Authorization
- Review Supabase auth implementation in `src/lib/supabase/`
- Check middleware protection for admin routes (`/admin/*`)
- Verify user session handling and token refresh
- Check role-based access control (admin vs user)

### 3. API Security
- Review all API routes in `src/app/api/`
- Check for proper authentication on protected endpoints
- Verify input validation and sanitization
- Look for SQL injection risks (Supabase queries)
- Check rate limiting implementation

### 4. Payment Security (Stripe)
- Review Stripe webhook signature verification
- Check for proper handling of payment intents
- Verify no sensitive payment data is logged or exposed

### 5. Data Exposure
- Check for sensitive data in client-side code
- Review what data is returned from API endpoints
- Look for PII exposure in logs or error messages
- Verify proper use of `NEXT_PUBLIC_` env vars vs server-only

### 6. Configuration Security
- Verify `.env` files are in `.gitignore`
- Check for hardcoded secrets or API keys
- Review CORS and CSP headers

### 7. Input Validation
- Check for XSS vulnerabilities (especially `dangerouslySetInnerHTML`)
- Review form inputs and user-submitted content
- Check file upload handling (if any)

### 8. Supabase RLS (Row Level Security)
- Review if RLS policies are properly configured
- Check for data access that bypasses RLS

$ARGUMENTS

## Output Format

Provide a prioritized report with:
- Severity level (CRITICAL / HIGH / MEDIUM / LOW)
- File location and line numbers
- Description of the vulnerability
- Recommended remediation steps
- Code examples for fixes where applicable
