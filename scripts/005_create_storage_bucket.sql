-- Create storage bucket for member uploads if it doesn't exist
insert into storage.buckets (id, name, public)
values ('member-uploads', 'member-uploads', true)
on conflict (id) do nothing;

-- Create RLS policy for public access to member-uploads
create policy "Public access to member photos" on storage.objects
  for select using (bucket_id = 'member-uploads');

-- Create RLS policy for authenticated users to upload
create policy "Authenticated users can upload photos" on storage.objects
  for insert with check (
    bucket_id = 'member-uploads'
    and auth.role() = 'authenticated'
  );
