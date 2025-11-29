# Supabase Setup Instructions

This application uses Supabase for authentication and data storage. Follow these steps to set up Supabase:

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - **Name**: biofactor (or any name you prefer)
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to your users
5. Click "Create new project"

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** (gear icon)
2. Click on **API**
3. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public key** (under "Project API keys" → "anon public")

## Step 3: Configure Environment Variables

1. Create a `.env` file in the root directory of your project
2. Add the following variables:

```env
REACT_APP_SUPABASE_URL=your_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the values you copied from Step 2.

**Example:**
```env
REACT_APP_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Enable Email Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** provider is enabled
3. Configure email settings if needed (SMTP settings for production)

## Step 5: Install Dependencies

If you haven't already, install the Supabase client:

```bash
npm install
```

This will install `@supabase/supabase-js` which is already added to package.json.

## Step 6: Restart Development Server

After creating the `.env` file, restart your development server:

```bash
npm start
```

## Features Using Supabase

- **User Authentication**: Login and Signup are now handled by Supabase Auth
- **Secure Storage**: User data is stored securely in Supabase
- **Session Management**: Automatic session management and persistence

## Notes

- Make sure your `.env` file is in the root directory (same level as `package.json`)
- Never commit your `.env` file to version control (it's already in `.gitignore`)
- The `.env` file is required for the application to work with Supabase
- In production, set these environment variables in your hosting platform (Vercel, Netlify, etc.)

## Troubleshooting

If you encounter authentication errors:
1. Verify your Supabase URL and anon key are correct
2. Check that Email provider is enabled in Supabase dashboard
3. Make sure your `.env` file is in the root directory
4. Restart your development server after creating/updating `.env`

