-- Quick fix: Update athlete record with your actual user ID
-- Replace '2b2d4568-bbe6-4c32-8373-a58dbf43583d' with your actual user ID if different

-- First, make sure the user_id column exists
ALTER TABLE athlete ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE family ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Update the first athlete record with your user ID
UPDATE athlete 
SET user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d' 
WHERE athlete_id = (SELECT athlete_id FROM athlete LIMIT 1);

-- Update the first family record with your user ID  
UPDATE family 
SET user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d' 
WHERE parent_id = (SELECT parent_id FROM family LIMIT 1);

-- Check if it worked
SELECT athlete_id, athlete_name, user_id FROM athlete WHERE user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d';
SELECT parent_id, parent_name, user_id FROM family WHERE user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d';
