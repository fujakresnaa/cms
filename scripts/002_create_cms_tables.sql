-- Create CMS tables for site configuration

-- About section content
CREATE TABLE IF NOT EXISTS cms_about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'The Mercedes-Benz W205CI Club is more than a club',
  description TEXT NOT NULL DEFAULT 'The Mercedes-Benz W205CI Club is more than a gathering of car owners — it is a family built on passion, solidarity, and premium lifestyle. Founded by enthusiasts, for enthusiasts, we are dedicated to celebrating the timeless elegance and driving experience of the W205CI.',
  button_text TEXT NOT NULL DEFAULT 'Learn More',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Logo configuration
CREATE TABLE IF NOT EXISTS cms_logo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_text TEXT NOT NULL DEFAULT 'MBW205CI',
  logo_subtext TEXT NOT NULL DEFAULT 'Club Indonesia',
  logo_image_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Benefits/Features
CREATE TABLE IF NOT EXISTS cms_benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_type TEXT DEFAULT 'gift',
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social media links
CREATE TABLE IF NOT EXISTS cms_social_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_type TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(platform)
);

-- Get in touch messages
CREATE TABLE IF NOT EXISTS cms_get_in_touch (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Get in touch',
  description TEXT NOT NULL DEFAULT 'Our friendly team would love to hear from you',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cms_about ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_logo ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_social_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_get_in_touch ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public to view about" ON cms_about FOR SELECT USING (true);
CREATE POLICY "Allow authenticated to update about" ON cms_about FOR UPDATE USING (true);

CREATE POLICY "Allow public to view logo" ON cms_logo FOR SELECT USING (true);
CREATE POLICY "Allow authenticated to update logo" ON cms_logo FOR UPDATE USING (true);

CREATE POLICY "Allow public to view benefits" ON cms_benefits FOR SELECT USING (true);
CREATE POLICY "Allow authenticated to manage benefits" ON cms_benefits FOR ALL USING (true);

CREATE POLICY "Allow public to view social media" ON cms_social_media FOR SELECT USING (true);
CREATE POLICY "Allow authenticated to manage social media" ON cms_social_media FOR ALL USING (true);

CREATE POLICY "Allow public to view get_in_touch" ON cms_get_in_touch FOR SELECT USING (true);
CREATE POLICY "Allow authenticated to update get_in_touch" ON cms_get_in_touch FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated to view admin users" ON admin_users FOR SELECT USING (true);
CREATE POLICY "Allow authenticated to manage admin users" ON admin_users FOR ALL USING (true);

-- Insert default values
INSERT INTO cms_about (title, description) VALUES (
  'The Mercedes-Benz W205CI Club is more than a club',
  'The Mercedes-Benz W205CI Club is more than a gathering of car owners — it is a family built on passion, solidarity, and premium lifestyle. Founded by enthusiasts, for enthusiasts, we are dedicated to celebrating the timeless elegance and driving experience of the W205CI.'
) ON CONFLICT DO NOTHING;

INSERT INTO cms_logo (logo_text, logo_subtext) VALUES (
  'MBW205CI',
  'Club Indonesia'
) ON CONFLICT DO NOTHING;

INSERT INTO cms_get_in_touch (title, description) VALUES (
  'Get in touch',
  'Our friendly team would love to hear from you'
) ON CONFLICT DO NOTHING;

INSERT INTO cms_social_media (platform, url, icon_type) VALUES
  ('whatsapp', '#', 'message-circle'),
  ('youtube', '#', 'youtube'),
  ('instagram', '#', 'instagram'),
  ('facebook', '#', 'facebook')
ON CONFLICT (platform) DO NOTHING;

INSERT INTO cms_benefits (title, description, icon_type, sort_order) VALUES
  ('City Night Drive', 'Experience thrilling city night drives with fellow W205CI owners under the stars', 'moon', 1),
  ('Weekend Touring Escape', 'Embark on exciting weekend touring escapes enjoying the performance of the W205CI', 'map', 2),
  ('Tech & Care Workshop', 'Acquire expertise with our comprehensive tech and care workshops for W205CI maintenance', 'wrench', 3),
  ('Charity Drive', 'A social gathering combining luxury touring with giving back to the community', 'heart', 4),
  ('Fashion Meet & Expo', 'A grand meeting showcasing W205CI vehicles paired with exclusive lifestyle experiences', 'shopping-bag', 5),
  ('Tech Day Experience', 'An exclusive opportunity to explore new technologies and innovations for your W205CI', 'zap', 6)
ON CONFLICT DO NOTHING;
