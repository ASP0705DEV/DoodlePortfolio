# 📘 Master Production, Supabase Migration & Vercel Deployment Manual
**Project:** Doodle Portfolio Website & ASP0705DEV Software Studio  
**Author:** Adapa Sai Prithvi (ASP0705DEV)  
**Version:** 2.0.0 (Production Release)

---

## 📑 Manual Contents
1. [Supabase Migration & Account Setup Guide](#1-supabase-migration--account-setup-guide)
2. [Complete Database Schema & SQL Seeding Script](#2-complete-database-schema--sql-seeding-script)
3. [Comprehensive Environment Variables Reference](#3-comprehensive-environment-variables-reference)
4. [Project Configuration File Locations](#4-project-configuration-file-locations)
5. [SMTP Email Provider Integration Guide (Resend Setup)](#5-smtp-email-provider-integration-guide-resend-setup)
6. [Email Functionality & Notification Architecture](#6-email-functionality--notification-architecture)
7. [Post-Migration Verification & Testing Checklist](#7-post-migration-verification--testing-checklist)
8. [Beginner-Friendly Vercel Free Deployment Guide](#8-beginner-friendly-vercel-free-deployment-guide)
9. [CMS Operating & Maintenance Guide](#9-cms-operating--maintenance-guide)

---

## 1. Supabase Migration & Account Setup Guide

### Step 1: Create a New Supabase Project
1. Log into [Supabase Dashboard](https://supabase.com/dashboard) and click **New Project**.
2. Select your Organization, name the project (`ASP0705DEV Portfolio`), select region (`ap-south-1` / Mumbai or closest), and set a database password.
3. Once provisioned, navigate to **Project Settings -> API** to copy:
   - `Project URL`: `https://ccdfcrjyhmfzoakxawtq.supabase.co`
   - `anon` `public` key
   - `service_role` secret key

### Step 2: Configure Authentication & Redirect URLs
1. Navigate to **Authentication -> URL Configuration**.
2. Set **Site URL** to your deployment URL (e.g. `https://asp0705dev.vercel.app`).
3. Add **Redirect URLs**:
   - `http://localhost:8081/admin`
   - `https://*.vercel.app/admin`

### Step 3: Configure Storage Buckets
1. Navigate to **Storage -> Buckets**.
2. Create public buckets:
   - `portfolio_media` (Public: Enabled)
   - `resumes` (Public: Enabled)

---

## 2. Complete Database Schema & SQL Seeding Script

> [!IMPORTANT]
> Copy the SQL code below and paste it into **Supabase Dashboard -> SQL Editor**, then click **RUN**.
> This creates all tables, configures RLS policies for client API access, and seeds all initial data rows for **Projects**, **Services**, **Blog Posts**, **Experience**, **Skills**, and **Site Settings**.

```sql
-- =============================================================
-- ASP0705DEV PORTFOLIO & CMS COMPLETE DATABASE DDL & SEED SCRIPT
-- =============================================================

-- 1. DROP EXISTING TABLES & TYPES TO ALLOW CLEAN RE-CREATION
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.experience CASCADE;
DROP TABLE IF EXISTS public.skills CASCADE;
DROP TABLE IF EXISTS public.contact_messages CASCADE;
DROP TABLE IF EXISTS public.newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS public.analytics_events CASCADE;
DROP TABLE IF EXISTS public.game_scores CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- 2. PROJECTS & CASE STUDIES TABLE
CREATE TABLE public.projects (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'fullstack',
    summary TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    tech_stack TEXT[] DEFAULT '{}'::text[],
    featured BOOLEAN DEFAULT true,
    published BOOLEAN DEFAULT true,
    status TEXT NOT NULL DEFAULT 'Live',
    timeline TEXT NOT NULL DEFAULT '1 Month',
    role TEXT NOT NULL DEFAULT 'Full Stack Developer',
    challenges TEXT DEFAULT '',
    solutions TEXT DEFAULT '',
    architecture TEXT DEFAULT '',
    live_url TEXT,
    repo_url TEXT,
    cover_image TEXT,
    deployment_platform TEXT DEFAULT 'Vercel',
    features TEXT[] DEFAULT '{}'::text[],
    views INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TECHNICAL SERVICES TABLE
CREATE TABLE public.services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'web',
    short_description TEXT NOT NULL DEFAULT '',
    full_description TEXT NOT NULL DEFAULT '',
    deliverables TEXT[] DEFAULT '{}'::text[],
    technologies TEXT[] DEFAULT '{}'::text[],
    accent_color TEXT DEFAULT 'bg-sun',
    icon_name TEXT DEFAULT 'Globe',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. BLOG ARTICLES TABLE
CREATE TABLE public.blog_posts (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'Engineering',
    read_time TEXT NOT NULL DEFAULT '5 min read',
    cover_image TEXT,
    published BOOLEAN DEFAULT true,
    views INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. WORK EXPERIENCE TABLE
CREATE TABLE public.experience (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    company_url TEXT,
    location TEXT DEFAULT 'India',
    start_date TEXT NOT NULL,
    end_date TEXT DEFAULT 'Present',
    description TEXT DEFAULT '',
    highlights TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. SKILLS TABLE
CREATE TABLE public.skills (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'Full Stack',
    proficiency INT DEFAULT 90,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. MASTER SITE SETTINGS & CONTENT TABLE
CREATE TABLE public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. CONTACT MESSAGES (LEAD CRM) TABLE
CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT DEFAULT 'General Inquiry',
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    source TEXT DEFAULT 'website',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES FOR FRONTEND CLIENT ACCESS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow Public All (SELECT, INSERT, UPDATE, DELETE) for CMS API
CREATE POLICY "Allow Public All Projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Public All Services" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Public All Blogs" ON public.blog_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Public All Experience" ON public.experience FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Public All Skills" ON public.skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Public All Settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Public All Leads" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Public All Subscribers" ON public.newsletter_subscribers FOR ALL USING (true) WITH CHECK (true);

-- =============================================================
-- SEED DATA INSERTS FOR ALL TABLES
-- =============================================================

-- Seed Projects Table
INSERT INTO public.projects (id, slug, title, category, summary, description, tech_stack, featured, published, status, timeline, role, challenges, solutions, architecture, live_url, repo_url, cover_image, deployment_platform, features)
VALUES
('ai-smart-gate', 'ai-smart-gate', 'AI Smart Gate System', 'ai', 
 'Automated gate access control system integrating IoT sensors, computer vision, and real-time security logs.',
 'The AI Smart Gate System is an enterprise-grade access control platform that automates vehicle and visitor verification at entry points. Utilizing computer vision edge models and IoT relay control, it grants instant access to authorized vehicles while flagging unknown entities.',
 ARRAY['Python', 'OpenCV', 'PyTorch', 'React', 'Node.js', 'MQTT', 'Docker'],
 true, true, 'Live', '3 Months', 'Lead Full Stack & AI Systems Architect',
 'Processing high-resolution video streams in low-latency environments (<200ms) on edge devices.',
 'Optimized YOLOv8 object detection with TensorRT acceleration on edge hardware.',
 'Edge Camera -> TensorRT Vision Pipeline -> MQTT Broker -> Node.js Microservice -> React Admin Dashboard.',
 'https://github.com/codeping0705', 'https://github.com/codeping0705',
 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
 'Docker / AWS EC2', ARRAY['Real-time license plate detection', 'Automated barrier relay triggering', 'Visitor QR scanner']),

('anpr-system', 'anpr-system', 'Automatic Number Plate Recognition (ANPR)', 'ai',
 'High-accuracy automatic number plate recognition engine designed for smart parking and security checkpoints.',
 'An end-to-end computer vision pipeline capable of detecting vehicle license plates across dynamic lighting and weather conditions. Designed to interface with automated access barriers and municipal parking telemetry.',
 ARRAY['Python', 'OpenCV', 'YOLOv8', 'FastAPI', 'PostgreSQL', 'Docker'],
 true, true, 'Live', '2 Months', 'Computer Vision Engineer & Backend Architect',
 'Accurate character segmentation on distorted, angled, or low-contrast license plates.',
 'Trained custom CRNN optical character recognition models with augmentation pipelines.',
 'RTSP Video Input -> YOLOv8 Plate Detector -> CRNN OCR Engine -> FastAPI REST API.',
 'https://github.com/codeping0705', 'https://github.com/codeping0705',
 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80',
 'Cloudflare / Edge Microservices', ARRAY['Sub-100ms inference latency', 'Multi-country plate format support', 'Postgres telemetry database']),

('mentorhive', 'mentorhive', 'MentorHive Platform', 'fullstack',
 'Comprehensive educational platform connecting mentors with students for 1-on-1 code reviews and career guidance.',
 'MentorHive is an all-in-one ed-tech ecosystem offering real-time video sessions, interactive code playgrounds, automated booking, and peer review workflows.',
 ARRAY['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'WebSockets', 'TailwindCSS'],
 true, true, 'Live', '4 Months', 'Full Stack Developer & Technical Founder',
 'Managing concurrent WebSocket video signaling sessions and live whiteboard sync.',
 'Architected decoupled WebSockets gateway with WebRTC peer mesh topology.',
 'React Single Page App -> Node.js Gateway API -> WebSockets Server -> MongoDB Atlas.',
 'https://mentorhive.netlify.app', 'https://github.com/codeping0705',
 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
 'Netlify / Node.js Cluster', ARRAY['Interactive live whiteboard', 'Automated calendar scheduling', 'Stripe payment integration']),

('agentic-rag-studio', 'agentic-rag-studio', 'Agentic RAG Studio', 'ai',
 'Autonomous agent framework combining hybrid vector search with tool-calling capabilities.',
 'Agentic RAG Studio enables developers to deploy AI agents that plan multi-step reasoning processes, query vector indices, execute Python code, and output structured JSON outputs.',
 ARRAY['Python', 'LangChain', 'LlamaIndex', 'Pinecone', 'FastAPI', 'Next.js'],
 true, true, 'Active', '2 Months', 'AI Systems Developer',
 'Preventing agent reasoning loops and halluciations on multi-document retrieval.',
 'Implemented ReAct agent loops with guardrail evaluations and hybrid semantic BM25 indexing.',
 'Next.js Frontend -> FastAPI Agent Service -> Pinecone Vector Store -> Anthropic Claude / OpenAI API.',
 'https://github.com/codeping0705', 'https://github.com/codeping0705',
 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
 'Vercel / Railway Engine', ARRAY['Autonomous tool execution', 'Hybrid semantic vector search', 'Step-by-step reasoning tree visualizer']),

('construction-ecommerce', 'construction-ecommerce', 'Construction E-Commerce Platform', 'ecommerce',
 'B2B e-commerce platform for heavy equipment rental, building supplies, and contractor order management.',
 'Modern digital storefront tailored for construction suppliers featuring bulk tier pricing, quote generation, and real-time inventory tracking.',
 ARRAY['React', 'Vite', 'TailwindCSS', 'Supabase', 'Stripe API'],
 false, true, 'Live', '2 Months', 'Full Stack Developer',
 'Complex pricing matrix calculations based on delivery zip codes and heavy freight weights.',
 'Built custom pricing engine with Supabase Database Edge Functions.',
 'React Frontend -> Supabase Auth & Database -> Stripe Checkout -> Postmark Emailer.',
 'https://github.com/codeping0705', 'https://github.com/codeping0705',
 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
 'Vercel / Supabase Edge', ARRAY['Custom freight calculator', 'Contractor credit account portal', 'PDF quote generator']),

('pixmate', 'pixmate', 'Pixmate Image Editor', 'fullstack',
 'Browser-based canvas image editing suite with AI filters, object removal, and background replacement.',
 'Fast, client-side image manipulation workspace utilizing HTML5 Canvas WebGL contexts alongside generative AI model endpoints.',
 ARRAY['React', 'Canvas API', 'WebGL', 'TailwindCSS', 'Cloudflare Workers'],
 false, true, 'Live', '1 Month', 'Frontend Specialist',
 'High-frame-rate rendering of high-res 4K images on canvas without memory leaks.',
 'Utilized WebGL shaders and OffscreenCanvas web workers.',
 'React State Manager -> OffscreenCanvas Worker -> Cloudflare Edge Image Processor.',
 'https://github.com/codeping0705', 'https://github.com/codeping0705',
 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
 'Vercel / Cloudflare Edge', ARRAY['GPU-accelerated WebGL filters', 'AI background removal tool', 'Layer management system']);

-- Seed Services Table
INSERT INTO public.services (id, title, category, short_description, full_description, deliverables, technologies, accent_color, icon_name)
VALUES
('srv_fullstack', 'Custom Full-Stack Web Development', 'web',
 'End-to-end modern web applications built for speed, responsiveness, and scale.',
 'From blank repos to production deployment: responsive frontend interfaces, clean REST/GraphQL APIs, secure databases, payment gateways, and automated CI/CD deployment pipelines.',
 ARRAY['Responsive React Frontend', 'Node.js / Express Backend APIs', 'Database Design & Optimization', 'Production Deployment & Monitoring'],
 ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
 'bg-sun', 'Globe'),

('srv_ai', 'Agentic AI & LLM Systems Integration', 'ai',
 'Autonomous agents, retrieval-augmented generation (RAG), and customized LLM workflows.',
 'Building intelligent software that plans, uses tools, executes code, and automates multi-step business decisions with safety guardrails.',
 ARRAY['Custom RAG Architecture', 'Multi-Agent Orchestration', 'LLM Tool Calling & API Action Triggers', 'AI Safety & Evaluation Systems'],
 ARRAY['Python', 'LangChain', 'LlamaIndex', 'Pinecone', 'OpenAI', 'Anthropic'],
 'bg-mint', 'Cpu'),

('srv_automation', 'Business Process & Pipeline Automation', 'automation',
 'Eliminating repetitive manual busywork with high-reliability event-driven workflows.',
 'Designing automated web scrapers, data ingestion pipelines, automated reporting tools, and Webhook integrations.',
 ARRAY['Automated ETL Data Pipelines', 'Webhook & API Integrations', 'Custom Web Scraping & Ingestion', 'Scheduled Cron Job Workflows'],
 ARRAY['Python', 'Node.js', 'n8n', 'Docker', 'PostgreSQL'],
 'bg-bubble', 'Layers'),

('srv_cloud', 'Cloud Architecture & Microservices', 'cloud',
 'Scalable infrastructure design, containerization, and serverless hosting.',
 'Packaging applications into lightweight Docker containers, configuring Nginx proxies, edge CDN routing, and AWS cloud environments.',
 ARRAY['Docker Containerization', 'Nginx Proxy & SSL Setup', 'AWS EC2 & S3 Configuration', 'Cloudflare Edge Workers'],
 ARRAY['Docker', 'AWS', 'Cloudflare', 'Nginx', 'GitHub Actions'],
 'bg-lime', 'Server');

-- Seed Blog Posts Table
INSERT INTO public.blog_posts (id, slug, title, excerpt, content, category, read_time, cover_image, published)
VALUES
('building-agentic-ai-workflows-2025', 'building-agentic-ai-workflows-2025',
 'Building Autonomous Agentic AI Workflows in 2025',
 'Explore how tool-calling LLM agents, vector memory, and ReAct loops are transforming business software.',
 '# Building Autonomous Agentic AI Workflows in 2025\n\nThe software landscape is shifting from traditional passive applications to **autonomous agentic systems**...',
 'Agentic AI', '7 min read',
 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80', true),

('computer-vision-anpr-edge-hardware', 'computer-vision-anpr-edge-hardware',
 'High-Speed ANPR & Computer Vision on Edge Hardware',
 'Optimizing YOLOv8 and TensorRT for real-time license plate detection under 100ms.',
 '# High-Speed ANPR & Computer Vision on Edge Hardware\n\nDeploying computer vision models to edge devices requires careful trade-offs between accuracy and latency...',
 'Computer Vision', '6 min read',
 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80', true),

('full-stack-architecture-nextjs-python', 'full-stack-architecture-nextjs-python',
 'Modern Full-Stack Architecture: React, Node & Python Microservices',
 'A battle-tested blueprint for combining React frontends with fast Python microservices.',
 '# Modern Full-Stack Architecture: React, Node & Python Microservices\n\nCombining React on the frontend with Python backend services gives you the best of both worlds...',
 'Engineering', '5 min read',
 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80', true);

-- Seed Experience Table
INSERT INTO public.experience (id, role, company, location, start_date, end_date, description, highlights)
VALUES
('exp_1', 'Software Developer', 'Gagellan Global Solutions', 'India', '2024', 'Present',
 'Developing production web platforms, scalable REST APIs, and client-facing web applications.',
 ARRAY['Built responsive frontends with React and TypeScript', 'Architected backend APIs and Postgres databases']),

('exp_2', 'Founder & Principal Architect', 'ASP0705DEV Software Studio', 'India', '2025', 'Present',
 'Building custom software applications, business automation pipelines, and Agentic AI solutions.',
 ARRAY['Shipped production web platforms under ASP0705DEV', 'Implemented Agentic RAG and computer vision pipelines']);

-- Seed Skills Table
INSERT INTO public.skills (id, name, category, proficiency, icon)
VALUES
('skill_react', 'React & TypeScript', 'Full Stack', 95, 'Code'),
('skill_node', 'Node.js & Express', 'Backend', 90, 'Server'),
('skill_python', 'Python & PyTorch', 'AI & ML', 88, 'Brain'),
('skill_agentic_ai', 'Agentic AI & RAG', 'AI & ML', 92, 'Sparkles'),
('skill_opencv', 'OpenCV & Computer Vision', 'AI & ML', 85, 'Eye'),
('skill_docker', 'Docker & DevOps', 'DevOps', 87, 'Layers');

-- Seed Contact Messages (Lead CRM) Table
INSERT INTO public.contact_messages (id, name, email, subject, message, is_read, status)
VALUES
('a0000000-0000-0000-0000-000000000001', 'Adapa Sai Prithvi', 'Saiprithvi0705@gmail.com', 'Agentic AI Software Inquiry', 'Interested in developing a custom Agentic AI solution under ASP0705DEV.', false, 'new'),
('a0000000-0000-0000-0000-000000000002', 'Tech Solutions Inc', 'contact@techsolutions.com', 'Full-Stack Web App Development', 'Looking for full-stack engineering consultation for our enterprise platform.', true, 'contacted');

-- Seed Newsletter Subscribers Table
INSERT INTO public.newsletter_subscribers (id, email, name, source)
VALUES
('b0000000-0000-0000-0000-000000000001', 'Saiprithvi0705@gmail.com', 'Sai Prithvi', 'website'),
('b0000000-0000-0000-0000-000000000002', 'partner@asp0705dev.com', 'ASP0705DEV Team', 'consultation');

-- Seed Analytics Events Table
INSERT INTO public.analytics_events (id, session_id, visitor_id, event_type, path, device, browser, os)
VALUES
('evt_demo_1', 'sess_demo_1', 'visitor_demo_1', 'pageview', '/', 'Desktop', 'Chrome', 'Windows'),
('evt_demo_2', 'sess_demo_2', 'visitor_demo_2', 'pageview', '/admin', 'Mobile', 'Safari', 'iOS');

-- Seed Game Scores Table
INSERT INTO public.game_scores (id, game, player_alias, score, duration_ms)
VALUES
('score_1', 'Doodle Code Quiz', 'ASP0705DEV', 9500, 120000),
('score_2', 'Agentic AI Maze', 'Sai Prithvi', 12400, 95000);

-- Seed Site Settings Master Content
INSERT INTO public.site_settings (key, value)
VALUES ('master_cms_content', '{
  "hero": {
    "name": "Sai Prithvi",
    "tagline": "Full Stack Developer exploring the frontier of Agentic AI & Generative AI.",
    "roles": ["Full Stack Developer", "Agentic AI Developer", "Generative AI Builder", "Founder @ ASP0705DEV"],
    "company": "ASP0705DEV",
    "company_url": "#company",
    "status_badge": "Available for collaborations",
    "bio": "Building custom web applications and AI systems at my software studio ASP0705DEV, while working as a Software Developer at Gagellan Global Solutions.",
    "snippets": ["const app = new ASP0705DEV()", "await agent.reason(goal)", "genAI.generateText(prompt)"]
  },
  "about": {
    "bio": "I am a Computer Science graduate, Full Stack Developer, and founder of ASP0705DEV. I specialize in building robust web applications while actively diving deeper into Agentic AI workflows, Generative AI models, and autonomous software systems. I also work as a Software Developer at Gagellan Global Solutions.",
    "location": "India",
    "email": "Saiprithvi0705@gmail.com",
    "github": "https://github.com/codeping0705",
    "linkedin": "https://www.linkedin.com/in/adapa-sai-prithvi-062413413",
    "resume_url": ""
  },
  "company": {
    "title": "ASP0705DEV",
    "subtitle": "Software Engineering, Agentic AI & Generative AI Labs.",
    "description": "ASP0705DEV is my personal software studio dedicated to developing custom web platforms, business automation tools, agentic AI frameworks, and generative AI solutions for modern businesses."
  }
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
```
