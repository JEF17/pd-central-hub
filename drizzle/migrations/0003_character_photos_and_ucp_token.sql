ALTER TABLE public.portal_characters ADD COLUMN IF NOT EXISTS photo text NOT NULL DEFAULT '';
ALTER TABLE public.portal_users ADD COLUMN IF NOT EXISTS ucp_access_token text;