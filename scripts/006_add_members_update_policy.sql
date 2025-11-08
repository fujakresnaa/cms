-- Add UPDATE policy for members table to allow admins to update member status
create policy "Allow authenticated users to update members" on public.members
  for update using (true)
  with check (true);
