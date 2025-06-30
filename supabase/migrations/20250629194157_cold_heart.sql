/*
  # Remove demo user creation from migration

  This migration removes the demo user creation since we cannot create
  auth users directly in SQL migrations. The demo user will need to be
  created through the application's signup flow instead.
  
  The foreign key constraint requires that any user_profiles.id must
  exist in auth.users.id first, which can only be done through the
  Supabase Auth API, not SQL migrations.
*/

-- This migration intentionally does nothing since we cannot create
-- auth users through SQL migrations due to foreign key constraints.
-- Demo users should be created through the application signup flow.

SELECT 1; -- Placeholder to make this a valid migration file