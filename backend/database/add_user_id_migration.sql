-- Migration script to add user_id columns to existing tables
-- Run this in your Supabase SQL editor

-- Add user_id column to ATHLETE table
ALTER TABLE athlete ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Add user_id column to FAMILY table  
ALTER TABLE FAMILY ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Update existing sample data with placeholder user IDs
-- You'll need to replace these with actual Supabase user IDs from your auth.users table

-- Update athletes with sample user IDs (replace with real user IDs)
UPDATE athlete SET user_id = 'sample-athlete-user-1' WHERE athlete_name = 'Sarah Johnson';
UPDATE athlete SET user_id = 'sample-athlete-user-2' WHERE athlete_name = 'Michael Chen';
UPDATE athlete SET user_id = 'sample-athlete-user-3' WHERE athlete_name = 'Emily Rodriguez';
UPDATE athlete SET user_id = 'sample-athlete-user-4' WHERE athlete_name = 'David Thompson';
UPDATE athlete SET user_id = 'sample-athlete-user-5' WHERE athlete_name = 'Jessica Williams';

-- Update families with sample user IDs (replace with real user IDs)
UPDATE family SET user_id = 'sample-family-user-1' WHERE parent_name = 'John Smith';
UPDATE family SET user_id = 'sample-family-user-2' WHERE parent_name = 'Maria Garcia';
UPDATE family SET user_id = 'sample-family-user-3' WHERE parent_name = 'Robert Johnson';
UPDATE family SET user_id = 'sample-family-user-4' WHERE parent_name = 'Lisa Brown';
UPDATE family SET user_id = 'sample-family-user-5' WHERE parent_name = 'James Wilson';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_athlete_user_id ON athlete(user_id);
CREATE INDEX IF NOT EXISTS idx_family_user_id ON family(user_id);

-- To get your actual user IDs, run this query in Supabase:
-- SELECT id, email FROM auth.users;
-- Then update the user_id fields with the real IDs from that query
