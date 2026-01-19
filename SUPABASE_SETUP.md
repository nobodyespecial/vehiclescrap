# Supabase Setup Guide

Follow these steps to set up your Supabase project:

## Step 1: Create a Supabase Account

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up for a free account (or sign in if you already have one)

## Step 2: Create a New Project

1. Click "New Project" button
2. Fill in the project details:
   - **Name**: Choose a name (e.g., "vehicle-scrapping")
   - **Database Password**: Create a strong password (save this - you'll need it)
   - **Region**: Choose the region closest to you
3. Click "Create new project"
4. Wait 2-3 minutes for the project to be provisioned

## Step 3: Get Your API Credentials

1. Once your project is ready, go to **Settings** (gear icon in the left sidebar)
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL** - Copy this value
   - **anon public** key (under "Project API keys") - Copy this value

## Step 4: Update .env.local

1. Open the `.env.local` file in the root of your project
2. Replace the placeholder values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=paste_your_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key_here
   ```

## Step 5: Run the Database Schema

1. In your Supabase project, go to **SQL Editor** (in the left sidebar)
2. Click "New query"
3. Open the file `supabase/schema.sql` from this project
4. Copy the entire contents of that file
5. Paste it into the SQL Editor
6. Click "Run" (or press Ctrl+Enter)
7. You should see a success message: "Success. No rows returned"

## Step 6: Verify the Table

1. Go to **Table Editor** in the left sidebar
2. You should see a `vehicles` table listed
3. Click on it to see the table structure with all columns

## Step 7: Enable Email Authentication (Optional)

By default, Supabase allows email signups. If you want to customize:

1. Go to **Authentication** > **Providers**
2. Ensure "Email" is enabled
3. You can configure email templates and other settings here

## Troubleshooting

- **Can't find API keys**: Make sure you're in Settings > API, not Settings > General
- **SQL errors**: Make sure you copied the entire schema.sql file
- **Connection issues**: Verify your .env.local file has the correct values (no extra spaces or quotes)

## Next Steps

Once you've completed these steps, you can start the development server with:
```bash
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000) and sign up for your first account!
