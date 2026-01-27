-- Migration: Add event_date column to events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS event_date DATE;

-- Update existing records if needed (optional)
-- UPDATE public.events SET event_date = created_at::DATE WHERE event_date IS NULL;
