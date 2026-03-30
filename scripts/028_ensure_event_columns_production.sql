-- Migration: Ensure all event columns exist in production
-- This fixes the "Failed to update event" error when columns are missing

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS header_image TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS event_time TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'upcoming';

-- Update comments for clarity
COMMENT ON COLUMN public.events.header_image IS 'URL to the header image for the event detail page';
COMMENT ON COLUMN public.events.status IS 'Status of the event: upcoming, past event, coming soon';
