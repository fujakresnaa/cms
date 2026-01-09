-- Centralized Database Schema for MRC CMS
-- Consolidates all tables, policies, and initial data.
-- Optimized with correct indexes and constraints.

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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
  deleted_at TIMESTAMP WITH TIME ZONE,
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

-- Gallery table
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
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

-- CMS Footer section
CREATE TABLE IF NOT EXISTS public.cms_footer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  copyright_year INTEGER,
  copyright_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Admin Users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Admin Sessions table
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);


-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

-- Members
CREATE INDEX IF NOT EXISTS idx_members_status ON public.members(status);
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);
CREATE INDEX IF NOT EXISTS idx_members_created_at ON public.members(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_members_name ON public.members(full_name);

-- Contact Messages
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);

-- Events
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events(created_at DESC);

-- Benefits
CREATE INDEX IF NOT EXISTS idx_cms_benefits_sort_order ON public.cms_benefits(sort_order);

-- Gallery
CREATE INDEX IF NOT EXISTS idx_gallery_sort_order ON public.gallery(sort_order);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON public.gallery(created_at DESC);

-- Showcase
CREATE INDEX IF NOT EXISTS idx_showcase_created_at ON public.showcase(created_at DESC);

-- Admin Authentication
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON public.admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON public.admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON public.admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);


-- ============================================================
-- ROW LEVEL SECURITY (Generic Postgres Implementation)
-- ============================================================
-- Note: In a purely pg+node app without Supabase Auth middleware, RLS might not be automatically enforced 
-- unless the app sets `current_user` or similar session variables. 
-- However, we retain these for compatibility or if using a PostgREST-like layer.
-- The application code (lib/database.ts) handles authorization explicitly via `admin_sessions` check.

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
ALTER TABLE public.cms_footer ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Simple policies (Permissive for now as Auth is handled in App Layer)
-- In a real RLS setup, we would define policies based on current_setting('app.user_id') etc.
-- For now, we allow operations to satisfy the application's direct connection usage (which acts as superuser usually or db owner).
-- If connecting as a restricted user, these would need specific logic.


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

-- Seed Admin User (Default)
-- Password: password123 (hash: 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8)
INSERT INTO public.admin_users (email, password_hash, name, is_active)
SELECT 'admin@mrc.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'Admin User', true
WHERE NOT EXISTS (SELECT 1 FROM public.admin_users WHERE email = 'admin@mrc.com');

-- Additional Admin: admin@mbw205ci.di / password123
INSERT INTO public.admin_users (email, password_hash, name, is_active)
SELECT 'admin@mbw205ci.di', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'MBW Admin', true
WHERE NOT EXISTS (SELECT 1 FROM public.admin_users WHERE email = 'admin@mbw205ci.di');

