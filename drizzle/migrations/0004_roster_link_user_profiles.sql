ALTER TABLE public.portal_roster ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.portal_users(id) ON DELETE CASCADE;
ALTER TABLE public.portal_roster ADD COLUMN IF NOT EXISTS profile_key text;
CREATE UNIQUE INDEX IF NOT EXISTS portal_roster_user_profile_key_idx ON public.portal_roster (user_id, profile_key) WHERE user_id IS NOT NULL AND profile_key IS NOT NULL;