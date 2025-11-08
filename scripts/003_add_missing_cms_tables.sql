-- Create missing CMS tables for contact and membership sections

-- Contact section content
CREATE TABLE IF NOT EXISTS cms_contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Get in Touch',
  description TEXT NOT NULL DEFAULT 'Our friendly team would love to hear from you. Send us a message anytime.',
  phone TEXT NOT NULL DEFAULT '+62 XXX XXXX XXXX',
  email TEXT NOT NULL DEFAULT 'info@mbw205ci.com',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Membership section content
CREATE TABLE IF NOT EXISTS cms_membership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Join the Brotherhood',
  description TEXT NOT NULL DEFAULT 'Be part of an exclusive circle of W205CI enthusiasts',
  stats JSONB DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events section content
CREATE TABLE IF NOT EXISTS cms_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Club Events',
  description TEXT NOT NULL DEFAULT 'Experience amazing events with fellow W205CI owners',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cms_contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_membership ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public to view contact" ON cms_contact FOR SELECT USING (true);
CREATE POLICY "Allow authenticated to update contact" ON cms_contact FOR UPDATE USING (true);

CREATE POLICY "Allow public to view membership" ON cms_membership FOR SELECT USING (true);
CREATE POLICY "Allow authenticated to update membership" ON cms_membership FOR UPDATE USING (true);

CREATE POLICY "Allow public to view events" ON cms_events FOR SELECT USING (true);
CREATE POLICY "Allow authenticated to update events" ON cms_events FOR UPDATE USING (true);

-- Insert default values
INSERT INTO cms_contact (title, description, phone, email) VALUES (
  'Get in Touch',
  'Our friendly team would love to hear from you. Send us a message anytime.',
  '+62 XXX XXXX XXXX',
  'info@mbw205ci.com'
) ON CONFLICT DO NOTHING;

INSERT INTO cms_membership (title, description, stats) VALUES (
  'Join the Brotherhood',
  'Be part of an exclusive circle of W205CI enthusiasts',
  '[
    {"label": "Member Club", "value": "120+"},
    {"label": "Events Club", "value": "64+"},
    {"label": "Partner W205CI", "value": "20+"}
  ]'
) ON CONFLICT DO NOTHING;

INSERT INTO cms_events (title, description) VALUES (
  'Club Events',
  'Experience amazing events with fellow W205CI owners'
) ON CONFLICT DO NOTHING;
