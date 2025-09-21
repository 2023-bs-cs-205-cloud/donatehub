-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, user_type, organization_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'donor'),
    NEW.raw_user_meta_data ->> 'organization_name'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update campaign current_amount when donation is made
CREATE OR REPLACE FUNCTION public.update_campaign_amount()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.campaigns 
    SET current_amount = current_amount + NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.campaign_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.campaigns 
    SET current_amount = current_amount - OLD.amount,
        updated_at = NOW()
    WHERE id = OLD.campaign_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger to update campaign amount on donation changes
DROP TRIGGER IF EXISTS update_campaign_amount_trigger ON public.donations;
CREATE TRIGGER update_campaign_amount_trigger
  AFTER INSERT OR DELETE ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_campaign_amount();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers to update updated_at on profiles and campaigns
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_campaigns_updated_at ON public.campaigns;
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
