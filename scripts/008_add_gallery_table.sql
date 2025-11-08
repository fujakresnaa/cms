-- Create gallery table for images
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow anyone to view gallery" ON public.gallery
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated to manage gallery" ON public.gallery
  FOR ALL USING (true);

-- Create index for sorting
CREATE INDEX IF NOT EXISTS idx_gallery_sort_order ON public.gallery(sort_order DESC);
