-- Create a function to get platform statistics
CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS TABLE (
  total_raised DECIMAL,
  total_donors BIGINT,
  total_campaigns BIGINT,
  total_ngos BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(c.current_amount), 0) as total_raised,
    COUNT(DISTINCT d.donor_id) as total_donors,
    COUNT(DISTINCT c.id) as total_campaigns,
    COUNT(DISTINCT p.id) as total_ngos
  FROM campaigns c
  LEFT JOIN donations d ON c.id = d.campaign_id
  LEFT JOIN profiles p ON c.ngo_id = p.id AND p.user_type = 'ngo';
END;
$$;
