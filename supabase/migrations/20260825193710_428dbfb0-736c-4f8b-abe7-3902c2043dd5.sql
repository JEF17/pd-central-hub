ALTER TABLE public.portal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_login_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_user_roles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.portal_users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portal_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portal_login_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portal_user_roles TO authenticated;

DROP POLICY IF EXISTS deny_all ON public.portal_users;
DROP POLICY IF EXISTS deny_all ON public.portal_sessions;
DROP POLICY IF EXISTS deny_all ON public.portal_login_logs;
DROP POLICY IF EXISTS deny_all ON public.portal_user_roles;

CREATE POLICY deny_all ON public.portal_users FOR ALL TO authenticated USING (false) WITH CHECK (false);
CREATE POLICY deny_all ON public.portal_sessions FOR ALL TO authenticated USING (false) WITH CHECK (false);
CREATE POLICY deny_all ON public.portal_login_logs FOR ALL TO authenticated USING (false) WITH CHECK (false);
CREATE POLICY deny_all ON public.portal_user_roles FOR ALL TO authenticated USING (false) WITH CHECK (false);