-- Create cms_hero table for hero section management
CREATE TABLE IF NOT EXISTS public.cms_hero (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Your Journey with MBW205CI Starts Here',
  description TEXT NOT NULL DEFAULT 'Register now to become part of an exclusive community of Mercedes Benz W205 owners in Indonesia. More than a club, MBW205CI is a family built on passion, solidarity, and premium lifestyle.',
  button_text TEXT NOT NULL DEFAULT 'Continue Registration →',
  background_image_url TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cms_hero ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow public to read cms_hero"
  ON public.cms_hero FOR SELECT USING (true);

CREATE POLICY "Allow authenticated to update cms_hero"
  ON public.cms_hero FOR UPDATE USING (auth.role() = 'authenticated');

INSERT INTO public.cms_hero (title, description, button_text)
VALUES (
  'Your Journey with MBW205CI Starts Here',
  'Register now to become part of an exclusive community of Mercedes Benz W205 owners in Indonesia. More than a club, MBW205CI is a family built on passion, solidarity, and premium lifestyle.',
  'Continue Registration →'
)
ON CONFLICT DO NOTHING;
