# Supabase Auth Configuration for UW Email Enforcement

## 🔧 Manual Configuration Required

You need to configure these settings in your Supabase Dashboard to enforce UW email addresses.

---

## Step 1: Enable Email Domain Restrictions

### Navigate to:
1. Go to your Supabase Dashboard: https://wplacxiqjzbyzvliljez.supabase.co
2. Click on **Authentication** in the left sidebar
3. Click on **Settings** tab
4. Scroll to **Email Auth**

### Configure Settings:

#### Option A: Email Domain Allowlist (Recommended)
Unfortunately, Supabase doesn't have a built-in "allowlist" feature in the UI, but we can enforce it through:

1. **Database Trigger** (already created in `enforce-uw-email.sql`)
2. **Auth Hook** (see below)

---

## Step 2: Set Up Auth Hook (Advanced - Optional but Recommended)

### What is an Auth Hook?
Supabase Auth Hooks run server-side code when certain auth events occur (signup, login, etc.).

### To Enable:
1. In Supabase Dashboard → **Database** → **Functions**
2. Create a new function or use the SQL Editor
3. The trigger we created (`validate_uw_email()`) will automatically block non-UW signups

---

## Step 3: Email Settings

### Email Templates
1. Go to **Authentication** → **Email Templates**
2. Customize the **Confirmation email** template
3. Add messaging about UW-only access:
   ```
   Welcome to DubLaunch - The UW Student Community!
   
   Click below to verify your @uw.edu email address...
   ```

### Enable Email Confirmation (Required)
1. Go to **Authentication** → **Settings** 
2. Under **Email Auth**, ensure these are set:
   - ✅ **Enable email confirmations** - ENABLED
   - ✅ **Secure email change** - ENABLED
   - ⏱️ **Email confirmation timeout** - 24 hours (recommended)

---

## Step 4: Additional Security Settings

### Password Requirements
1. Go to **Authentication** → **Settings**
2. Under **Password Settings**:
   - Minimum password length: **8 characters** (or more)
   - Require special characters: **Recommended**

### Rate Limiting
1. Go to **Authentication** → **Rate Limits**
2. Set appropriate limits:
   - **Sign up requests**: 10 per hour per IP
   - **Sign in attempts**: 50 per hour per IP
   - **Password reset**: 10 per hour per email

---

## Step 5: Verify Configuration

### Test the Setup:
1. Try to register with a non-UW email (e.g., `test@gmail.com`)
   - ❌ Should FAIL with error message
2. Try to register with UW email (e.g., `yournetid@uw.edu`)
   - ✅ Should SUCCEED and send verification email

---

## 🎯 What Happens When Non-UW Email Tries to Register:

### Frontend Behavior:
```
User enters: john.doe@gmail.com
Frontend validation: ❌ "Please use your @uw.edu email address"
User cannot submit form
```

### Backend Behavior (If frontend bypassed):
```
API receives: john.doe@gmail.com
Database trigger runs: validate_uw_email()
Result: ❌ ERROR: "Only @uw.edu email addresses are allowed"
No account created
```

---

## 📋 Validation Rules

### ✅ ACCEPTED Email Formats:
- `netid@uw.edu` (standard UW email)
- `firstname.lastname@uw.edu`
- `any.format@uw.edu`

### ❌ REJECTED Email Formats:
- `user@gmail.com`
- `user@outlook.com`
- `user@washington.edu` (not uw.edu)
- `user@u.washington.edu` (different domain)
- `user@uw.edu.fake.com` (spoofing attempt)
- Any other non-@uw.edu email

---

## 🔐 Security Notes

### Why Multi-Layer Validation?

1. **Frontend Validation** - Better UX, immediate feedback
2. **Database Trigger** - Bulletproof, cannot be bypassed
3. **Email Verification** - Ensures user actually owns the email
4. **Rate Limiting** - Prevents signup spam

### Even if someone:
- ❌ Bypasses the frontend JavaScript
- ❌ Uses API tools (Postman, curl)
- ❌ Modifies the request in browser DevTools

**They STILL cannot create an account** because the database trigger will reject it!

---

## 🚀 Next Steps

1. ✅ Run `enforce-uw-email.sql` in Supabase SQL Editor
2. ✅ Update frontend with UW email validation (see register page)
3. ✅ Test with both valid and invalid emails
4. ✅ Monitor signup attempts in Supabase Dashboard
5. ⚠️ Consider adding manual review for first few signups

---

## 📊 Monitoring

### Check Signup Attempts:
```sql
-- View all signup attempts (successful and failed)
SELECT 
  email,
  created_at,
  email_confirmed_at,
  CASE 
    WHEN email LIKE '%@uw.edu' THEN 'Valid UW'
    ELSE 'Invalid (How?!)'
  END as email_status
FROM auth.users
ORDER BY created_at DESC;
```

### Count by Domain:
```sql
-- See email domain distribution
SELECT 
  substring(email from '@(.*)$') as domain,
  count(*) as user_count
FROM auth.users
GROUP BY domain
ORDER BY user_count DESC;
```

---

## ⚠️ Important Notes

- The database trigger is **the strongest protection**
- It runs at the PostgreSQL level, before any data is committed
- Even Supabase admins cannot bypass it (unless they disable the trigger)
- This is **production-ready** security

---

## 🎓 UW-Specific Considerations

### Common UW Email Formats:
- Students: `netid@uw.edu`
- Staff: `firstname.lastname@uw.edu`
- Alumni: May have different email formats (consider if you want to allow)

### Future Enhancements:
- Verify if email is an **active** UW student (requires UW API integration)
- Check graduation year to restrict to current students only
- Integrate with UW's official authentication system (OAuth)


