-- ============================================================
-- Migration: Add role column to profiles table
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- 1. Add role column with default 'user' and check constraint
ALTER TABLE public.profiles
ADD COLUMN role TEXT DEFAULT 'user'
CHECK (role IN ('user', 'admin'));

-- 2. Backfill existing rows that may have NULL role
UPDATE public.profiles SET role = 'user' WHERE role IS NULL;

-- 3. Update trigger function to include role on new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, fullname, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- IMPORTANT: After running this migration, you must manually
-- create admin & user accounts via the seed script or Supabase
-- Dashboard, then set role = 'admin' for the admin account.
-- ============================================================
