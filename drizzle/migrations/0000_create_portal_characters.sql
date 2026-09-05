CREATE TABLE public.portal_characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.portal_users(id) ON DELETE CASCADE,
  character_id bigint NOT NULL,
  firstname text NOT NULL DEFAULT '',
  lastname text NOT NULL DEFAULT '',
  memberid bigint,
  faction text,
  is_lspd boolean NOT NULL DEFAULT false,
  raw jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  requested_at timestamptz,
  decided_at timestamptz,
  decided_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, character_id)
);

GRANT ALL ON public.portal_characters TO service_role;

ALTER TABLE public.portal_characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY deny_all ON public.portal_characters
  AS PERMISSIVE FOR ALL TO authenticated
  USING (false) WITH CHECK (false);

CREATE TRIGGER portal_characters_touch_updated_at
  BEFORE UPDATE ON public.portal_characters
  FOR EACH ROW EXECUTE FUNCTION public.portal_touch_updated_at();

CREATE INDEX portal_characters_user_idx ON public.portal_characters(user_id);
CREATE INDEX portal_characters_status_idx ON public.portal_characters(status);
