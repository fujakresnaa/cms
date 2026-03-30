-- Migration: Add additional columns to events table
-- header_image, event_time, location, status

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS header_image TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS event_time TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'upcoming';
