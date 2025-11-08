-- Create members table
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  phone_number text not null,
  city text not null,
  car_variant text not null,
  year_car text not null,
  license_plate text not null unique,
  photo_url text,
  status text default 'pending', -- pending, approved, rejected
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create showcase table for cars
create table if not exists public.showcase (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text,
  created_at timestamp with time zone default now()
);

-- Create contact messages table
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.members enable row level security;
alter table public.events enable row level security;
alter table public.showcase enable row level security;
alter table public.contact_messages enable row level security;

-- Create policies for members (public can insert, anyone can view)
create policy "Allow public to insert members" on public.members
  for insert with check (true);

create policy "Allow anyone to view members" on public.members
  for select using (true);

-- Create policies for events (anyone can view)
create policy "Allow anyone to view events" on public.events
  for select using (true);

-- Create policies for showcase (anyone can view)
create policy "Allow anyone to view showcase" on public.showcase
  for select using (true);

-- Create policies for contact messages (public can insert)
create policy "Allow public to insert contact messages" on public.contact_messages
  for insert with check (true);

-- Insert sample events
insert into public.events (title, description, icon) values
  ('City Night Drive', 'Experience the urban landscape with our exclusive city night drives through illuminated streets.', 'car'),
  ('Weekend Touring Escape', 'Escape to scenic routes and breathtaking views during our weekend touring adventures.', 'navigation'),
  ('Tech & Care Workshop', 'Learn cutting-edge maintenance and technology tips from expert enthusiasts.', 'wrench'),
  ('Charity Drive', 'A special gathering combining luxury touring and giving back to the community.', 'heart'),
  ('Member Meet & Expo', 'Connect with fellow W205CI owners and showcase your vehicle at our exclusive expo.', 'users'),
  ('Track Day Experience', 'An exhilarating opportunity to explore the full performance of the W205CI.', 'zap')
on conflict do nothing;

-- Insert sample showcase cars
insert into public.showcase (image_url, title) values
  ('/placeholder.svg?key=v4bm2', 'White Elegance'),
  ('/placeholder.svg?key=9rxjg', 'City Night'),
  ('/placeholder.svg?key=400qp', 'Urban Sprint'),
  ('/placeholder.svg?key=mrjfi', 'Performance')
on conflict do nothing;
