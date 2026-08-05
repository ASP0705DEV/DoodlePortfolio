-- roles
CREATE TYPE public.app_role AS ENUM ('admin','editor');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin'::public.app_role);
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- projects
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'personal',
  tech_stack text[] NOT NULL DEFAULT '{}',
  cover_image text,
  gallery text[] NOT NULL DEFAULT '{}',
  video_url text,
  live_url text,
  repo_url text,
  challenges text NOT NULL DEFAULT '',
  solutions text NOT NULL DEFAULT '',
  architecture text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'completed',
  timeline text NOT NULL DEFAULT '',
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  views int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published projects public" ON public.projects FOR SELECT TO anon, authenticated USING (published = true OR public.is_admin());
CREATE POLICY "admins manage projects" ON public.projects FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- skills
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Frontend',
  icon text,
  proficiency int NOT NULL DEFAULT 80,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.skills TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skills TO authenticated;
GRANT ALL ON public.skills TO service_role;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "skills public" ON public.skills FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage skills" ON public.skills FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER skills_updated BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- experience
CREATE TABLE public.experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
GRANT SELECT ON public.experience TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.experience TO authenticated;
GRANT ALL ON public.experience TO service_role;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "experience public" ON public.experience FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage experience" ON public.experience FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER experience_updated BEFORE UPDATE ON public.experience FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- site settings (single row keyed by key)
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage settings" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- newsletter
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  confirmed boolean NOT NULL DEFAULT true,
  source text NOT NULL DEFAULT 'site',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admins delete subscribers" ON public.newsletter_subscribers FOR DELETE TO authenticated USING (public.is_admin());

-- contact
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL DEFAULT '',
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can contact" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admins update messages" ON public.contact_messages FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admins delete messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.is_admin());

-- analytics
CREATE TABLE public.analytics_events (
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
CREATE INDEX analytics_events_created_idx ON public.analytics_events (created_at DESC);
CREATE INDEX analytics_events_type_idx ON public.analytics_events (event_type);
GRANT INSERT ON public.analytics_events TO anon;
GRANT SELECT, INSERT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can track" ON public.analytics_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read analytics" ON public.analytics_events FOR SELECT TO authenticated USING (public.is_admin());

-- game scores
CREATE TABLE public.game_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game text NOT NULL,
  player_alias text NOT NULL DEFAULT 'Anonymous',
  score int NOT NULL DEFAULT 0,
  duration_ms int,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX game_scores_game_idx ON public.game_scores (game, score DESC);
GRANT SELECT, INSERT ON public.game_scores TO anon;
GRANT SELECT, INSERT, DELETE ON public.game_scores TO authenticated;
GRANT ALL ON public.game_scores TO service_role;
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "scores public" ON public.game_scores FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anyone can submit score" ON public.game_scores FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins delete scores" ON public.game_scores FOR DELETE TO authenticated USING (public.is_admin());

-- seed content
INSERT INTO public.site_settings (key, value) VALUES
('profile', '{"name":"Sai Prithvi","tagline":"Full Stack Developer crafting intelligent, agentic software.","roles":["Full Stack Developer","Software Engineer","AI Engineer","Agentic AI Developer","MERN Stack Developer","Intelligent Systems Developer"],"company":"Gagellan Global Solutions","company_url":"https://gagellan.com/","about":"I am Sai Prithvi, a Full Stack Developer at Gagellan Global Solutions, where I design and ship end-to-end web platforms across the MERN and modern TypeScript ecosystem. My days are spent turning messy requirements into clean architectures, fast interfaces and reliable APIs.\n\nLately my curiosity has pulled me deep into Agentic AI - autonomous agents, LLM orchestration, RAG pipelines and intelligent automation. I like building systems that do not just respond, but reason, plan and act.\n\nOutside of shipping features, I sketch product ideas, explore new frameworks, and obsess over the small details that make software feel alive.","email":"","resume_url":"","github":"https://github.com/Sai0705","linkedin":"https://www.linkedin.com/in/adapa-sai-prithvi-062413413","github_username":"Sai0705","location":"India"}'),
('sections', '{"about":true,"stack":true,"projects":true,"ai":true,"github":true,"playground":true,"newsletter":true,"contact":true}'),
('seo', '{"title":"Sai Prithvi - Full Stack & Agentic AI Developer","description":"Portfolio of Sai Prithvi, Full Stack Developer at Gagellan Global Solutions building modern web platforms and agentic AI systems."}');

INSERT INTO public.experience (company, company_url, role, location, start_date, end_date, description, highlights, sort_order) VALUES
('Gagellan Global Solutions','https://gagellan.com/','Full Stack Developer','India','2024','Present','Building and maintaining production web applications end to end - from database design and APIs to polished, responsive frontends.', ARRAY['Design and ship full stack features across React, Node.js and SQL/NoSQL databases','Build reusable component systems and design tokens for consistent product UI','Integrate third-party APIs, authentication and cloud services','Explore LLM and agent-based automation to speed up internal workflows'], 1);

INSERT INTO public.skills (name, category, proficiency, sort_order) VALUES
('React','Frontend',92,1),('Next.js','Frontend',85,2),('TypeScript','Frontend',88,3),('Tailwind CSS','Frontend',90,4),('Framer Motion','Frontend',80,5),('Redux','Frontend',80,6),
('Node.js','Backend',90,10),('Express.js','Backend',88,11),('REST APIs','Backend',90,12),('GraphQL','Backend',72,13),('WebSockets','Backend',75,14),
('MongoDB','Databases',88,20),('PostgreSQL','Databases',82,21),('Redis','Databases',70,22),('Supabase','Databases',80,23),
('Docker','Cloud & DevOps',75,30),('AWS','Cloud & DevOps',70,31),('Vercel','Cloud & DevOps',85,32),('GitHub Actions','Cloud & DevOps',75,33),
('LangChain','AI & ML',80,40),('RAG Pipelines','AI & ML',78,41),('OpenAI API','AI & ML',85,42),('Multi-Agent Systems','AI & ML',75,43),('Vector Databases','AI & ML',72,44),
('n8n','Automation',70,50),('Web Scraping','Automation',75,51),('CI/CD','Automation',78,52),
('Git','Tools',90,60),('Postman','Tools',85,61),('Figma','Tools',70,62),('VS Code','Tools',95,63),
('JavaScript','Languages',92,70),('TypeScript','Languages',88,71),('Python','Languages',82,72),('SQL','Languages',85,73),('Java','Languages',70,74);

INSERT INTO public.projects (slug,title,summary,description,category,tech_stack,live_url,repo_url,challenges,solutions,architecture,status,timeline,featured,sort_order) VALUES
('agentic-research-assistant','Agentic Research Assistant','A multi-agent system that plans, searches, reads and writes structured research briefs autonomously.','A team of specialised LLM agents - planner, retriever, critic and writer - collaborate over a shared memory store to produce cited research briefs from a single prompt.','ai',ARRAY['Python','LangChain','OpenAI','FastAPI','Postgres','pgvector'],NULL,'https://github.com/Sai0705','Keeping agents on-task and preventing infinite planning loops while controlling token cost.','Added a supervisor agent with hard step budgets, tool-call validation and a critic pass before any output is finalised.','Planner -> Retriever -> Critic -> Writer loop over a shared vector memory, orchestrated by a supervisor with step budgets.','completed','2025',true,1),
('rag-knowledge-hub','RAG Knowledge Hub','Document intelligence platform with hybrid search and grounded answers over private knowledge bases.','Upload PDFs and docs, get chunked, embedded and indexed content with hybrid keyword + vector retrieval and answers that always cite their sources.','ai',ARRAY['Next.js','TypeScript','pgvector','OpenAI','Tailwind'],NULL,'https://github.com/Sai0705','Naive chunking destroyed context and produced confidently wrong answers.','Introduced semantic chunking with overlap, hybrid BM25 + vector reranking, and strict citation enforcement in the prompt contract.','Ingest pipeline -> embeddings -> hybrid retriever -> reranker -> grounded generation.','completed','2025',true,2),
('mern-commerce-platform','MERN Commerce Platform','Full stack storefront with admin dashboard, payments and real-time order tracking.','A production-grade e-commerce build covering catalogue, cart, checkout, payments, order lifecycle and an analytics-rich admin panel.','fullstack',ARRAY['React','Node.js','Express','MongoDB','Stripe','Redis'],NULL,'https://github.com/Sai0705','Cart and inventory consistency under concurrent checkouts.','Moved stock reservation into atomic transactions with Redis locks and idempotent webhook handling.','React SPA -> Express REST API -> MongoDB with Redis cache and Stripe webhooks.','completed','2024',true,3),
('workflow-automation-engine','Workflow Automation Engine','Visual automation builder that chains APIs, AI steps and schedules into reliable pipelines.','Drag-and-drop nodes to compose workflows with retries, branching and AI-powered transform steps, all observable from a live run timeline.','automation',ARRAY['TypeScript','Node.js','BullMQ','Postgres','React Flow'],NULL,'https://github.com/Sai0705','Long-running jobs failed silently with no way to debug them.','Built a durable queue with per-step logging, retry policies and a replayable run timeline.','React Flow editor -> workflow compiler -> BullMQ workers -> Postgres run store.','in-progress','2025',false,4),
('realtime-collab-board','Realtime Collab Board','A collaborative whiteboard with live cursors, presence and conflict-free sync.','Multiple users sketch, comment and move objects on a shared canvas with sub-100ms sync and offline-tolerant merging.','personal',ARRAY['React','WebSockets','Node.js','CRDT','Canvas API'],NULL,'https://github.com/Sai0705','Concurrent edits caused flicker and lost strokes.','Adopted a CRDT document model with local-first writes and server reconciliation.','Client CRDT -> WebSocket relay -> persisted snapshots.','completed','2024',false,5),
('devtools-cli','DevTools CLI','Open-source CLI that scaffolds full stack TypeScript projects with best-practice defaults.','One command to generate a typed API, database schema, auth and a component library wired together and ready to deploy.','opensource',ARRAY['Node.js','TypeScript','Commander','Prisma'],NULL,'https://github.com/Sai0705','Templates rotted quickly as dependencies moved.','Added a template test matrix in CI that installs and builds every generated variant nightly.','CLI prompts -> template renderer -> post-install verification.','completed','2024',false,6);