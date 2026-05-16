-- Migration for Membership and About section updates
-- Add new fields to Membership section
ALTER TABLE cms_membership ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE cms_membership ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add new fields to About section for 2-column layout
ALTER TABLE cms_about ADD COLUMN IF NOT EXISTS image_url_1 TEXT;
ALTER TABLE cms_about ADD COLUMN IF NOT EXISTS image_url_2 TEXT;
