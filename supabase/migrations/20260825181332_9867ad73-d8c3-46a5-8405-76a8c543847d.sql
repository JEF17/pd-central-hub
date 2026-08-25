CREATE TABLE public.portal_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ucp_user_id BIGINT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  ucp_role TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  is_admin BOOLEAN NOT NULL DEFAULT false,
  characters JSONB NOT NULL DEFAULT '[]'::jsonb,
  selected_character TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ,
  decided_at TIMESTAMPTZ,
  decided_by UUID,
  CONSTRAINT portal_users_status_check CHECK (status IN ('pending','approved','rejected'))
);

CREATE TABLE public.portal_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES public.portal_users(id) ON DELETE CASCADE,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX portal_sessions_user_id_idx ON public.portal_sessions(user_id);

CREATE TABLE public.portal_login_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.portal_users(id) ON DELETE SET NULL,
  username TEXT,
  event TEXT NOT NULL,
  detail TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX portal_login_logs_created_at_idx ON public.portal_login_logs(created_at DESC);

GRANT ALL ON public.portal_users TO service_role;
GRANT ALL ON public.portal_sessions TO service_role;
GRANT ALL ON public.portal_login_logs TO service_role;

ALTER TABLE public.portal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_login_logs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.portal_touch_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER portal_users_touch_updated_at BEFORE UPDATE ON public.portal_users
FOR EACH ROW EXECUTE FUNCTION public.portal_touch_updated_at();