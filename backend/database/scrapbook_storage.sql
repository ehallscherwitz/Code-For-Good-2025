-- Scrapbook Storage Setup for Supabase - LOOSE SECURITY VERSION
-- This script sets up storage buckets and policies for the scrapbook feature
-- WARNING: This has very permissive security for easy setup

-- Create the scrapbook storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'scrapbook-images',
  'scrapbook-images',
  true,
  10485760, -- 10MB limit (increased)
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg']
);

-- Create a table to track scrapbook images metadata
CREATE TABLE IF NOT EXISTS scrapbook_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_by TEXT DEFAULT 'anonymous', -- Changed to TEXT for easier use
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  description TEXT,
  is_featured BOOLEAN DEFAULT false
);

-- DISABLE Row Level Security for easier use
ALTER TABLE scrapbook_images DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies to ensure clean setup
DROP POLICY IF EXISTS "Allow public read access to scrapbook images" ON scrapbook_images;
DROP POLICY IF EXISTS "Allow authenticated users to upload scrapbook images" ON scrapbook_images;
DROP POLICY IF EXISTS "Allow users to update their own scrapbook images" ON scrapbook_images;
DROP POLICY IF EXISTS "Allow users to delete their own scrapbook images" ON scrapbook_images;

-- Drop storage policies
DROP POLICY IF EXISTS "Allow public read access to scrapbook images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload scrapbook images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own scrapbook images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own scrapbook images" ON storage.objects;

-- SUPER PERMISSIVE storage policies - anyone can do anything
CREATE POLICY "Allow everything for scrapbook images" ON storage.objects
  FOR ALL USING (bucket_id = 'scrapbook-images');

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_scrapbook_images_uploaded_at ON scrapbook_images(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_scrapbook_images_featured ON scrapbook_images(is_featured) WHERE is_featured = true;
