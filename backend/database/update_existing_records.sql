-- Check existing data and update with your user ID
-- Run this in your Supabase SQL editor

-- 1. Check what athlete records exist
SELECT athlete_id, athlete_name, user_id FROM athlete LIMIT 10;

-- 2. Check what family records exist  
SELECT parent_id, parent_name, user_id FROM family LIMIT 10;

-- 3. Update the first athlete record with your user ID
UPDATE athlete 
SET user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d' 
WHERE athlete_id = (SELECT athlete_id FROM athlete ORDER BY created_at LIMIT 1);

-- 4. Update the first family record with your user ID
UPDATE family 
SET user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d' 
WHERE parent_id = (SELECT parent_id FROM family ORDER BY created_at LIMIT 1);

-- 5. Verify the updates worked
SELECT 'ATHLETE' as type, athlete_id as id, athlete_name as name, user_id FROM athlete WHERE user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d'
UNION ALL
SELECT 'FAMILY' as type, parent_id as id, parent_name as name, user_id FROM family WHERE user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d';

-- 6. If you want to update ALL records (not just the first one), uncomment these:
-- UPDATE athlete SET user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d' WHERE user_id IS NULL;
-- UPDATE family SET user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d' WHERE user_id IS NULL;
