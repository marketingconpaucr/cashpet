-- Las funciones de trigger solo deben dispararse automáticamente, nunca llamarse directo
-- por la API (ver advisor de seguridad de Supabase: quedaban invocables vía
-- /rest/v1/rpc/handle_new_user y /rest/v1/rpc/set_updated_at por los roles anon/authenticated).
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
