# Disable Email Confirmation for Development

By default, Supabase requires users to confirm their email address before they can sign in. For development purposes, you can disable this requirement.

## Steps to Disable Email Confirmation:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers** (in the left sidebar)
3. Click on **Email** provider
4. Scroll down to find **"Confirm email"** section
5. **Uncheck** the "Enable email confirmations" checkbox
6. Click **Save**

## After Disabling:

- Users can sign up and immediately sign in without email confirmation
- This is recommended for development/testing only
- For production, you should keep email confirmation enabled for security

## Alternative: Use Magic Link (Passwordless)

If you prefer, you can also enable Magic Link authentication which doesn't require email confirmation:
1. Go to **Authentication** → **Providers**
2. Enable **Email (Magic Link)**
3. Users will receive a magic link to sign in

## Note:

After making changes to authentication settings, you may need to:
- Clear your browser cache
- Sign out and sign up again with a new account
- Or manually confirm existing users in the Supabase dashboard under **Authentication** → **Users**
