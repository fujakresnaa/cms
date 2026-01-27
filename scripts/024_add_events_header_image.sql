-- Migration: Add header_image column to events table
-- Run this script against your PostgreSQL database

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS header_image TEXT;

-- Update the schema.sql comment for reference
COMMENT ON COLUMN public.events.header_image IS 'URL to the header image for the event detail page';
