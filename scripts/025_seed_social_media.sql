-- Seed initial social media records if the table is empty
INSERT INTO public.cms_social_media (platform, url, icon_type)
SELECT 'whatsapp', '#', 'whatsapp'
WHERE NOT EXISTS (SELECT 1 FROM public.cms_social_media WHERE platform = 'whatsapp');

INSERT INTO public.cms_social_media (platform, url, icon_type)
SELECT 'youtube', '#', 'youtube'
WHERE NOT EXISTS (SELECT 1 FROM public.cms_social_media WHERE platform = 'youtube');

INSERT INTO public.cms_social_media (platform, url, icon_type)
SELECT 'instagram', '#', 'instagram'
WHERE NOT EXISTS (SELECT 1 FROM public.cms_social_media WHERE platform = 'instagram');

INSERT INTO public.cms_social_media (platform, url, icon_type)
SELECT 'facebook', '#', 'facebook'
WHERE NOT EXISTS (SELECT 1 FROM public.cms_social_media WHERE platform = 'facebook');
