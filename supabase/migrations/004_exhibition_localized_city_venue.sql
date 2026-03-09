-- Make exhibition city and venue trilingual, remove image_url (uses project image)

-- Rename existing city/venue to _es
ALTER TABLE public.exhibitions RENAME COLUMN city TO city_es;
ALTER TABLE public.exhibitions RENAME COLUMN venue TO venue_es;

-- Add EN/FR columns
ALTER TABLE public.exhibitions ADD COLUMN city_en text;
ALTER TABLE public.exhibitions ADD COLUMN city_fr text;
ALTER TABLE public.exhibitions ADD COLUMN venue_en text;
ALTER TABLE public.exhibitions ADD COLUMN venue_fr text;

-- Remove image_url (exhibitions use the project's image)
ALTER TABLE public.exhibitions DROP COLUMN IF EXISTS image_url;
