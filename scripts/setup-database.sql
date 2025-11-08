-- Setup database tables for MBW205CI project

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create cms_hero table
CREATE TABLE IF NOT EXISTS cms_hero (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  button_text TEXT NOT NULL DEFAULT 'Continue Registration →',
  background_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create cms_contact table
CREATE TABLE IF NOT EXISTS cms_contact (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Get in touch',
  description TEXT NOT NULL DEFAULT 'Our friendly team would love to hear from you. Send us a message anytime.',
  phone TEXT NOT NULL DEFAULT '+62 XXX XXXX XXXX',
  email TEXT NOT NULL DEFAULT 'info@mbw205ci.com',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default hero data if not exists
INSERT INTO cms_hero (title, description, button_text)
SELECT 
  'Your Journey with MBW205CI Starts Here',
  'Register now to become part of an exclusive community of Mercedes Benz W205 owners in Indonesia. More than a club, MBW205CI is a family built on passion, solidarity, and premium lifestyle.',
  'Continue Registration →'
WHERE NOT EXISTS (SELECT 1 FROM cms_hero);

-- Insert default contact data if not exists
INSERT INTO cms_contact (title, description, phone, email)
SELECT 
  'Get in touch',
  'Our friendly team would love to hear from you. Send us a message anytime.',
  '+62 XXX XXXX XXXX',
  'info@mbw205ci.com'
WHERE NOT EXISTS (SELECT 1 FROM cms_contact);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_cms_hero_updated_at ON cms_hero(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_cms_contact_updated_at ON cms_contact(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_contact ENABLE ROW LEVEL SECURITY;

-- Create policies for contact_messages (allow insert for everyone, select for authenticated users)
CREATE POLICY "allow_insert_contact_messages" ON contact_messages FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "allow_select_contact_messages" ON contact_messages FOR SELECT TO authenticated USING (true);

-- Create policies for cms_hero (allow select for everyone, insert/update for authenticated users)
CREATE POLICY "allow_select_cms_hero" ON cms_hero FOR SELECT TO public USING (true);
CREATE POLICY "allow_insert_cms_hero" ON cms_hero FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "allow_update_cms_hero" ON cms_hero FOR UPDATE TO authenticated USING (true);

-- Create policies for cms_contact (allow select for everyone, insert/update for authenticated users)
CREATE POLICY "allow_select_cms_contact" ON cms_contact FOR SELECT TO public USING (true);
CREATE POLICY "allow_insert_cms_contact" ON cms_contact FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "allow_update_cms_contact" ON cms_contact FOR UPDATE TO authenticated USING (true);