-- Insert sample NGO profiles (these will be created after user signup)
-- Sample campaigns data
INSERT INTO public.campaigns (
  id,
  title,
  description,
  goal_amount,
  current_amount,
  category,
  image_url,
  end_date,
  ngo_id
) VALUES 
(
  gen_random_uuid(),
  'Clean Water for Rural Communities',
  'Help us provide clean drinking water to remote villages. Your donation will fund water purification systems and infrastructure development.',
  50000.00,
  15000.00,
  'Health',
  '/placeholder.svg?height=400&width=600',
  NOW() + INTERVAL '60 days',
  (SELECT id FROM public.profiles WHERE user_type = 'ngo' LIMIT 1)
),
(
  gen_random_uuid(),
  'Education for Underprivileged Children',
  'Support education initiatives for children in underserved communities. Funds will go towards school supplies, books, and teacher training.',
  25000.00,
  8500.00,
  'Education',
  '/placeholder.svg?height=400&width=600',
  NOW() + INTERVAL '45 days',
  (SELECT id FROM public.profiles WHERE user_type = 'ngo' LIMIT 1)
),
(
  gen_random_uuid(),
  'Emergency Food Relief',
  'Provide emergency food assistance to families affected by natural disasters. Every dollar helps feed a family for a day.',
  30000.00,
  22000.00,
  'Emergency',
  '/placeholder.svg?height=400&width=600',
  NOW() + INTERVAL '30 days',
  (SELECT id FROM public.profiles WHERE user_type = 'ngo' LIMIT 1)
);

-- Note: Sample donations will be created through the application interface
-- to ensure proper user authentication and RLS policies
