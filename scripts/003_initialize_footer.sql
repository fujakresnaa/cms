-- Initialize footer configuration with default values
INSERT INTO cms_footer (
  company_name,
  description,
  phone,
  email,
  address,
  copyright_year,
  copyright_text
) VALUES (
  'Mercedes-Benz W205CI Club Indonesia',
  'Your Ultimate Community for W205CI Enthusiasts',
  '+62 123 456 7890',
  'contact@mbw205ci.id',
  'Indonesia',
  2025,
  'Mercedes-Benz W205CI Club Indonesia. All rights reserved.'
)
ON CONFLICT DO NOTHING;
