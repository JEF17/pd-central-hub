DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'portal_user_role') THEN
    CREATE TYPE public.portal_user_role AS ENUM ('user', 'admin');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.portal_user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.portal_users(id) ON DELETE CASCADE,
  role public.portal_user_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT ALL ON public.portal_user_roles TO service_role;
ALTER TABLE public.portal_user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_portal_role(_user_id UUID, _role public.portal_user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.portal_user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Migrate existing admin flags into the roles table, then remove the column.
INSERT INTO public.portal_user_roles (user_id, role)
SELECT id, 'admin'
FROM public.portal_users
WHERE is_admin = true
ON CONFLICT (user_id, role) DO NOTHING;

ALTER TABLE public.portal_users DROP COLUMN IF EXISTS is_admin;