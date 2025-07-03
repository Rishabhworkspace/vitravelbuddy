
-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cab_rides table
CREATE TABLE public.cab_rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  seats INTEGER NOT NULL DEFAULT 1,
  vehicle_type TEXT DEFAULT '',
  contact TEXT NOT NULL,
  created_by UUID REFERENCES public.users(id),
  status TEXT DEFAULT 'Open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create trips table
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  destination TEXT NOT NULL,
  people_count INTEGER NOT NULL DEFAULT 1,
  accommodation TEXT NOT NULL,
  start_date DATE NOT NULL,
  return_date DATE NOT NULL,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create outings table
CREATE TABLE public.outings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outing_type TEXT NOT NULL,
  destination TEXT NOT NULL,
  people_count INTEGER NOT NULL DEFAULT 1,
  meeting_point TEXT NOT NULL,
  time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create join_requests table
CREATE TABLE public.join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  listing_type TEXT NOT NULL,
  listing_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cab_rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Cab rides policies
CREATE POLICY "Anyone can read cab rides" ON public.cab_rides
  FOR SELECT USING (true);

CREATE POLICY "Users can create cab rides" ON public.cab_rides
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own cab rides" ON public.cab_rides
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own cab rides" ON public.cab_rides
  FOR DELETE USING (auth.uid() = created_by);

-- Trips policies
CREATE POLICY "Anyone can read trips" ON public.trips
  FOR SELECT USING (true);

CREATE POLICY "Users can create trips" ON public.trips
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own trips" ON public.trips
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own trips" ON public.trips
  FOR DELETE USING (auth.uid() = created_by);

-- Outings policies
CREATE POLICY "Anyone can read outings" ON public.outings
  FOR SELECT USING (true);

CREATE POLICY "Users can create outings" ON public.outings
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own outings" ON public.outings
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own outings" ON public.outings
  FOR DELETE USING (auth.uid() = created_by);

-- Join requests policies
CREATE POLICY "Users can create join requests" ON public.join_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own join requests" ON public.join_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own join requests" ON public.join_requests
  FOR DELETE USING (auth.uid() = user_id);
