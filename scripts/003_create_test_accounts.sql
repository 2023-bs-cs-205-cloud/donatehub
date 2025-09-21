-- Create test accounts for DonateHub
-- These accounts will be created with pre-confirmed email addresses

-- Test Donor Account
-- Email: donor@test.com
-- Password: test123
-- Name: John Donor

-- Test NGO Account  
-- Email: ngo@test.com
-- Password: test123
-- Name: Sarah Wilson
-- Organization: Hope Foundation

-- Note: These accounts need to be created through the Supabase Auth system
-- This script creates the profile records that will be linked to the auth users

-- Insert test donor profile (will be linked when auth user is created)
INSERT INTO profiles (
  id,
  email,
  full_name,
  user_type,
  organization_name,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'donor@test.com',
  'John Donor',
  'donor',
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert test NGO profile (will be linked when auth user is created)
INSERT INTO profiles (
  id,
  email,
  full_name,
  user_type,
  organization_name,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'ngo@test.com',
  'Sarah Wilson',
  'ngo',
  'Hope Foundation',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create a sample campaign for the NGO account
INSERT INTO campaigns (
  id,
  title,
  description,
  goal_amount,
  current_amount,
  category,
  status,
  start_date,
  end_date,
  ngo_id,
  image_url,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Clean Water for Rural Communities',
  'Help us provide clean drinking water to 500 families in rural areas. Your donation will fund water purification systems and infrastructure development.',
  50000.00,
  12500.00,
  'Health',
  'active',
  NOW(),
  NOW() + INTERVAL '60 days',
  (SELECT id FROM profiles WHERE email = 'ngo@test.com' LIMIT 1),
  '/placeholder.svg?height=400&width=600',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;
