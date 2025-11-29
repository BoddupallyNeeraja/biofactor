# Supabase Setup Guide

This project now uses **Supabase Auth** for authentication and **Supabase Database** for storage. Follow these steps to set up your Supabase connection.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be fully provisioned (this may take a few minutes)

## 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon/public key**

## 3. Set Up Environment Variables

1. Create a `.env` file in the root of your project
2. Add the following variables:

```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with your actual values from step 2.

**Important:** The `.env` file is already in `.gitignore` and won't be committed to version control.

## 4. Create Database Tables

Run the SQL migration script in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the contents of `supabase_migration.sql`
5. Click **Run** to execute the migration

This will create:
- `profiles` table - Extends Supabase Auth users with additional data (name, etc.)
- `carts` table - Stores user shopping carts
- Row Level Security (RLS) policies for secure data access
- Automatic profile creation trigger when users sign up

## 5. Configure Supabase Auth (Optional)

By default, Supabase requires email confirmation. If you want to disable this for development:

1. Go to **Authentication** → **Settings** in your Supabase dashboard
2. Under **Email Auth**, you can toggle "Enable email confirmations"
3. For production, it's recommended to keep email confirmations enabled

## 6. Install Dependencies

Run the following command to install the Supabase client:

```bash
npm install
```

## 7. Start Your Application

```bash
npm start
```

## How It Works

### Authentication
- **Sign Up**: Uses Supabase Auth `signUp()` method
- **Sign In**: Uses Supabase Auth `signInWithPassword()` method
- **Sign Out**: Uses Supabase Auth `signOut()` method
- **Session Management**: Handled automatically by Supabase Auth
- User data is stored in `auth.users` table (managed by Supabase)
- Additional user metadata (name) is stored in `profiles` table

### Storage
- **User Profiles**: Stored in `profiles` table, automatically created on signup
- **Shopping Carts**: Stored in `carts` table, linked to user ID
- **Guest Carts**: Stored in sessionStorage as fallback for non-authenticated users

### Security
- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data
- All authentication is handled securely by Supabase Auth

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure you've created a `.env` file in the root directory
- Verify that the variable names start with `REACT_APP_`
- Restart your development server after creating/updating `.env`

### "User already exists" error
- This means the email is already registered
- Try logging in instead, or use a different email

### Email confirmation required
- Check your email inbox (and spam folder) for the confirmation email
- Click the confirmation link to verify your account
- Or disable email confirmations in Supabase Auth settings for development

### Cart not saving
- Make sure you're logged in (carts are only saved to Supabase for authenticated users)
- Check browser console for any errors
- Verify that the `carts` table was created successfully

## Next Steps

- Customize user profiles with additional fields
- Add order history functionality
- Implement password reset functionality
- Add social authentication (Google, GitHub, etc.)
