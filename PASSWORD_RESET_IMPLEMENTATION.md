# Password Reset Implementation Guide

## Overview

Implemented a complete password reset flow using Supabase authentication with two new pages:
1. **Forgot Password Page** (`/auth/forgot-password`) - Request password reset
2. **Reset Password Page** (`/auth/reset-password`) - Set new password

## Features

### Forgot Password Page (`/auth/forgot-password`)
✅ Email input with validation  
✅ Send password reset email via Supabase  
✅ Success state with confirmation message  
✅ Link to go back to login  
✅ Option to try a different email  
✅ Expiry notice (1 hour)  

### Reset Password Page (`/auth/reset-password`)
✅ Token validation  
✅ New password input with show/hide toggle  
✅ Password confirmation field  
✅ Real-time password match validation  
✅ Minimum password length requirement (6 characters)  
✅ Success state with auto-redirect  
✅ Invalid/expired token handling  
✅ Loading states  

## How It Works

### User Flow

1. **User forgets password**
   - Goes to `/auth/login`
   - Clicks "Forgot your password?" link
   - Redirected to `/auth/forgot-password`

2. **Request reset email**
   - User enters their email address
   - Clicks "Send reset link"
   - Supabase sends email with magic link
   - Success message displayed

3. **Click reset link**
   - User opens email and clicks the link
   - Redirected to `/auth/reset-password`
   - Token is automatically validated

4. **Set new password**
   - User enters new password (twice)
   - Clicks "Reset password"
   - Password is updated in Supabase
   - Auto-redirected to login page

### Technical Implementation

#### Forgot Password
```typescript
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/auth/reset-password`,
})
```

#### Reset Password
```typescript
const { error } = await supabase.auth.updateUser({
  password: newPassword
})
```

## Supabase Configuration

### Email Templates

You may want to customize the password reset email template in Supabase:

1. Go to **Authentication > Email Templates** in Supabase Dashboard
2. Select **Reset Password** template
3. Customize the email content and styling
4. Variables available:
   - `{{ .ConfirmationURL }}` - The reset link
   - `{{ .Token }}` - The reset token
   - `{{ .Email }}` - User's email

### Example Custom Template

```html
<h2>Reset your password</h2>
<p>Hi there,</p>
<p>Someone requested a password reset for your DubLaunch account.</p>
<p>Click the link below to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request this, you can safely ignore this email.</p>
<p>Thanks,<br>The DubLaunch Team</p>
```

## Security Features

1. **Token Expiration**: Reset links expire after 1 hour
2. **Secure Redirect**: Uses `window.location.origin` to ensure proper redirect
3. **Password Validation**: Minimum 6 characters
4. **Session Validation**: Checks for valid session before allowing password change
5. **HTTPS Only**: Supabase ensures all authentication flows use HTTPS

## Files Created

```
app/auth/
├── forgot-password/
│   └── page.tsx          ✅ Request password reset
└── reset-password/
    └── page.tsx          ✅ Set new password
```

## UI/UX Features

### Visual Feedback
- ✅ Loading states ("Sending...", "Resetting password...")
- ✅ Success states with checkmark icons
- ✅ Error states with alert icons
- ✅ Toast notifications for all actions

### Form Validation
- ✅ Email format validation
- ✅ Password length validation (min 6 chars)
- ✅ Password match validation
- ✅ Real-time validation feedback
- ✅ Disabled submit buttons until valid

### User Guidance
- ✅ Clear instructions on each page
- ✅ Helpful error messages
- ✅ Link expiry notice
- ✅ Auto-redirect on success
- ✅ Back to login links

## Testing Checklist

### Forgot Password Flow
- [ ] Navigate to `/auth/forgot-password`
- [ ] Enter a valid email address
- [ ] Click "Send reset link"
- [ ] Verify success message appears
- [ ] Check email inbox for reset link
- [ ] Verify "Try a different email" works
- [ ] Test with invalid email format
- [ ] Test with non-existent email (should still show success for security)

### Reset Password Flow
- [ ] Click the reset link from email
- [ ] Verify redirect to `/auth/reset-password`
- [ ] Enter new password
- [ ] Verify password visibility toggle works
- [ ] Verify password match validation
- [ ] Try mismatched passwords (should show error)
- [ ] Try password less than 6 characters (should show error)
- [ ] Submit with valid matching passwords
- [ ] Verify success message
- [ ] Verify auto-redirect to login
- [ ] Try to reuse the same reset link (should show expired)

### Edge Cases
- [ ] Test expired reset link (wait 1+ hour)
- [ ] Test invalid reset link
- [ ] Test accessing reset page without token
- [ ] Test with weak passwords
- [ ] Test special characters in password
- [ ] Test very long passwords

## Integration with Existing Code

### Login Page Already Updated
The login page already has the "Forgot your password?" link:
```typescript
<Link href="/auth/forgot-password" className="text-uw-purple hover:text-uw-purple/80">
  Forgot your password?
</Link>
```

### No Additional Changes Needed
- ✅ Header component works on all pages
- ✅ Toast notifications already configured
- ✅ Supabase client already set up
- ✅ Styling matches existing auth pages

## Troubleshooting

### Email Not Received
1. Check spam/junk folder
2. Verify email in Supabase Dashboard > Authentication > Users
3. Check Supabase email rate limits
4. Verify SMTP settings in Supabase (for custom domains)

### Reset Link Not Working
1. Check if link has expired (1 hour limit)
2. Verify redirect URL is correct in Supabase Dashboard
3. Check browser console for errors
4. Ensure Supabase project is not paused

### Password Not Updating
1. Verify password meets minimum requirements (6 chars)
2. Check Supabase logs for errors
3. Verify user has valid session from reset link
4. Check RLS policies on auth schema

## Customization Options

### Change Password Requirements
In `/app/auth/reset-password/page.tsx`:
```typescript
// Change minimum length
minLength={8}  // Instead of 6

// Add password strength validation
if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
  toast.error('Password must contain uppercase, lowercase, and number')
  return
}
```

### Change Link Expiry Time
In Supabase Dashboard:
1. Go to **Authentication > Settings**
2. Find **Magic Link Expiry**
3. Default is 3600 seconds (1 hour)
4. Can increase up to 86400 seconds (24 hours)

### Custom Email Domain
1. Go to **Settings > Auth** in Supabase
2. Add custom SMTP settings
3. Verify domain ownership
4. Update email templates with custom branding

## Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Password Reset API](https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail)
- [Update User API](https://supabase.com/docs/reference/javascript/auth-updateuser)

## Support

For issues or questions:
1. Check Supabase Dashboard logs
2. Review browser console errors
3. Test with different email providers
4. Verify Supabase project configuration

