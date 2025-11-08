-- Add soft delete column to members table
ALTER TABLE members ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NULL;

-- Create index for soft delete queries
CREATE INDEX IF NOT EXISTS idx_members_deleted_at ON members(deleted_at);

-- Update existing queries to exclude soft-deleted records
-- This is handled in the application code

COMMENT ON COLUMN members.deleted_at IS 'Timestamp when member was soft deleted. NULL means member is active.';
