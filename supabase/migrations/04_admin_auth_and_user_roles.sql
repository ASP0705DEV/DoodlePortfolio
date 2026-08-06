-- =============================================================
-- DOODLE PORTFOLIO & CMS ADMINISTRATOR AUTHENTICATION MIGRATION
-- Creates admin_profiles, login_audit_logs, RLS policies, and Realtime publications.
-- =============================================================

-- 1. Create admin_profiles table for administrator account management
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL DEFAULT 'ASP0705',
  display_name text NOT NULL DEFAULT 'Sai Prithvi',
  email text UNIQUE NOT NULL DEFAULT 'saiprithvi0705@gmail.com',
  avatar_url text DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  role text NOT NULL DEFAULT 'admin',
  last_login_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast user lookup
CREATE INDEX IF NOT EXISTS idx_admin_profiles_email ON public.admin_profiles(email);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_user_id ON public.admin_profiles(user_id);

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_profiles public select" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles admin all" ON public.admin_profiles;

CREATE POLICY "admin_profiles public select" ON public.admin_profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin_profiles admin all" ON public.admin_profiles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

GRANT ALL ON public.admin_profiles TO anon, authenticated, service_role;

-- 2. Create login_audit_logs table for access tracking
CREATE TABLE IF NOT EXISTS public.login_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  ip_address text DEFAULT '127.0.0.1',
  user_agent text,
  status text NOT NULL DEFAULT 'success',
  logged_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_login_audit_logged_at ON public.login_audit_logs(logged_at DESC);

ALTER TABLE public.login_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit public select" ON public.login_audit_logs;
DROP POLICY IF EXISTS "audit public insert" ON public.login_audit_logs;

CREATE POLICY "audit public select" ON public.login_audit_logs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "audit public insert" ON public.login_audit_logs FOR INSERT TO anon, authenticated WITH CHECK (true);

GRANT ALL ON public.login_audit_logs TO anon, authenticated, service_role;

-- 3. Seed Default Master Administrator Profile
INSERT INTO public.admin_profiles (username, display_name, email, avatar_url, role)
VALUES ('ASP0705', 'Sai Prithvi', 'saiprithvi0705@gmail.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'admin')
ON CONFLICT (email) DO UPDATE 
SET updated_at = now();

-- 4. Enable Supabase Realtime for admin_profiles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;

  ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_profiles;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;
