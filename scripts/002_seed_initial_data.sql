-- Seed initial data for CMS configuration

-- Insert default footer configuration
INSERT INTO cms_footer (company_name, description, phone, email, address, copyright_year, copyright_text)
VALUES (
  'Mercedes-Benz W205CI Club Indonesia',
  'Your Ultimate Community for W205CI Enthusiasts',
  '+62 123 456 7890',
  'contact@mbw205ci.id',
  'Indonesia',
  EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
  'Mercedes-Benz W205CI Club Indonesia. All rights reserved.'
)
ON CONFLICT DO NOTHING;

-- Insert default about section
INSERT INTO cms_about (title, description, button_text)
VALUES (
  'About Us',
  'Mercedes-Benz W205CI Club Indonesia is a community dedicated to enthusiasts and owners of Mercedes-Benz W205 C-Class vehicles.',
  'Learn More'
)
ON CONFLICT DO NOTHING;

-- Insert default contact section
INSERT INTO cms_contact (title, description, phone, email)
VALUES (
  'Contact Us',
  'Our friendly team would love to hear from you. Send us a message anytime.',
  '+62 123 456 7890',
  'contact@mbw205ci.id'
)
ON CONFLICT DO NOTHING;

-- Insert default logo
INSERT INTO cms_logo (text, subtext)
VALUES (
  'MBW205CI',
  'Club Indonesia'
)
ON CONFLICT DO NOTHING;

-- Insert default hero section
INSERT INTO cms_hero (title, description, button_text)
VALUES (
  'Welcome to Mercedes-Benz W205CI Club Indonesia',
  'Join our exclusive community of automotive enthusiasts and connect with fellow W205 owners.',
  'Register Now'
)
ON CONFLICT DO NOTHING;

-- Insert default membership section
INSERT INTO cms_membership (title, description, stats)
VALUES (
  'Membership Benefits',
  'Become a member and enjoy exclusive benefits and privileges.',
  '[
    {"label": "Active Members", "value": "500+"},
    {"label": "Events Yearly", "value": "12+"},
    {"label": "Cities Covered", "value": "8"}
  ]'::JSONB
)
ON CONFLICT DO NOTHING;

-- Insert social media links
INSERT INTO cms_social_media (platform, url, icon_type)
VALUES 
  ('facebook', 'https://facebook.com', 'facebook'),
  ('instagram', 'https://instagram.com', 'instagram'),
  ('youtube', 'https://youtube.com', 'youtube'),
  ('whatsapp', 'https://whatsapp.com', 'whatsapp')
ON CONFLICT DO NOTHING;

-- Insert sample benefits
INSERT INTO cms_benefits (title, description, icon_type, sort_order)
VALUES 
  ('Exclusive Events', 'Access to exclusive club events and meetups', 'calendar', 1),
  ('Community Support', 'Connect with fellow W205 enthusiasts', 'users', 2),
  ('Technical Resources', 'Access to maintenance tips and technical guides', 'wrench', 3),
  ('Member Discounts', 'Special discounts from partner businesses', 'gift', 4)
ON CONFLICT DO NOTHING;
