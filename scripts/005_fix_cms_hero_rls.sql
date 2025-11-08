-- Add missing INSERT policy to cms_hero table to allow upsert operations
CREATE POLICY "Allow authenticated to insert cms_hero"
  ON public.cms_hero FOR INSERT WITH CHECK (auth.role() = 'authenticated');
