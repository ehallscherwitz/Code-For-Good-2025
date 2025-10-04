-- Comprehensive troubleshooting script for user_id update
-- Run this in your Supabase SQL editor to diagnose the issue

-- 1. Check if user_id column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'athlete' AND column_name = 'user_id';

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'family' AND column_name = 'user_id';

-- 2. Check current data in athlete table
SELECT athlete_id, athlete_name, user_id FROM athlete LIMIT 5;

-- 3. Check current data in family table  
SELECT parent_id, parent_name, user_id FROM family LIMIT 5;

-- 4. Try to add the column if it doesn't exist (case-sensitive)
ALTER TABLE athlete ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE family ADD COLUMN IF NOT EXISTS user_id TEXT;

-- 5. Update with explicit WHERE clause
UPDATE athlete 
SET user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d' 
WHERE athlete_id IN (SELECT athlete_id FROM athlete LIMIT 1);

UPDATE family 
SET user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d' 
WHERE parent_id IN (SELECT parent_id FROM family LIMIT 1);

-- 6. Verify the update worked
SELECT athlete_id, athlete_name, user_id FROM athlete WHERE user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d';
SELECT parent_id, parent_name, user_id FROM family WHERE user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d';

-- 7. If still no results, try updating all records
UPDATE athlete SET user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d' WHERE user_id IS NULL;
UPDATE family SET user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d' WHERE user_id IS NULL;

-- 8. Final check
SELECT COUNT(*) as athlete_count FROM athlete WHERE user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d';
SELECT COUNT(*) as family_count FROM family WHERE user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d';
