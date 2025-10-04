-- Debug and fix user_id issue - handles case sensitivity
-- Run this in your Supabase SQL editor

-- 1. Check what tables actually exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name ILIKE '%athlete%' OR table_name ILIKE '%family%';

-- 2. Check if columns exist in both cases
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND (table_name = 'athlete' OR table_name = 'ATHLETE')
AND column_name = 'user_id';

SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND (table_name = 'family' OR table_name = 'FAMILY')
AND column_name = 'user_id';

-- 3. Add columns to both possible table names
ALTER TABLE athlete ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE ATHLETE ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE family ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE FAMILY ADD COLUMN IF NOT EXISTS user_id TEXT;

-- 4. Update both possible table names
UPDATE athlete SET user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d' WHERE user_id IS NULL;
UPDATE ATHLETE SET user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d' WHERE user_id IS NULL;
UPDATE family SET user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d' WHERE user_id IS NULL;
UPDATE FAMILY SET user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d' WHERE user_id IS NULL;

-- 5. Check results from both tables
SELECT 'athlete' as table_name, athlete_id, athlete_name, user_id FROM athlete WHERE user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d'
UNION ALL
SELECT 'ATHLETE' as table_name, athlete_id, athlete_name, user_id FROM ATHLETE WHERE user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d';

SELECT 'family' as table_name, parent_id, parent_name, user_id FROM family WHERE user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d'
UNION ALL  
SELECT 'FAMILY' as table_name, parent_id, parent_name, user_id FROM FAMILY WHERE user_id = '2b2d4568-bbe6-4c32-8373-a58dbf43583d';
