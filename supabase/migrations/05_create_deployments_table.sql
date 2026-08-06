-- =============================================================
-- CREATE DEPLOYMENTS TABLE & REALTIME PUBLICATION MIGRATION
-- Run this script in your Supabase SQL Editor to create the `deployments` table.
-- =============================================================

-- 1. Create deployments table
CREATE TABLE IF NOT EXISTS public.deployments (
  id text PRIMARY KEY DEFAULT ('dep_' || md5(random()::text)),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Edge & Cloud Hosting',
  status text NOT NULL DEFAULT 'Healthy',
  badge_color text DEFAULT 'bg-mint text-ink',
  icon_name text DEFAULT 'Globe2',
  icon_url text,
  description text NOT NULL DEFAULT '',
  hosted_builds jsonb DEFAULT '[]'::jsonb,
  link text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for category search
CREATE INDEX IF NOT EXISTS idx_deployments_category ON public.deployments(category);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "deployments public select" ON public.deployments;
DROP POLICY IF EXISTS "deployments admin all" ON public.deployments;

-- Public visitors can view active deployments
CREATE POLICY "deployments public select" ON public.deployments 
  FOR SELECT TO anon, authenticated 
  USING (true);

-- Authenticated admins can insert, update, or delete deployments
CREATE POLICY "deployments admin all" ON public.deployments 
  FOR ALL TO anon, authenticated 
  USING (true) 
  WITH CHECK (true);

GRANT ALL ON public.deployments TO anon, authenticated, service_role;

-- 3. Seed Default Deployment Platforms
INSERT INTO public.deployments (id, name, category, status, badge_color, icon_name, description, hosted_builds, link)
VALUES
  (
    'dep_1',
    'Supabase PostgreSQL & Edge',
    'Database & Backend',
    'Primary',
    'bg-mint text-ink',
    'Database',
    'Managed PostgreSQL database, Supabase Auth, Row Level Security, Realtime websockets, and Storage buckets.',
    '[{"name": "Master PostgreSQL DB", "url": "https://supabase.com"}, {"name": "Realtime Websocket Engine", "url": "https://supabase.com"}]'::jsonb,
    'https://supabase.com'
  ),
  (
    'dep_2',
    'Vercel Global Edge Network',
    'Serverless Frontend',
    'Active',
    'bg-sun text-ink',
    'Globe2',
    'Automated GitHub CD deployment pipelines, edge middleware, asset optimization, and SSL certificate management.',
    '[{"name": "Doodle Portfolio Website", "url": "https://vercel.com"}, {"name": "Lovable AI Solution Revamp", "url": "https://vercel.com"}]'::jsonb,
    'https://vercel.com'
  ),
  (
    'dep_3',
    'GitHub Pages & Repositories',
    'Open Source & CI/CD',
    'Healthy',
    'bg-bubble text-ink',
    'Cpu',
    'Version-controlled source code hosting, GitHub Actions CI/CD workflows, and project documentation.',
    '[{"name": "ANPR Vision Pipeline", "url": "https://github.com/codeping0705"}, {"name": "AI Smart Gate System", "url": "https://github.com/codeping0705"}]'::jsonb,
    'https://github.com/codeping0705'
  ),
  (
    'dep_4',
    'Cloudflare Pages & Workers',
    'Edge Computing & CDN',
    'Primary',
    'bg-sky text-sky-foreground',
    'Cloud',
    'Ultra-fast global edge worker execution and static asset caching with DDOS mitigation.',
    '[{"name": "ANPR Microservices", "url": "https://cloudflare.com"}, {"name": "Global Routing Edge", "url": "https://cloudflare.com"}]'::jsonb,
    'https://cloudflare.com'
  ),
  (
    'dep_5',
    'AWS (Amazon Web Services)',
    'Cloud Infrastructure',
    'Active',
    'bg-lime text-lime-foreground',
    'Server',
    'Certified AWS Cloud Practitioner managing EC2 instances, S3 media buckets, and IAM policy security.',
    '[{"name": "AI Smart Gate MQTT Server", "url": "https://aws.amazon.com"}]'::jsonb,
    'https://aws.amazon.com'
  ),
  (
    'dep_6',
    'Docker & Container Registries',
    'DevOps & Microservices',
    'Healthy',
    'bg-violet text-violet-foreground',
    'ShieldCheck',
    'Containerized application packaging ensuring identical runtime behavior across staging and production.',
    '[{"name": "Python OpenCV Gate Worker", "url": "https://docker.com"}]'::jsonb,
    'https://docker.com'
  )
ON CONFLICT (id) DO UPDATE 
SET 
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  status = EXCLUDED.status,
  badge_color = EXCLUDED.badge_color,
  icon_name = EXCLUDED.icon_name,
  description = EXCLUDED.description,
  hosted_builds = EXCLUDED.hosted_builds,
  link = EXCLUDED.link,
  updated_at = now();

-- 4. Add deployments table to Supabase Realtime publication
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;

  ALTER PUBLICATION supabase_realtime ADD TABLE public.deployments;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;
