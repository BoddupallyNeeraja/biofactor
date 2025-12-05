-- Migration: Add user_type column to profiles table
-- Run this in your Supabase SQL Editor after running the main migration

-- Add user_type column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'farmer';

-- Create index for faster lookups by user type
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);

-- Update the trigger function to include user_type from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'farmer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add admin policies for viewing all users (for admin dashboard)
-- Note: This allows admins to view all profiles
-- You may want to restrict this based on a user_type = 'admin' check
-- For production, create a proper admin role or use service role key

-- Allow admin users to view all profiles
-- This requires setting up proper admin authentication
-- For now, admins can view profiles if RLS allows
-- You'll need to configure this based on your admin setup

-- Optional: Create a view for admin dashboard
CREATE OR REPLACE VIEW admin_user_view AS
SELECT 
  p.id,
  p.name,
  p.user_type,
  p.created_at,
  p.updated_at
FROM profiles p;

-- Grant access to authenticated users (you may want to restrict this)
-- GRANT SELECT ON admin_user_view TO authenticated;
