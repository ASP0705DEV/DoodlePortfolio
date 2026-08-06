-- =============================================================
-- DOODLE PORTFOLIO & CMS MASTER SUPABASE MIGRATION
-- Fixes RLS policies & ensures all 10 CMS tables exist with full read/write support
-- =============================================================

-- 1. site_settings (Single source of truth for Hero, About, Company, Contact, SEO, Social, Visibility)
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

-- 2. projects
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

-- 3. services
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

-- 4. blog_posts
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
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "blogs public select" ON public.blog_posts;
DROP POLICY IF EXISTS "blogs public all" ON public.blog_posts;
CREATE POLICY "blogs public select" ON public.blog_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "blogs public all" ON public.blog_posts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON public.blog_posts TO anon, authenticated, service_role;

-- 5. experience
CREATE TABLE IF NOT EXISTS public.experience (
  id text PRIMARY KEY,
  company text NOT NULL,
  company_url text,
  role text NOT NULL,
  location text,
  start_date text NOT NULL DEFAULT '',
  end_date text,
  description text NOT NULL DEFAULT '',
  highlights text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "experience public select" ON public.experience;
DROP POLICY IF EXISTS "experience public all" ON public.experience;
CREATE POLICY "experience public select" ON public.experience FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "experience public all" ON public.experience FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON public.experience TO anon, authenticated, service_role;

-- 6. skills
CREATE TABLE IF NOT EXISTS public.skills (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Frontend',
  icon text,
  proficiency int NOT NULL DEFAULT 80,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "skills public select" ON public.skills;
DROP POLICY IF EXISTS "skills public all" ON public.skills;
CREATE POLICY "skills public select" ON public.skills FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "skills public all" ON public.skills FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON public.skills TO anon, authenticated, service_role;

-- 7. contact_messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL DEFAULT '',
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "contact public insert" ON public.contact_messages;
DROP POLICY IF EXISTS "contact public select" ON public.contact_messages;
DROP POLICY IF EXISTS "contact public all" ON public.contact_messages;
CREATE POLICY "contact public insert" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "contact public select" ON public.contact_messages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "contact public all" ON public.contact_messages FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON public.contact_messages TO anon, authenticated, service_role;

-- 8. newsletter_subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  confirmed boolean NOT NULL DEFAULT true,
  source text NOT NULL DEFAULT 'site',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "newsletter public insert" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "newsletter public select" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "newsletter public all" ON public.newsletter_subscribers;
CREATE POLICY "newsletter public insert" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "newsletter public select" ON public.newsletter_subscribers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "newsletter public all" ON public.newsletter_subscribers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON public.newsletter_subscribers TO anon, authenticated, service_role;

-- 9. analytics_events
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
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "analytics public insert" ON public.analytics_events;
DROP POLICY IF EXISTS "analytics public select" ON public.analytics_events;
DROP POLICY IF EXISTS "analytics public all" ON public.analytics_events;
CREATE POLICY "analytics public insert" ON public.analytics_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "analytics public select" ON public.analytics_events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "analytics public all" ON public.analytics_events FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON public.analytics_events TO anon, authenticated, service_role;

-- 10. game_scores
CREATE TABLE IF NOT EXISTS public.game_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game text NOT NULL,
  player_alias text NOT NULL DEFAULT 'Anonymous',
  score int NOT NULL DEFAULT 0,
  duration_ms int,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "scores public select" ON public.game_scores;
DROP POLICY IF EXISTS "scores public insert" ON public.game_scores;
DROP POLICY IF EXISTS "scores public all" ON public.game_scores;
CREATE POLICY "scores public select" ON public.game_scores FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "scores public insert" ON public.game_scores FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "scores public all" ON public.game_scores FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON public.game_scores TO anon, authenticated, service_role;
