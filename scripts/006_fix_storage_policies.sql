-- Update RLS policies to allow anonymous uploads during registration
-- Drop existing restrictive policies
drop policy if exists "Authenticated users can upload photos" on storage.objects;
drop policy if exists "Public access to member photos" on storage.objects;

-- Allow anonymous and authenticated users to upload to member-uploads bucket
create policy "Allow uploads to member-uploads" on storage.objects
  for insert with check (
    bucket_id = 'member-uploads'
  );

-- Allow public read access to member photos
create policy "Allow public read access" on storage.objects
  for select using (bucket_id = 'member-uploads');

-- Allow users to delete their own uploads
create policy "Allow delete uploads" on storage.objects
  for delete using (bucket_id = 'member-uploads');

-- Allow updates to own uploads
create policy "Allow update uploads" on storage.objects
  for update using (bucket_id = 'member-uploads');
