ALTER TABLE public.portal_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_login_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_user_roles DISABLE ROW LEVEL SECURITY;

REVOKE EXECUTE ON FUNCTION public.has_portal_role(UUID, public.portal_user_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_portal_role(UUID, public.portal_user_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_portal_role(UUID, public.portal_user_role) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.has_portal_role(UUID, public.portal_user_role) TO service_role;