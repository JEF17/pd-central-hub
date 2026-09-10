CREATE TABLE public.portal_user_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.portal_users(id) ON DELETE CASCADE,
  group_key text NOT NULL,
  granted_by uuid REFERENCES public.portal_users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, group_key)
);

GRANT ALL ON public.portal_user_groups TO service_role;

ALTER TABLE public.portal_user_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY deny_all ON public.portal_user_groups FOR ALL TO authenticated USING (false) WITH CHECK (false);

CREATE INDEX portal_user_groups_user_id_idx ON public.portal_user_groups (user_id);