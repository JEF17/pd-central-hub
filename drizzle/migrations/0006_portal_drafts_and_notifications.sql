CREATE TABLE public.portal_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.portal_users(id) ON DELETE CASCADE,
  slug text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, slug)
);

GRANT ALL ON public.portal_drafts TO service_role;
ALTER TABLE public.portal_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY deny_all ON public.portal_drafts FOR ALL TO authenticated USING (false) WITH CHECK (false);

CREATE TRIGGER portal_drafts_touch_updated_at
  BEFORE UPDATE ON public.portal_drafts
  FOR EACH ROW EXECUTE FUNCTION public.portal_touch_updated_at();

CREATE INDEX portal_drafts_user_updated_idx ON public.portal_drafts (user_id, updated_at DESC);

CREATE TABLE public.portal_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.portal_users(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'info',
  message text NOT NULL,
  description text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.portal_notifications TO service_role;
ALTER TABLE public.portal_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY deny_all ON public.portal_notifications FOR ALL TO authenticated USING (false) WITH CHECK (false);

CREATE INDEX portal_notifications_user_created_idx ON public.portal_notifications (user_id, created_at DESC);