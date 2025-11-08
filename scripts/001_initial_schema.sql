-- Initial database schema for MRC application
-- Run this script to set up the base tables

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(20) NOT NULL,
  city VARCHAR(100),
  car_variant VARCHAR(50),
  year_car VARCHAR(4),
  license_plate VARCHAR(20) UNIQUE,
  photo_url TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CMS Footer table
CREATE TABLE IF NOT EXISTS cms_footer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  description TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  copyright_year INTEGER,
  copyright_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CMS About table
CREATE TABLE IF NOT EXISTS cms_about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  button_text VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CMS Benefits table
CREATE TABLE IF NOT EXISTS cms_benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon_type VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CMS Social Media table
CREATE TABLE IF NOT EXISTS cms_social_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(50) NOT NULL,
  url VARCHAR(500),
  icon_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CMS Contact table
CREATE TABLE IF NOT EXISTS cms_contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CMS Events table
CREATE TABLE IF NOT EXISTS cms_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CMS Logo table
CREATE TABLE IF NOT EXISTS cms_logo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text VARCHAR(100) NOT NULL,
  subtext VARCHAR(100),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CMS Hero table
CREATE TABLE IF NOT EXISTS cms_hero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  button_text VARCHAR(100),
  background_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CMS Membership table
CREATE TABLE IF NOT EXISTS cms_membership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  stats JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admin Users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_created_at ON members(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Enable Row Level Security (RLS) for security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow public read access to non-sensitive CMS tables
ALTER TABLE cms_footer ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_about ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_social_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_logo ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_membership ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access to CMS tables
CREATE POLICY "Enable public read access" ON cms_footer FOR SELECT USING (true);
CREATE POLICY "Enable public read access" ON cms_about FOR SELECT USING (true);
CREATE POLICY "Enable public read access" ON cms_benefits FOR SELECT USING (true);
CREATE POLICY "Enable public read access" ON cms_social_media FOR SELECT USING (true);
CREATE POLICY "Enable public read access" ON cms_contact FOR SELECT USING (true);
CREATE POLICY "Enable public read access" ON cms_events FOR SELECT USING (true);
CREATE POLICY "Enable public read access" ON cms_logo FOR SELECT USING (true);
CREATE POLICY "Enable public read access" ON cms_hero FOR SELECT USING (true);
CREATE POLICY "Enable public read access" ON cms_membership FOR SELECT USING (true);
