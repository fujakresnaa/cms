-- Consolidated and Optimized MRC Database Schema
-- This script consolidates all tables and policies for efficient management

-- ============================================================
-- TABLES
-- ============================================================

-- Members table
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL,
  city TEXT NOT NULL,
  car_variant TEXT NOT NULL,
  year_car TEXT NOT NULL,
  license_plate TEXT NOT NULL UNIQUE,
  photo_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Showcase table
CREATE TABLE IF NOT EXISTS public.showcase (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CMS About section
CREATE TABLE IF NOT EXISTS public.cms_about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  button_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CMS Benefits
CREATE TABLE IF NOT EXISTS public.cms_benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_type TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CMS Social Media
CREATE TABLE IF NOT EXISTS public.cms_social_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  icon_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CMS Contact section
CREATE TABLE IF NOT EXISTS public.cms_contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CMS Membership section
CREATE TABLE IF NOT EXISTS public.cms_membership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  stats JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CMS Logo
CREATE TABLE IF NOT EXISTS public.cms_logo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  subtext TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CMS Hero section
CREATE TABLE IF NOT EXISTS public.cms_hero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  button_text TEXT NOT NULL,
  background_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_members_status ON public.members(status);
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);
CREATE INDEX IF NOT EXISTS idx_members_created_at ON public.members(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cms_benefits_sort_order ON public.cms_benefits(sort_order);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showcase ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_social_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_membership ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_logo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_hero ENABLE ROW LEVEL SECURITY;

-- Members policies
DROP POLICY IF EXISTS "Allow public to insert members" ON public.members;
DROP POLICY IF EXISTS "Allow anyone to view members" ON public.members;
DROP POLICY IF EXISTS "Allow members update" ON public.members;

CREATE POLICY "Allow public to insert members" ON public.members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anyone to view members" ON public.members FOR SELECT USING (true);
CREATE POLICY "Allow members update" ON public.members FOR UPDATE USING (true) WITH CHECK (true);

-- Events policies
DROP POLICY IF EXISTS "Allow anyone to view events" ON public.events;
DROP POLICY IF EXISTS "Allow event management" ON public.events;

CREATE POLICY "Allow anyone to view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow event management" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow event update" ON public.events FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow event delete" ON public.events FOR DELETE USING (true);

-- Showcase policies
DROP POLICY IF EXISTS "Allow anyone to view showcase" ON public.showcase;

CREATE POLICY "Allow anyone to view showcase" ON public.showcase FOR SELECT USING (true);

-- Contact messages policies
DROP POLICY IF EXISTS "Allow public to insert contact messages" ON public.contact_messages;

CREATE POLICY "Allow public to insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow viewing contact messages" ON public.contact_messages FOR SELECT USING (true);

-- CMS policies (allow public read, authenticated write/update)
DROP POLICY IF EXISTS "Allow viewing cms_about" ON public.cms_about;
CREATE POLICY "Allow viewing cms_about" ON public.cms_about FOR SELECT USING (true);
CREATE POLICY "Allow cms_about management" ON public.cms_about FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow cms_about update" ON public.cms_about FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow viewing cms_benefits" ON public.cms_benefits;
CREATE POLICY "Allow viewing cms_benefits" ON public.cms_benefits FOR SELECT USING (true);
CREATE POLICY "Allow cms_benefits management" ON public.cms_benefits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow cms_benefits update" ON public.cms_benefits FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow cms_benefits delete" ON public.cms_benefits FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow viewing cms_social_media" ON public.cms_social_media;
CREATE POLICY "Allow viewing cms_social_media" ON public.cms_social_media FOR SELECT USING (true);
CREATE POLICY "Allow cms_social_media management" ON public.cms_social_media FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow cms_social_media update" ON public.cms_social_media FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow viewing cms_contact" ON public.cms_contact;
CREATE POLICY "Allow viewing cms_contact" ON public.cms_contact FOR SELECT USING (true);
CREATE POLICY "Allow cms_contact management" ON public.cms_contact FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow cms_contact update" ON public.cms_contact FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow viewing cms_membership" ON public.cms_membership;
CREATE POLICY "Allow viewing cms_membership" ON public.cms_membership FOR SELECT USING (true);
CREATE POLICY "Allow cms_membership management" ON public.cms_membership FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow cms_membership update" ON public.cms_membership FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow viewing cms_logo" ON public.cms_logo;
CREATE POLICY "Allow viewing cms_logo" ON public.cms_logo FOR SELECT USING (true);
CREATE POLICY "Allow cms_logo management" ON public.cms_logo FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow cms_logo update" ON public.cms_logo FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow viewing cms_hero" ON public.cms_hero;
CREATE POLICY "Allow viewing cms_hero" ON public.cms_hero FOR SELECT USING (true);
CREATE POLICY "Allow cms_hero management" ON public.cms_hero FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow cms_hero update" ON public.cms_hero FOR UPDATE USING (true) WITH CHECK (true);

-- ============================================================
-- INITIAL DATA (Only inserts if tables are empty)
-- ============================================================

INSERT INTO public.cms_about (title, description, button_text)
SELECT 'About Our Club', 'Join the Mercedes-Benz W205CI community...', 'Learn More'
WHERE NOT EXISTS (SELECT 1 FROM public.cms_about);

INSERT INTO public.cms_logo (text, subtext, image_url)
SELECT 'MBW', 'Mercedes Benz Club', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.cms_logo);

INSERT INTO public.cms_hero (title, description, button_text)
SELECT 'Your Journey Starts Here', 'Experience the perfect blend of luxury and performance', 'Continue Registration →'
WHERE NOT EXISTS (SELECT 1 FROM public.cms_hero);

INSERT INTO public.cms_contact (title, description, phone, email)
SELECT 'Get in Touch', 'We would love to hear from you', '+62 XXX XXXX XXXX', 'info@mbw.id'
WHERE NOT EXISTS (SELECT 1 FROM public.cms_contact);

INSERT INTO public.cms_membership (title, description, stats)
SELECT 
  'Mercedes-Benz W205CI Club',
  'Join the exclusive W205CI community',
  '[{"label": "Members", "value": "500+"}, {"label": "Events", "value": "20+"}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.cms_membership);

INSERT INTO public.cms_benefits (title, description, icon_type, sort_order)
SELECT 'Exclusive Events', 'Access to members-only events and gatherings', 'calendar', 1
WHERE NOT EXISTS (SELECT 1 FROM public.cms_benefits WHERE title = 'Exclusive Events')
UNION ALL
SELECT 'Community Support', 'Connect with fellow enthusiasts', 'users', 2
WHERE NOT EXISTS (SELECT 1 FROM public.cms_benefits WHERE title = 'Community Support')
UNION ALL
SELECT 'Technical Resources', 'Access to maintenance and technical guides', 'book', 3
WHERE NOT EXISTS (SELECT 1 FROM public.cms_benefits WHERE title = 'Technical Resources');

INSERT INTO public.events (title, description, icon)
SELECT 'City Night Drive', 'Experience the urban landscape with our exclusive city night drives', 'car'
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'City Night Drive')
UNION ALL
SELECT 'Weekend Touring Escape', 'Escape to scenic routes and breathtaking views', 'navigation'
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Weekend Touring Escape')
UNION ALL
SELECT 'Tech & Care Workshop', 'Learn maintenance and technology tips', 'wrench'
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Tech & Care Workshop')
UNION ALL
SELECT 'Charity Drive', 'Luxury touring combined with community giving', 'heart'
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Charity Drive')
UNION ALL
SELECT 'Member Meet & Expo', 'Connect and showcase your vehicle', 'users'
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Member Meet & Expo')
UNION ALL
SELECT 'Track Day Experience', 'Explore the full performance potential', 'zap'
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Track Day Experience');
