CREATE TABLE public.portal_roster (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  serial_no text NOT NULL DEFAULT '',
  rank text NOT NULL DEFAULT '',
  division text NOT NULL DEFAULT '',
  photo text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  discord text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'active',
  note text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES public.portal_users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.portal_roster TO service_role;

ALTER TABLE public.portal_roster ENABLE ROW LEVEL SECURITY;

CREATE POLICY deny_all ON public.portal_roster AS PERMISSIVE FOR ALL TO authenticated USING (false) WITH CHECK (false);

CREATE TRIGGER portal_roster_touch_updated_at
BEFORE UPDATE ON public.portal_roster
FOR EACH ROW EXECUTE FUNCTION public.portal_touch_updated_at();

CREATE INDEX portal_roster_sort_idx ON public.portal_roster (sort_order, created_at);