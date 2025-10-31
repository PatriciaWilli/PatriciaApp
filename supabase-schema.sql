-- ================================================
-- SUPABASE DATABASE SCHEMA FÜR EVENT MANAGER APP
-- ================================================

-- Users Tabelle (erweitert die auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events Tabelle
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  category TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Teilnehmer Tabelle
CREATE TABLE public.event_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, confirmed, declined
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

-- Aktiviere RLS für alle Tabellen
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Events Policies
CREATE POLICY "Users can view all events" 
  ON public.events FOR SELECT 
  USING (true);

CREATE POLICY "Users can create own events" 
  ON public.events FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events" 
  ON public.events FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events" 
  ON public.events FOR DELETE 
  USING (auth.uid() = user_id);

-- Event Participants Policies
CREATE POLICY "Users can view participants of events they're part of" 
  ON public.event_participants FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.events WHERE id = event_id
      UNION
      SELECT user_id FROM public.event_participants WHERE event_id = event_participants.event_id
    )
  );

CREATE POLICY "Event owners can manage participants" 
  ON public.event_participants FOR ALL 
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.events WHERE id = event_id
    )
  );

CREATE POLICY "Users can manage their own participation" 
  ON public.event_participants FOR UPDATE 
  USING (auth.uid() = user_id);

-- ================================================
-- TRIGGERS
-- ================================================

-- Funktion für updated_at Timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für Profiles
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger für Events
CREATE TRIGGER update_events_updated_at 
  BEFORE UPDATE ON public.events 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- AUTOMATIC PROFILE CREATION
-- ================================================

-- Funktion zum automatischen Erstellen eines Profils bei Registrierung
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger für automatische Profil-Erstellung
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- INDEXES FÜR BESSERE PERFORMANCE
-- ================================================

CREATE INDEX idx_events_user_id ON public.events(user_id);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_event_participants_event_id ON public.event_participants(event_id);
CREATE INDEX idx_event_participants_user_id ON public.event_participants(user_id);
