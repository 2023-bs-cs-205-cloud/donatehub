-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('ngo', 'donor')),
  organization_name TEXT, -- Only for NGO users
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  goal_amount DECIMAL(12,2) NOT NULL CHECK (goal_amount > 0),
  current_amount DECIMAL(12,2) DEFAULT 0 CHECK (current_amount >= 0),
  category TEXT NOT NULL,
  image_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  ngo_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  payment_status TEXT DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Campaigns policies
CREATE POLICY "campaigns_select_all" ON public.campaigns 
  FOR SELECT USING (true); -- Anyone can view campaigns

CREATE POLICY "campaigns_insert_ngo" ON public.campaigns 
  FOR INSERT WITH CHECK (
    auth.uid() = ngo_id AND 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'ngo')
  );

CREATE POLICY "campaigns_update_own" ON public.campaigns 
  FOR UPDATE USING (
    auth.uid() = ngo_id AND 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'ngo')
  );

CREATE POLICY "campaigns_delete_own" ON public.campaigns 
  FOR DELETE USING (
    auth.uid() = ngo_id AND 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'ngo')
  );

-- Donations policies
CREATE POLICY "donations_select_own_or_campaign_owner" ON public.donations 
  FOR SELECT USING (
    auth.uid() = donor_id OR 
    auth.uid() IN (SELECT ngo_id FROM public.campaigns WHERE id = campaign_id)
  );

CREATE POLICY "donations_insert_donor" ON public.donations 
  FOR INSERT WITH CHECK (
    auth.uid() = donor_id AND 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'donor')
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_campaigns_ngo_id ON public.campaigns(ngo_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_category ON public.campaigns(category);
CREATE INDEX IF NOT EXISTS idx_donations_campaign_id ON public.donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON public.donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON public.profiles(user_type);
