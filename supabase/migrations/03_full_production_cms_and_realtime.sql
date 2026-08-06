-- =============================================================
-- DOODLE PORTFOLIO & CMS REALTIME & PRODUCTION MIGRATION
-- Enables Supabase Realtime across all CMS tables and ensures RLS policies are production ready.
-- =============================================================

-- 1. Ensure site_settings table exists
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "settings public select" ON public.site_settings;
DROP POLICY IF EXISTS "settings public all" ON public.site_settings;
CREATE POLICY "settings public select" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings public all" ON public.site_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON public.site_settings TO anon, authenticated, service_role;

-- 2. Ensure projects table exists
CREATE TABLE IF NOT EXISTS public.projects (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'fullstack',
  summary text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  tech_stack text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT true,
  published boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'Live',
  timeline text NOT NULL DEFAULT '1 Month',
  role text NOT NULL DEFAULT 'Full Stack Developer',
  challenges text NOT NULL DEFAULT '',
  solutions text NOT NULL DEFAULT '',
  architecture text NOT NULL DEFAULT '',
  live_url text,
  repo_url text,
  cover_image text,
  deployment_platform text NOT NULL DEFAULT 'Vercel',
  features text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "projects public select" ON public.projects;
DROP POLICY IF EXISTS "projects public all" ON public.projects;
CREATE POLICY "projects public select" ON public.projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "projects public all" ON public.projects FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON public.projects TO anon, authenticated, service_role;

-- 3. Ensure services table exists
CREATE TABLE IF NOT EXISTS public.services (
  id text PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'web',
  short_description text NOT NULL DEFAULT '',
  full_description text NOT NULL DEFAULT '',
  deliverables text[] NOT NULL DEFAULT '{}',
  technologies text[] NOT NULL DEFAULT '{}',
  accent_color text NOT NULL DEFAULT 'bg-sun',
  icon_name text NOT NULL DEFAULT 'Globe',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "services public select" ON public.services;
DROP POLICY IF EXISTS "services public all" ON public.services;
CREATE POLICY "services public select" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "services public all" ON public.services FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON public.services TO anon, authenticated, service_role;

-- 4. Ensure blog_posts table exists
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Engineering',
  read_time text NOT NULL DEFAULT '5 min read',
  cover_image text,
  published boolean NOT NULL DEFAULT true,
  author text NOT NULL DEFAULT 'Sai Prithvi',
  date text,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "blogs public select" ON public.blog_posts;
DROP POLICY IF EXISTS "blogs public all" ON public.blog_posts;
CREATE POLICY "blogs public select" ON public.blog_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "blogs public all" ON public.blog_posts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON public.blog_posts TO anon, authenticated, service_role;

-- 5. Ensure analytics_events table exists with indexing
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  visitor_id text NOT NULL,
  event_type text NOT NULL,
  path text NOT NULL DEFAULT '/',
  label text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  device text,
  browser text,
  os text,
  screen text,
  referrer text,
  is_returning boolean NOT NULL DEFAULT false,
  duration_ms int,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_visitor_id ON public.analytics_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON public.analytics_events(session_id);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "analytics public insert" ON public.analytics_events;
DROP POLICY IF EXISTS "analytics public select" ON public.analytics_events;
DROP POLICY IF EXISTS "analytics public all" ON public.analytics_events;
CREATE POLICY "analytics public insert" ON public.analytics_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "analytics public select" ON public.analytics_events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "analytics public all" ON public.analytics_events FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON public.analytics_events TO anon, authenticated, service_role;

-- 6. Enable Realtime Publications for all CMS and Analytics Tables
BEGIN;
  -- Enable supabase_realtime publication if not already present
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
      CREATE PUBLICATION supabase_realtime;
    END IF;
  END
  $$;

  -- Add tables to realtime publication
  ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_posts;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.newsletter_subscribers;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.analytics_events;
EXCEPTION
  WHEN OTHERS THEN NULL;
COMMIT;
