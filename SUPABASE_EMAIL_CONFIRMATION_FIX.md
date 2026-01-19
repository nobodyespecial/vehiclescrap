# Fix Email Confirmation Issue - Step by Step Guide

## Option 1: Disable Email Confirmation (Recommended for Development)

### Step 1: Navigate to Email Provider Settings
1. In your Supabase dashboard, look at the **left sidebar**
2. Under **CONFIGURATION** section, click on **"Sign In / Providers"**
3. You'll see a list of authentication providers

### Step 2: Configure Email Provider
1. Find **"Email"** in the providers list
2. Click on it to open the Email provider settings
3. Scroll down to find **"Confirm email"** section
4. **Uncheck** the checkbox that says "Enable email confirmations"
5. Click **"Save"** or **"Update"** button

### Step 3: Test
1. Go back to your application
2. Try signing in with your existing account
3. It should work without email confirmation now

---

## Option 2: Manually Confirm Your User (Keep Email Confirmation Enabled)

### Step 1: Go to Users Page
1. In the left sidebar, under **MANAGE** section, click **"Users"**
2. You should see your user: `gauravsinghitis@gmail.com`

### Step 2: Confirm the User
1. Click on the user row or find the action menu (three dots ⋮)
2. Look for options like:
   - **"Confirm email"**
   - **"Mark as verified"**
   - **"Send confirmation email"**
3. Click the appropriate action to confirm the user

### Step 3: Test
1. Go back to your application
2. Try signing in - it should work now

---

## Option 3: Check Your Email (If Confirmation Email Was Sent)

1. Check your inbox for `gauravsinghitis@gmail.com`
2. Look for an email from Supabase
3. Check your **Spam/Junk folder** as well
4. Click the confirmation link in the email
5. Then try signing in again

---

## Visual Guide Based on Your Screenshot

From your screenshot, I can see:
- You're currently on the **Users** page
- Your user shows **"Waiting for verif"** status
- The left sidebar shows **"Sign In / Providers"** under CONFIGURATION

**Next Steps:**
1. Click **"Sign In / Providers"** in the left sidebar (under CONFIGURATION)
2. Click on **"Email"** provider
3. Disable email confirmations
4. Save changes

---

## After Making Changes

1. **Refresh your browser** on the login page
2. Try signing in again
3. The error should be resolved

If you still have issues, you may need to:
- Clear your browser cache
- Sign out completely
- Try signing in again
