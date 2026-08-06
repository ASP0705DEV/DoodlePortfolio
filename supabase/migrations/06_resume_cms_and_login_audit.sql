-- Migration 06: Create login_audit_logs and resume_sections tables with RLS and Realtime

-- 1. Create login_audit_logs table
CREATE TABLE IF NOT EXISTS public.login_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL DEFAULT 'saiprithvi0705@gmail.com',
  status text NOT NULL DEFAULT 'success',
  logged_at timestamptz NOT NULL DEFAULT now(),
  user_agent text,
  device text,
  browser text,
  ip_address text DEFAULT '127.0.0.1',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_login_audit_logs_email ON public.login_audit_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_login_audit_logs_logged_at ON public.login_audit_logs(logged_at DESC);

ALTER TABLE public.login_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "login_audit_logs insert public" ON public.login_audit_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "login_audit_logs select public" ON public.login_audit_logs
  FOR SELECT USING (true);

-- 2. Create resume_sections table for 100% CMS-driven Resume at a Glance
CREATE TABLE IF NOT EXISTS public.resume_sections (
  id text PRIMARY KEY,
  category text NOT NULL, -- 'profile', 'capabilities', 'experience', 'education', 'certifications', 'achievements'
  title text NOT NULL,
  subtitle text,
  period text,
  description text,
  skills text[],
  order_index integer DEFAULT 0,
  published boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_resume_sections_category ON public.resume_sections(category);
CREATE INDEX IF NOT EXISTS idx_resume_sections_order ON public.resume_sections(order_index ASC);

ALTER TABLE public.resume_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "resume_sections public select" ON public.resume_sections
  FOR SELECT USING (true);

CREATE POLICY "resume_sections admin insert" ON public.resume_sections
  FOR INSERT WITH CHECK (true);

CREATE POLICY "resume_sections admin update" ON public.resume_sections
  FOR UPDATE USING (true);

CREATE POLICY "resume_sections admin delete" ON public.resume_sections
  FOR DELETE USING (true);

-- 3. Enable Realtime stream for new tables
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.login_audit_logs, public.resume_sections;
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;
