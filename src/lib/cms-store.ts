import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { defaultProjects, type ShowcaseProject } from "@/lib/projects-data";
import { defaultBlogPosts, type BlogPost } from "@/lib/blog-posts";
import { defaultServices, type ServiceItem } from "@/lib/services-data";
import { techGroups } from "@/lib/tech-icons";
import { defaultResume, type ResumeContent } from "@/lib/resume-content";

export type TestimonialItem = {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
};

export type MasterCMSContent = {
  hero: {
    name: string;
    tagline: string;
    roles: string[];
    company: string;
    company_url: string;
    status_badge: string;
    bio: string;
    snippets: string[];
    hero_image?: string;
  };
  about: {
    bio: string;
    location: string;
    email: string;
    github: string;
    linkedin: string;
    resume_url: string;
    facts: { label: string; value: string }[];
  };
  company: {
    title: string;
    subtitle: string;
    description: string;
    studio_url: string;
    stats: { label: string; value: string }[];
  };
  contact: {
    email: string;
    phone: string;
    location: string;
    form_title: string;
    form_subtitle: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    og_image: string;
  };
  social_links: {
    github: string;
    linkedin: string;
    twitter: string;
    whatsapp: string;
    coffee: string;
    email: string;
  };
  section_visibility: {
    hero: boolean;
    about: boolean;
    stack: boolean;
    projects: boolean;
    services: boolean;
    company: boolean;
    deployments: boolean;
    github: boolean;
    blog: boolean;
    playground: boolean;
    newsletter: boolean;
    contact: boolean;
  };
  footer: {
    copyright_text: string;
    blurb: string;
  };
  testimonials: TestimonialItem[];
};

export const defaultCMSContent: MasterCMSContent = {
  hero: {
    name: "Sai Prithvi",
    tagline: "Full Stack Developer exploring the frontier of Agentic AI & Generative AI.",
    roles: ["Full Stack Developer", "Agentic AI Developer", "Generative AI Builder", "Founder @ ASP0705DEV"],
    company: "ASP0705DEV",
    company_url: "#company",
    status_badge: "Available for collaborations",
    bio: "Building custom web applications and AI systems at my software studio ASP0705DEV, while working as a Software Developer at Gagellan Global Solutions.",
    snippets: [
      "const app = new ASP0705DEV()",
      "await agent.reason(goal)",
      "genAI.generateText(prompt)",
      "useEffect(() => sync(), [])",
      "SELECT * FROM ideas;",
      "docker compose up -d",
    ],
    hero_image: "/sai-prithvi-doodle.png",
  },
  about: {
    bio: "I'm a Computer Science graduate, Full Stack Developer, and founder of ASP0705DEV. I specialize in building robust web applications while actively diving deeper into Agentic AI workflows, Generative AI models, and autonomous software systems. I also work as a Software Developer at Gagellan Global Solutions.",
    location: "India",
    email: "Saiprithvi0705@gmail.com",
    github: "https://github.com/codeping0705",
    linkedin: "https://www.linkedin.com/in/adapa-sai-prithvi-062413413",
    resume_url: "",
    facts: [
      { label: "Studio", value: "ASP0705DEV" },
      { label: "Role", value: "Software Developer" },
      { label: "Focus", value: "Full Stack & AI" },
      { label: "Status", value: "Available" },
    ],
  },
  company: {
    title: "ASP0705DEV",
    subtitle: "Software Engineering, Agentic AI & Generative AI Labs.",
    description:
      "ASP0705DEV is my personal software studio dedicated to developing custom web platforms, business automation tools, agentic AI frameworks, and generative AI solutions for modern businesses.",
    studio_url: "#company",
    stats: [
      { label: "Custom Architecture", value: "100%" },
      { label: "Focus Stack", value: "Web + AI" },
    ],
  },
  contact: {
    email: "Saiprithvi0705@gmail.com",
    phone: "+91 7070362117",
    location: "India",
    form_title: "Let's build something great",
    form_subtitle: "Reach out for web app development, agentic AI integrations, or technical collaborations.",
  },
  seo: {
    title: "Sai Prithvi — Full Stack Developer & AI Builder | ASP0705DEV",
    description:
      "Portfolio & Software Studio of Adapa Sai Prithvi (ASP0705DEV) — Full Stack Developer and Software Developer at Gagellan Global Solutions, building modern web platforms, Agentic AI, and Generative AI systems.",
    keywords: "Full Stack Developer, ASP0705DEV, Agentic AI, Generative AI, React, Node.js, Python, OpenCV, ANPR, RAG",
    og_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  },
  social_links: {
    github: "https://github.com/codeping0705",
    linkedin: "https://www.linkedin.com/in/adapa-sai-prithvi-062413413",
    twitter: "https://twitter.com",
    whatsapp: "https://wa.me/917070362117",
    coffee: "https://buymeacoffee.com",
    email: "mailto:Saiprithvi0705@gmail.com",
  },
  section_visibility: {
    hero: true,
    about: true,
    stack: true,
    projects: true,
    services: true,
    company: true,
    deployments: true,
    github: true,
    blog: true,
    playground: true,
    newsletter: true,
    contact: true,
  },
  footer: {
    copyright_text: "© 2026 ASP0705DEV. All rights reserved.",
    blurb: "Designed & developed by Sai Prithvi (ASP0705DEV).",
  },
  testimonials: [
    {
      id: "test_1",
      name: "Marcus Vance",
      role: "CTO",
      company: "TechFlow Systems",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      quote: "Sai delivered our AI vision pipeline ahead of schedule under ASP0705DEV. The integration has transformed our automated operations.",
      rating: 5,
    },
    {
      id: "test_2",
      name: "Elena Rostova",
      role: "Product Lead",
      company: "EdHive",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      quote: "MentorHive is fast, reliable, and beautifully designed. Working with ASP0705DEV was a seamless technical experience.",
      rating: 5,
    },
  ],
};

// -------------------------------------------------------------
// Deployments & Infrastructure Showcase Schema
// -------------------------------------------------------------
export type HostedBuildCMS = {
  name: string;
  url?: string;
};

export type DeploymentPlatformCMS = {
  id: string;
  name: string;
  category: string;
  status: "Active" | "Healthy" | "Primary";
  badgeColor: string;
  iconName: string;
  iconUrl?: string;
  description: string;
  hostedBuilds: HostedBuildCMS[];
  link: string;
};

export const defaultDeploymentsCMS: DeploymentPlatformCMS[] = [
  {
    id: "dep_1",
    name: "Netlify",
    category: "Edge & Frontend Host",
    status: "Primary",
    badgeColor: "bg-mint text-mint-foreground",
    iconName: "Globe2",
    description: "Automated continuous deployment for production React frontend web builds.",
    hostedBuilds: [
      { name: "MentorHive Platform", url: "https://mentorhive.netlify.app" },
      { name: "Doodle Art Portfolio", url: "https://asp0705dev.com" },
    ],
    link: "https://netlify.com",
  },
  {
    id: "dep_2",
    name: "Vercel",
    category: "Next.js & Vite Hosting",
    status: "Active",
    badgeColor: "bg-sun text-sun-foreground",
    iconName: "Server",
    description: "Zero-configuration edge network hosting with instant previews and global CDN.",
    hostedBuilds: [
      { name: "Lovable AI Solution Revamp", url: "https://vercel.com" },
      { name: "Pixmate Image Editor", url: "https://vercel.com" },
      { name: "Construction E-Commerce", url: "https://vercel.com" },
    ],
    link: "https://vercel.com",
  },
  {
    id: "dep_3",
    name: "GitHub Pages & Repositories",
    category: "Open Source Code & Docs",
    status: "Healthy",
    badgeColor: "bg-bubble text-bubble-foreground",
    iconName: "Cpu",
    description: "Version-controlled source code hosting, GitHub Actions CI/CD pipelines, and project documentation.",
    hostedBuilds: [
      { name: "ANPR Vision Pipeline", url: "https://github.com/codeping0705" },
      { name: "AI Smart Gate System", url: "https://github.com/codeping0705" },
      { name: "Agentic RAG Studio", url: "https://github.com/codeping0705" },
    ],
    link: "https://github.com/codeping0705",
  },
  {
    id: "dep_4",
    name: "Cloudflare Pages & Workers",
    category: "Edge Computing & CDN",
    status: "Primary",
    badgeColor: "bg-sky/40 text-sky-foreground",
    iconName: "Cloud",
    description: "Ultra-fast global edge worker execution and static asset caching.",
    hostedBuilds: [
      { name: "ANPR Microservices", url: "https://cloudflare.com" },
      { name: "Global DNS Routing", url: "https://cloudflare.com" },
    ],
    link: "https://cloudflare.com",
  },
  {
    id: "dep_5",
    name: "AWS (Amazon Web Services)",
    category: "Cloud Infrastructure",
    status: "Active",
    badgeColor: "bg-lime text-lime-foreground",
    iconName: "Server",
    description: "Certified AWS Cloud Practitioner managing EC2 instances, S3 media buckets, and IAM policy security.",
    hostedBuilds: [
      { name: "AI Smart Gate MQTT Server", url: "https://aws.amazon.com" },
      { name: "Docker Media Pipeline", url: "https://aws.amazon.com" },
    ],
    link: "https://aws.amazon.com",
  },
  {
    id: "dep_6",
    name: "Docker & Container Registries",
    category: "DevOps & Microservices",
    status: "Healthy",
    badgeColor: "bg-violet/30 text-violet-foreground",
    iconName: "ShieldCheck",
    description: "Containerized application packaging ensuring identical runtime behavior across staging and production.",
    hostedBuilds: [
      { name: "Python OpenCV Gate Worker", url: "https://docker.com" },
      { name: "Pinecone Vector RAG Sandbox", url: "https://docker.com" },
    ],
    link: "https://docker.com",
  },
];

// -------------------------------------------------------------
// Tech Stack Schema
// -------------------------------------------------------------
export type TechItemCMS = {
  id: string;
  title: string;
  hex?: string;
  path?: string;
  imageUrl?: string;
};

export type TechGroupCMS = {
  id: string;
  label: string;
  blurb: string;
  accent: string;
  items: TechItemCMS[];
};

export const defaultTechStackCMS: TechGroupCMS[] = techGroups.map((g) => ({
  id: g.id,
  label: g.label,
  blurb: g.blurb,
  accent: g.accent,
  items: g.items.map((i, idx) => ({
    id: `${g.id}_${idx}`,
    title: i.title,
    hex: i.hex,
    path: i.path,
  })),
}));

// -------------------------------------------------------------
// Resume Schema
// -------------------------------------------------------------
export type ExperienceItemCMS = {
  id: string;
  role: string;
  company: string;
  start_date: string;
  end_date?: string;
  description: string;
};

export type EducationItemCMS = {
  id: string;
  school: string;
  degree: string;
  period: string;
  detail: string;
};

export type CertificationItemCMS = {
  id: string;
  name: string;
  issuer: string;
  year: string;
  url?: string;
};

export type AchievementItemCMS = {
  id: string;
  title: string;
  copy: string;
  published?: boolean;
};

export type CapabilityItemCMS = {
  id: string;
  title: string;
  level: number; // 0–100
  category: string;
};

export type ProfileOverviewCMS = {
  summary: string;
  location: string;
  availability: string;
  open_to: string;
  resume_url: string;
};

export type ResumeCMS = {
  profile: ProfileOverviewCMS;
  capabilities: CapabilityItemCMS[];
  experience: ExperienceItemCMS[];
  education: EducationItemCMS[];
  certifications: CertificationItemCMS[];
  achievements: AchievementItemCMS[];
  // Legacy ResumeContent fields kept for backward compat
  summary?: string;
  services?: { title: string; copy: string }[];
  facts?: { label: string; value: string }[];
};

export const defaultResumeCMS: ResumeCMS = {
  ...defaultResume,
  profile: {
    summary: "Full Stack Developer at Gagellan Global Solutions, based in India. I build production web platforms end to end — React and TypeScript on the front, Node and Python services behind them — and I'm going deep on agentic AI: systems that reason, retrieve, plan and act instead of just answering.",
    location: "India",
    availability: "Available for freelance & collaborations",
    open_to: "Collaborations, freelance projects, and consulting",
    resume_url: "",
  },
  capabilities: [
    { id: "cap_1", title: "React & TypeScript", level: 95, category: "Frontend" },
    { id: "cap_2", title: "Node.js & Express", level: 90, category: "Backend" },
    { id: "cap_3", title: "Python & PyTorch", level: 88, category: "AI & ML" },
    { id: "cap_4", title: "Agentic AI & RAG", level: 92, category: "AI & ML" },
    { id: "cap_5", title: "OpenCV & Vision", level: 85, category: "AI & ML" },
    { id: "cap_6", title: "Docker & Cloud", level: 87, category: "DevOps" },
  ],
  experience: [
    {
      id: "exp_1",
      role: "Software Developer",
      company: "Gagellan Global Solutions",
      start_date: "2024",
      end_date: "Present",
      description: "Developing full stack web platforms, scalable APIs, and backend services.",
    },
    {
      id: "exp_2",
      role: "Founder & Principal Architect",
      company: "ASP0705DEV Software Studio",
      start_date: "2025",
      end_date: "Present",
      description: "Building custom client software solutions, Agentic AI tools, and Generative AI systems.",
    },
  ],
  education: [
    {
      id: "edu_1",
      school: "Bachelor of Technology — Computer Science",
      degree: "B.Tech, CSE",
      period: "India",
      detail: "Foundations in data structures, algorithms, databases and distributed systems.",
    },
  ],
  certifications: [
    { id: "cert_1", name: "Full Stack Web Development", issuer: "Self-directed + industry projects", year: "—" },
    { id: "cert_2", name: "Applied Generative AI & Agents", issuer: "Ongoing specialisation", year: "2025" },
  ],
  achievements: [
    { id: "ach_1", title: "Shipped production platforms", copy: "Delivered client-facing web applications used in day-to-day business operations.", published: true },
    { id: "ach_2", title: "Automation that pays for itself", copy: "Built workflows that removed hours of repetitive manual work each week.", published: true },
    { id: "ach_3", title: "Agentic AI exploration", copy: "Prototyping autonomous agents that plan, call tools and self-correct.", published: true },
  ],
};


// -------------------------------------------------------------
// Lead CRM Entry & Subscriber Entry
// -------------------------------------------------------------
export type LeadEntry = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  source: "contact_form" | "chatbot" | "consultation" | "project_inquiry";
  status: "new" | "contacted" | "in_progress" | "qualified" | "follow_up" | "completed" | "closed" | "archived";
  created_at: string;
  meta?: Record<string, unknown>;
};

export type SubscriberEntry = {
  id: string;
  email: string;
  name?: string;
  source: string;
  created_at: string;
};

const STORAGE_KEYS = {
  MASTER_CONTENT: "doodle_master_cms_content",
  PROJECTS: "doodle_projects",
  BLOGS: "doodle_blogs",
  SERVICES: "doodle_services",
  DEPLOYMENTS: "doodle_deployments",
  TECH_STACK: "doodle_tech_stack",
  RESUME: "doodle_resume",
  LEADS: "doodle_leads",
  SUBSCRIBERS: "doodle_subscribers",
  ADMIN_PASSCODE: "doodle_admin_passcode",
  ADMIN_EMAIL: "doodle_admin_email",
};

// -------------------------------------------------------------
// Admin Auth Helpers — Passcode + Email OTP
// -------------------------------------------------------------

/** Returns the current admin passcode (falls back to "admin123" if never set). */
export function getAdminPasscode(): string {
  return getLocal<string>(STORAGE_KEYS.ADMIN_PASSCODE, "admin123");
}

/** Persists a new admin passcode locally and to Supabase. */
export async function setAdminPasscode(newPasscode: string): Promise<void> {
  setLocal(STORAGE_KEYS.ADMIN_PASSCODE, newPasscode);
  try {
    await supabase.from("site_settings").upsert({
      key: "admin_passcode",
      value: newPasscode as never,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Could not persist admin passcode to Supabase:", err);
  }
}

/** Returns the registered admin email (used for OTP delivery). */
export function getAdminEmail(): string {
  return getLocal<string>(STORAGE_KEYS.ADMIN_EMAIL, "");
}

/** Saves admin email locally and to Supabase. */
export async function saveAdminEmail(email: string): Promise<void> {
  setLocal(STORAGE_KEYS.ADMIN_EMAIL, email);
  try {
    await supabase.from("site_settings").upsert({
      key: "admin_email",
      value: email as never,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Could not persist admin email to Supabase:", err);
  }
}

/** Loads admin passcode from Supabase on first login (syncs remote → local). */
export async function syncAdminPasscodeFromSupabase(): Promise<void> {
  try {
    const [passRes, emailRes] = await Promise.all([
      supabase.from("site_settings").select("value").eq("key", "admin_passcode").maybeSingle(),
      supabase.from("site_settings").select("value").eq("key", "admin_email").maybeSingle(),
    ]);
    if (passRes.data?.value) setLocal(STORAGE_KEYS.ADMIN_PASSCODE, passRes.data.value as string);
    if (emailRes.data?.value) setLocal(STORAGE_KEYS.ADMIN_EMAIL, emailRes.data.value as string);
  } catch (err) {
    console.warn("Could not sync admin credentials from Supabase:", err);
  }
}

/** Generates a 6-digit OTP, stores it in Supabase with a 10-min expiry, and emails it via Resend. */
export async function generateAndSendOTP(email: string): Promise<{ ok: boolean; error?: string }> {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  try {
    // Store OTP in Supabase
    await supabase.from("site_settings").upsert({
      key: "admin_otp",
      value: { otp, email, expires_at: expiresAt } as never,
      updated_at: new Date().toISOString(),
    });

    // Send email via Resend REST API
    const RESEND_KEY = import.meta.env.VITE_RESEND_API_KEY as string | undefined;
    if (!RESEND_KEY) {
      // Dev fallback: log OTP to console when no key configured
      console.info(`[DEV] Admin OTP for ${email}: ${otp} (expires ${expiresAt})`);
      return { ok: true };
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ASP0705DEV Admin <onboarding@resend.dev>",
        to: [email],
        subject: "Your ASP0705DEV Admin OTP Code",
        html: `
          <div style="font-family:monospace;max-width:480px;margin:auto;border:2px solid #1a1a1a;border-radius:18px;padding:32px;background:#fffdf7">
            <h2 style="margin:0 0 8px;font-size:24px;">🔐 Admin Password Change</h2>
            <p style="color:#555;margin:0 0 24px;">A password change was requested for your ASP0705DEV admin portal.</p>
            <div style="background:#fef3c7;border:2px solid #1a1a1a;border-radius:12px;padding:20px;text-align:center;font-size:36px;font-weight:bold;letter-spacing:8px;">
              ${otp}
            </div>
            <p style="color:#888;font-size:12px;margin:16px 0 0;">This code expires in <strong>10 minutes</strong>. If you did not request this, ignore this email.</p>
          </div>`,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { ok: false, error: `Email delivery failed: ${body}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

/** Verifies the OTP for the given email. Returns true if valid and not expired. */
export async function verifyOTP(email: string, otp: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "admin_otp")
      .maybeSingle();

    if (!data?.value) return { valid: false, error: "No OTP found. Please request a new one." };

    const stored = data.value as { otp: string; email: string; expires_at: string };
    if (stored.email !== email) return { valid: false, error: "OTP email mismatch." };
    if (new Date(stored.expires_at) < new Date()) return { valid: false, error: "OTP has expired. Please request a new one." };
    if (stored.otp !== otp.trim()) return { valid: false, error: "Invalid OTP. Please check and try again." };

    // Invalidate OTP after successful verification
    await supabase.from("site_settings").upsert({
      key: "admin_otp",
      value: { otp: "", email: "", expires_at: new Date().toISOString() } as never,
      updated_at: new Date().toISOString(),
    });

    return { valid: true };
  } catch (err) {
    return { valid: false, error: String(err) };
  }
}

function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("cms-updated"));
    window.dispatchEvent(new Event("storage"));
  } catch {
    /* ignore quota error */
  }
}

// -------------------------------------------------------------
// SUPABASE AUTOMATIC DATABASE SEEDER
// -------------------------------------------------------------
// -------------------------------------------------------------
// SUPABASE AUTOMATIC DATABASE SEEDER (Seeds All 10 Tables)
// -------------------------------------------------------------
export async function syncDefaultDataToSupabase(): Promise<void> {
  // 1. site_settings
  try {
    await saveCMSContent(getCMSContent());
  } catch (err) {
    console.warn("Supabase site_settings sync note:", err);
  }

  // 2. projects
  try {
    const projectsToInsert = defaultProjects.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      category: p.category,
      summary: p.summary,
      description: p.description,
      tech_stack: p.tech_stack,
      featured: p.featured,
      published: true,
      status: p.status,
      timeline: p.timeline,
      role: p.role,
      challenges: p.challenges,
      solutions: p.solutions,
      architecture: p.architecture,
      live_url: p.live_url || null,
      repo_url: p.repo_url || null,
      cover_image: p.cover_image || null,
      deployment_platform: p.deployment_platform,
      features: p.features,
    }));
    await supabase.from("projects").upsert(projectsToInsert as never);
  } catch (err) {
    console.warn("Supabase projects sync note:", err);
  }

  // 3. services
  try {
    const servicesToInsert = defaultServices.map((s) => ({
      id: s.id,
      title: s.title,
      category: s.category,
      short_description: s.shortDescription,
      full_description: s.fullDescription,
      deliverables: s.deliverables,
      technologies: s.technologies,
      accent_color: s.accentColor,
      icon_name: s.iconName,
    }));
    await supabase.from("services").upsert(servicesToInsert as never);
  } catch (err) {
    console.warn("Supabase services sync note:", err);
  }

  // 4. blog_posts
  try {
    const blogsToInsert = defaultBlogPosts.map((b) => ({
      id: b.id,
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt || b.summary || "",
      content: b.content,
      category: b.category,
      read_time: b.readTime,
      cover_image: b.featuredImage || b.coverImage || null,
      published: true,
      author: b.author || "Sai Prithvi",
      date: b.date || new Date().toISOString(),
    }));
    await supabase.from("blog_posts").upsert(blogsToInsert as never);
  } catch (err) {
    console.warn("Supabase blog_posts sync note:", err);
  }

  // 5. experience
  try {
    const experienceToInsert = [
      {
        id: "exp_1",
        role: "Software Developer",
        company: "Gagellan Global Solutions",
        location: "India",
        start_date: "2024",
        end_date: "Present",
        description: "Developing production web platforms, scalable REST APIs, and backend services.",
        highlights: ["React & TypeScript Frontends", "Postgres & Node Backend Services"],
      },
      {
        id: "exp_2",
        role: "Founder & Principal Architect",
        company: "ASP0705DEV Software Studio",
        location: "India",
        start_date: "2025",
        end_date: "Present",
        description: "Building custom software applications, business automation pipelines, and Agentic AI tools.",
        highlights: ["Shipped client software builds", "Computer vision & RAG pipelines"],
      },
    ];
    await supabase.from("experience").upsert(experienceToInsert as never);
  } catch (err) {
    console.warn("Supabase experience sync note:", err);
  }

  // 6. skills
  try {
    const skillsToInsert = [
      { id: "skill_react", name: "React & TypeScript", category: "Full Stack", proficiency: 95 },
      { id: "skill_node", name: "Node.js & Express", category: "Backend", proficiency: 90 },
      { id: "skill_python", name: "Python & PyTorch", category: "AI & ML", proficiency: 88 },
      { id: "skill_agentic_ai", name: "Agentic AI & RAG", category: "AI & ML", proficiency: 92 },
      { id: "skill_opencv", name: "OpenCV & Vision", category: "AI & ML", proficiency: 85 },
      { id: "skill_docker", name: "Docker & Cloud", category: "DevOps", proficiency: 87 },
    ];
    await supabase.from("skills").upsert(skillsToInsert as never);
  } catch (err) {
    console.warn("Supabase skills sync note:", err);
  }

  // 7. contact_messages (Lead CRM)
  try {
    const sampleLeads = [
      {
        name: "Adapa Sai Prithvi",
        email: "Saiprithvi0705@gmail.com",
        subject: "Agentic AI Software Inquiry",
        message: "Interested in developing a custom Agentic AI solution under ASP0705DEV.",
        is_read: false,
        status: "new",
      },
    ];
    await supabase.from("contact_messages").insert(sampleLeads as never);
  } catch (err) {
    console.warn("Supabase contact_messages sync note:", err);
  }

  // 8. newsletter_subscribers
  try {
    const sampleSubs = [
      { email: "Saiprithvi0705@gmail.com", name: "Sai Prithvi", source: "website" },
      { email: "partner@asp0705dev.com", name: "ASP0705DEV Team", source: "consultation" },
    ];
    await supabase.from("newsletter_subscribers").upsert(sampleSubs as never, { onConflict: "email" });
  } catch (err) {
    console.warn("Supabase newsletter_subscribers sync note:", err);
  }

  // 9. analytics_events
  try {
    const sampleAnalytics = [
      {
        session_id: "sess_demo_1",
        visitor_id: "visitor_demo_1",
        event_type: "pageview",
        path: "/",
        device: "Desktop",
        browser: "Chrome",
        os: "Windows",
      },
    ];
    await supabase.from("analytics_events").insert(sampleAnalytics as never);
  } catch (err) {
    console.warn("Supabase analytics_events sync note:", err);
  }

  // 10. game_scores
  try {
    const sampleScores = [
      { id: "score_1", game: "Doodle Code Quiz", player_alias: "ASP0705DEV", score: 9500, duration_ms: 120000 },
    ];
    await supabase.from("game_scores").upsert(sampleScores as never);
  } catch (err) {
    console.warn("Supabase game_scores sync note:", err);
  }
}

// -------------------------------------------------------------
// Master CMS Content API & Hooks
// -------------------------------------------------------------
// Deep-merge helper: applies defaults for any missing top-level keys or sub-keys
function mergeCMSWithDefaults(partial: unknown): MasterCMSContent {
  const src = (partial && typeof partial === "object" ? partial : {}) as Record<string, unknown>;
  const merged = { ...defaultCMSContent };
  for (const key of Object.keys(defaultCMSContent) as (keyof MasterCMSContent)[]) {
    const def = defaultCMSContent[key];
    const val = src[key];
    if (val && typeof val === "object" && !Array.isArray(val) && def && typeof def === "object" && !Array.isArray(def)) {
      // shallow-merge sub-objects so newly added sub-keys always have defaults
      (merged as Record<string, unknown>)[key] = { ...(def as object), ...(val as object) };
    } else if (val !== undefined) {
      (merged as Record<string, unknown>)[key] = val;
    }
  }

  // Prevent old legacy Unsplash placeholder image from persisting in hero
  if (
    merged.hero &&
    (!merged.hero.hero_image ||
      merged.hero.hero_image.includes("photo-1534528741775-53994a69daeb"))
  ) {
    merged.hero.hero_image = "/sai-prithvi-doodle.png";
  }

  return merged;
}

export function getCMSContent(): MasterCMSContent {
  const raw = getLocal<MasterCMSContent>(STORAGE_KEYS.MASTER_CONTENT, defaultCMSContent);
  return mergeCMSWithDefaults(raw);
}

export async function saveCMSContent(content: MasterCMSContent): Promise<MasterCMSContent> {
  const safe = mergeCMSWithDefaults(content);
  setLocal(STORAGE_KEYS.MASTER_CONTENT, safe);
  try {
    await supabase.from("site_settings").upsert({
      key: "master_cms_content",
      value: safe as never,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Could not sync CMS content to Supabase:", err);
  }
  return safe;
}

export function useCMSContent(): MasterCMSContent {
  const [content, setContent] = useState<MasterCMSContent>(() => {
    if (typeof window !== "undefined") {
      try {
        return getCMSContent();
      } catch {
        return defaultCMSContent;
      }
    }
    return defaultCMSContent;
  });

  useEffect(() => {
    // Sync local storage state after SSR hydration completes
    setContent(getCMSContent());

    const syncRemote = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "master_cms_content")
          .maybeSingle();

        if (!error && data?.value) {
          // Always merge remote data with defaults so old stored JSON never crashes
          const merged = mergeCMSWithDefaults(data.value);
          setLocal(STORAGE_KEYS.MASTER_CONTENT, merged);
          setContent(merged);
        }
      } catch (err) {
        console.warn("Could not fetch remote CMS content:", err);
      }
    };

    void syncRemote();

    const handleStorage = () => setContent(getCMSContent());
    window.addEventListener("storage", handleStorage);
    window.addEventListener("cms-updated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cms-updated", handleStorage);
    };
  }, []);

  return content;
}

// -------------------------------------------------------------
// Projects API & Hook (Reads & Writes to Supabase Table)
// -------------------------------------------------------------
export function useProjectsCMS(): ShowcaseProject[] {
  const [projects, setProjects] = useState<ShowcaseProject[]>(defaultProjects);

  useEffect(() => {
    setProjects(getLocal<ShowcaseProject[]>(STORAGE_KEYS.PROJECTS, defaultProjects));

    const syncProjects = async () => {
      try {
        const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
        if (!error && Array.isArray(data) && data.length > 0) {
          const mapped: ShowcaseProject[] = data.map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            category: (p.category as ShowcaseProject["category"]) || "fullstack",
            summary: p.summary,
            description: p.description,
            tech_stack: p.tech_stack ?? [],
            featured: p.featured ?? true,
            status: (p.status as ShowcaseProject["status"]) || "Live",
            timeline: p.timeline || "1 Month",
            role: p.role || "Full Stack Developer",
            challenges: p.challenges || "",
            solutions: p.solutions || "",
            architecture: p.architecture || "",
            live_url: p.live_url || undefined,
            repo_url: p.repo_url || undefined,
            cover_image: p.cover_image || undefined,
            deployment_platform: p.deployment_platform || "Vercel",
            features: p.features ?? [],
          }));

          const currentLocal = getLocal<ShowcaseProject[]>(STORAGE_KEYS.PROJECTS, defaultProjects);
          const map = new Map<string, ShowcaseProject>();
          currentLocal.forEach((p) => map.set(p.id, p));
          mapped.forEach((p) => map.set(p.id, p));

          const merged = Array.from(map.values());
          setLocal(STORAGE_KEYS.PROJECTS, merged);
          setProjects(merged);
        }
      } catch {
        /* fallback to local */
      }
    };

    void syncProjects();

    const handleStorage = () => {
      setProjects(getLocal<ShowcaseProject[]>(STORAGE_KEYS.PROJECTS, defaultProjects));
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("cms-updated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cms-updated", handleStorage);
    };
  }, []);

  return projects;
}

export function fetchAllProjects(): ShowcaseProject[] {
  return getLocal<ShowcaseProject[]>(STORAGE_KEYS.PROJECTS, defaultProjects);
}

export async function saveProjectLocal(project: ShowcaseProject): Promise<ShowcaseProject[]> {
  const current = getLocal<ShowcaseProject[]>(STORAGE_KEYS.PROJECTS, defaultProjects);
  const idx = current.findIndex((p) => p.id === project.id);
  let updated: ShowcaseProject[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = project;
  } else {
    updated = [project, ...current];
  }
  setLocal(STORAGE_KEYS.PROJECTS, updated);

  try {
    await supabase.from("projects").upsert({
      id: project.id,
      slug: project.slug,
      title: project.title,
      category: project.category,
      summary: project.summary,
      description: project.description,
      tech_stack: project.tech_stack,
      featured: project.featured,
      status: project.status,
      timeline: project.timeline,
      role: project.role,
      challenges: project.challenges,
      solutions: project.solutions,
      architecture: project.architecture,
      live_url: project.live_url || null,
      repo_url: project.repo_url || null,
      cover_image: project.cover_image || null,
      deployment_platform: project.deployment_platform,
      features: project.features,
    } as never);
  } catch (err) {
    console.warn("Supabase project save note:", err);
  }

  try {
    const cms = getCMSContent();
    cms.projects = updated;
    await saveCMSContent(cms);
  } catch (err) {
    console.warn("CMS content sync note:", err);
  }

  return updated;
}

export async function deleteProjectLocal(id: string): Promise<ShowcaseProject[]> {
  const current = getLocal<ShowcaseProject[]>(STORAGE_KEYS.PROJECTS, defaultProjects);
  const updated = current.filter((p) => p.id !== id);
  setLocal(STORAGE_KEYS.PROJECTS, updated);

  try {
    await supabase.from("projects").delete().eq("id", id);
  } catch (err) {
    console.warn("Supabase project delete note:", err);
  }

  try {
    const cms = getCMSContent();
    cms.projects = updated;
    await saveCMSContent(cms);
  } catch (err) {
    console.warn("CMS content sync note:", err);
  }

  return updated;
}

// -------------------------------------------------------------
// Services API & Hook (Reads & Writes to Supabase Table)
// -------------------------------------------------------------
export function useServicesCMS(): ServiceItem[] {
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);

  useEffect(() => {
    setServices(getLocal<ServiceItem[]>(STORAGE_KEYS.SERVICES, defaultServices));

    const syncServices = async () => {
      try {
        const { data, error } = await supabase.from("services").select("*");
        if (!error && Array.isArray(data)) {
          const mapped: ServiceItem[] = data.map((s) => ({
            id: s.id,
            title: s.title,
            category: (s.category as ServiceItem["category"]) || "web",
            shortDescription: s.short_description || "",
            fullDescription: s.full_description || "",
            deliverables: s.deliverables ?? [],
            technologies: s.technologies ?? [],
            accentColor: s.accent_color || "bg-sun",
            iconName: s.icon_name || "Globe",
          }));
          setLocal(STORAGE_KEYS.SERVICES, mapped);
          setServices(mapped);
        }
      } catch {
        /* fallback */
      }
    };

    void syncServices();

    const handleStorage = () => {
      setServices(getLocal<ServiceItem[]>(STORAGE_KEYS.SERVICES, defaultServices));
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("cms-updated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cms-updated", handleStorage);
    };
  }, []);

  return services;
}

export function fetchAllServices(): ServiceItem[] {
  return getLocal<ServiceItem[]>(STORAGE_KEYS.SERVICES, defaultServices);
}

export async function saveServiceLocal(service: ServiceItem): Promise<ServiceItem[]> {
  const current = getLocal<ServiceItem[]>(STORAGE_KEYS.SERVICES, defaultServices);
  const idx = current.findIndex((s) => s.id === service.id);
  let updated: ServiceItem[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = service;
  } else {
    updated = [service, ...current];
  }
  setLocal(STORAGE_KEYS.SERVICES, updated);

  try {
    await supabase.from("services").upsert({
      id: service.id,
      title: service.title,
      category: service.category,
      short_description: service.shortDescription,
      full_description: service.fullDescription,
      deliverables: service.deliverables,
      technologies: service.technologies,
      accent_color: service.accentColor,
      icon_name: service.iconName,
    } as never);
  } catch (err) {
    console.warn("Supabase service save note:", err);
  }

  try {
    const cms = getCMSContent();
    cms.services = updated;
    await saveCMSContent(cms);
  } catch (err) {
    console.warn("CMS content sync note:", err);
  }

  return updated;
}

export async function deleteServiceLocal(id: string): Promise<ServiceItem[]> {
  const current = getLocal<ServiceItem[]>(STORAGE_KEYS.SERVICES, defaultServices);
  const updated = current.filter((s) => s.id !== id);
  setLocal(STORAGE_KEYS.SERVICES, updated);

  try {
    await supabase.from("services").delete().eq("id", id);
  } catch (err) {
    console.warn("Supabase service delete note:", err);
  }

  try {
    const cms = getCMSContent();
    cms.services = updated;
    await saveCMSContent(cms);
  } catch (err) {
    console.warn("CMS content sync note:", err);
  }

  return updated;
}

// -------------------------------------------------------------
// Blogs API & Hook (Reads & Writes to Supabase Table)
// -------------------------------------------------------------
export function useBlogsCMS(): BlogPost[] {
  const [blogs, setBlogs] = useState<BlogPost[]>(defaultBlogPosts);

  useEffect(() => {
    setBlogs(getLocal<BlogPost[]>(STORAGE_KEYS.BLOGS, defaultBlogPosts));

    const syncBlogs = async () => {
      try {
        const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
        if (!error && Array.isArray(data) && data.length > 0) {
          const mapped: BlogPost[] = data.map((b) => {
            const summaryVal = b.summary || b.excerpt || "";
            const imgVal = b.cover_image || b.coverImage || b.featuredImage || "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80";
            return {
              id: b.id,
              slug: b.slug,
              title: b.title,
              summary: summaryVal,
              content: b.content || "",
              category: (b.category as BlogPost["category"]) || "AI & Agents",
              author: b.author || "Adapa Sai Prithvi",
              date: b.date || (b.created_at ? new Date(b.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)),
              readTime: b.read_time || b.readTime || "5 min read",
              featuredImage: imgVal,
              published: b.published !== false,
              tags: b.tags && Array.isArray(b.tags) && b.tags.length > 0 ? b.tags : ["Engineering", "AI"],
            };
          });

          // Bi-directional merge with local storage
          const currentLocal = getLocal<BlogPost[]>(STORAGE_KEYS.BLOGS, defaultBlogPosts);
          const map = new Map<string, BlogPost>();
          currentLocal.forEach((b) => map.set(b.id, b));
          mapped.forEach((b) => map.set(b.id, b));

          const merged = Array.from(map.values());
          setLocal(STORAGE_KEYS.BLOGS, merged);
          setBlogs(merged);
        }
      } catch {
        /* fallback */
      }
    };

    void syncBlogs();

    const handleStorage = () => {
      setBlogs(getLocal<BlogPost[]>(STORAGE_KEYS.BLOGS, defaultBlogPosts));
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("cms-updated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cms-updated", handleStorage);
    };
  }, []);

  return blogs;
}

export function fetchAllBlogs(): BlogPost[] {
  return getLocal<BlogPost[]>(STORAGE_KEYS.BLOGS, defaultBlogPosts);
}

export async function saveBlogLocal(blog: BlogPost): Promise<BlogPost[]> {
  const current = getLocal<BlogPost[]>(STORAGE_KEYS.BLOGS, defaultBlogPosts);
  // Ensure property aliases are assigned on the blog object
  const summaryVal = blog.summary || (blog as any).excerpt || "";
  const imgVal = blog.featuredImage || (blog as any).coverImage || (blog as any).cover_image || "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80";
  
  const normalizedBlog: BlogPost = {
    ...blog,
    summary: summaryVal,
    featuredImage: imgVal,
  };

  const idx = current.findIndex((b) => b.id === normalizedBlog.id);
  let updated: BlogPost[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = normalizedBlog;
  } else {
    updated = [normalizedBlog, ...current];
  }
  setLocal(STORAGE_KEYS.BLOGS, updated);

  try {
    const { error: upsertErr } = await supabase.from("blog_posts").upsert({
      id: normalizedBlog.id,
      slug: normalizedBlog.slug,
      title: normalizedBlog.title,
      excerpt: summaryVal,
      content: normalizedBlog.content,
      category: normalizedBlog.category,
      author: normalizedBlog.author || "Adapa Sai Prithvi",
      read_time: normalizedBlog.readTime,
      cover_image: imgVal,
      published: normalizedBlog.published !== false,
      tags: normalizedBlog.tags || [],
      date: normalizedBlog.date,
    } as never);
    if (upsertErr) {
      console.error("Supabase blog save error:", upsertErr);
    }
  } catch (err) {
    console.warn("Supabase blog save exception:", err);
  }

  try {
    const cms = getCMSContent();
    cms.blogs = updated;
    await saveCMSContent(cms);
  } catch (err) {
    console.warn("CMS content sync note:", err);
  }

  return updated;
}

export async function deleteBlogLocal(id: string): Promise<BlogPost[]> {
  const current = getLocal<BlogPost[]>(STORAGE_KEYS.BLOGS, defaultBlogPosts);
  const updated = current.filter((b) => b.id !== id);
  setLocal(STORAGE_KEYS.BLOGS, updated);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cms-updated"));
  }

  try {
    await supabase.from("blog_posts").delete().eq("id", id);
  } catch (err) {
    console.warn("Supabase blog delete note:", err);
  }

  try {
    const cms = getCMSContent();
    cms.blogs = updated;
    await saveCMSContent(cms);
  } catch (err) {
    console.warn("CMS content sync note:", err);
  }

  return updated;
}

// -------------------------------------------------------------
// Deployments API & Hook
// -------------------------------------------------------------
export function useDeploymentsCMS(): DeploymentPlatformCMS[] {
  const [deployments, setDeployments] = useState<DeploymentPlatformCMS[]>(defaultDeploymentsCMS);

  useEffect(() => {
    setDeployments(getLocal<DeploymentPlatformCMS[]>(STORAGE_KEYS.DEPLOYMENTS, defaultDeploymentsCMS));

    const syncDeployments = async () => {
      try {
        const { data, error } = await supabase.from("deployments").select("*").order("created_at", { ascending: true });
        if (!error && data && data.length > 0) {
          const mapped: DeploymentPlatformCMS[] = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            category: d.category || "Cloud Hosting",
            status: d.status || "Healthy",
            badgeColor: d.badge_color || "bg-mint text-ink",
            iconName: d.icon_name || "Globe2",
            iconUrl: d.icon_url || undefined,
            description: d.description || "",
            hostedBuilds: (d.hosted_builds as any) || [],
            link: d.link || undefined,
          }));
          setLocal(STORAGE_KEYS.DEPLOYMENTS, mapped);
          setDeployments(mapped);
        }
      } catch {
        /* fallback to local storage */
      }
    };

    void syncDeployments();

    const handleStorage = () => {
      setDeployments(getLocal<DeploymentPlatformCMS[]>(STORAGE_KEYS.DEPLOYMENTS, defaultDeploymentsCMS));
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("cms-updated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cms-updated", handleStorage);
    };
  }, []);

  return deployments;
}

export function getDeploymentsLocal(): DeploymentPlatformCMS[] {
  return getLocal<DeploymentPlatformCMS[]>(STORAGE_KEYS.DEPLOYMENTS, defaultDeploymentsCMS);
}

export async function saveDeploymentLocal(dep: DeploymentPlatformCMS): Promise<DeploymentPlatformCMS[]> {
  const current = getDeploymentsLocal();
  const idx = current.findIndex((d) => d.id === dep.id);
  let updated: DeploymentPlatformCMS[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = dep;
  } else {
    updated = [...current, dep];
  }
  setLocal(STORAGE_KEYS.DEPLOYMENTS, updated);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cms-updated"));
  }

  try {
    await supabase.from("deployments").upsert({
      id: dep.id,
      name: dep.name,
      category: dep.category,
      status: dep.status,
      badge_color: dep.badgeColor,
      icon_name: dep.iconName,
      icon_url: dep.iconUrl || null,
      description: dep.description,
      hosted_builds: dep.hostedBuilds as never,
      link: dep.link || null,
      updated_at: new Date().toISOString(),
    } as never);
  } catch (err) {
    console.warn("Supabase deployment save note:", err);
  }

  try {
    const cms = getCMSContent();
    cms.deployments = updated;
    await saveCMSContent(cms);
  } catch (err) {
    console.warn("CMS content sync note:", err);
  }

  return updated;
}

export async function deleteDeploymentLocal(id: string): Promise<DeploymentPlatformCMS[]> {
  const current = getDeploymentsLocal();
  const updated = current.filter((d) => d.id !== id);
  setLocal(STORAGE_KEYS.DEPLOYMENTS, updated);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cms-updated"));
  }

  try {
    await supabase.from("deployments").delete().eq("id", id);
  } catch (err) {
    console.warn("Supabase deployment delete note:", err);
  }

  try {
    const cms = getCMSContent();
    cms.deployments = updated;
    await saveCMSContent(cms);
  } catch (err) {
    console.warn("CMS content sync note:", err);
  }

  return updated;
}

// -------------------------------------------------------------
// Tech Stack API & Hook
// -------------------------------------------------------------
export function useTechStackCMS(): TechGroupCMS[] {
  const [techStack, setTechStack] = useState<TechGroupCMS[]>(defaultTechStackCMS);

  useEffect(() => {
    setTechStack(getLocal<TechGroupCMS[]>(STORAGE_KEYS.TECH_STACK, defaultTechStackCMS));

    const handleStorage = () => {
      setTechStack(getLocal<TechGroupCMS[]>(STORAGE_KEYS.TECH_STACK, defaultTechStackCMS));
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("cms-updated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cms-updated", handleStorage);
    };
  }, []);

  return techStack;
}

export function getTechStackLocal(): TechGroupCMS[] {
  return getLocal<TechGroupCMS[]>(STORAGE_KEYS.TECH_STACK, defaultTechStackCMS);
}

export function saveTechStackLocal(stack: TechGroupCMS[]): TechGroupCMS[] {
  setLocal(STORAGE_KEYS.TECH_STACK, stack);
  return stack;
}

// -------------------------------------------------------------
// Resume API & Hook
// -------------------------------------------------------------
export function useResumeCMS(): ResumeCMS {
  const [resume, setResume] = useState<ResumeCMS>(defaultResumeCMS);

  useEffect(() => {
    setResume(getLocal<ResumeCMS>(STORAGE_KEYS.RESUME, defaultResumeCMS));

    const handleStorage = () => {
      setResume(getLocal<ResumeCMS>(STORAGE_KEYS.RESUME, defaultResumeCMS));
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("cms-updated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cms-updated", handleStorage);
    };
  }, []);

  return resume;
}

export function getResumeLocal(): ResumeCMS {
  return getLocal<ResumeCMS>(STORAGE_KEYS.RESUME, defaultResumeCMS);
}

export function saveResumeLocal(resume: ResumeCMS): ResumeCMS {
  setLocal(STORAGE_KEYS.RESUME, resume);
  return resume;
}

// -------------------------------------------------------------
// Lead CRM API & Newsletter API & Hooks
// -------------------------------------------------------------
export function useLeadsCMS(): LeadEntry[] {
  const [leads, setLeads] = useState<LeadEntry[]>([]);

  useEffect(() => {
    setLeads(fetchAllLeads());

    const syncLeads = async () => {
      try {
        const { data, error } = await supabase
          .from("contact_messages")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          const mapped: LeadEntry[] = data.map((m) => ({
            id: m.id,
            name: m.name,
            email: m.email,
            subject: m.subject || "Contact Message",
            message: m.message,
            status: m.is_read ? "read" : "new",
            created_at: m.created_at,
            source: "contact_form",
          }));
          setLocal(STORAGE_KEYS.LEADS, mapped);
          setLeads(mapped);
        }
      } catch {
        /* fallback */
      }
    };

    void syncLeads();

    const handleStorage = () => setLeads(fetchAllLeads());
    window.addEventListener("storage", handleStorage);
    window.addEventListener("cms-updated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cms-updated", handleStorage);
    };
  }, []);

  return leads;
}

export function useSubscribersCMS(): SubscriberEntry[] {
  const [subscribers, setSubscribers] = useState<SubscriberEntry[]>([]);

  useEffect(() => {
    setSubscribers(fetchAllSubscribers());

    const syncSubscribers = async () => {
      try {
        const { data, error } = await supabase
          .from("newsletter_subscribers")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          const mapped: SubscriberEntry[] = data.map((s) => ({
            id: s.id,
            email: s.email,
            name: s.name || undefined,
            source: s.source || "website",
            created_at: s.created_at,
          }));
          setLocal(STORAGE_KEYS.SUBSCRIBERS, mapped);
          setSubscribers(mapped);
        }
      } catch {
        /* fallback */
      }
    };

    void syncSubscribers();

    const handleStorage = () => setSubscribers(fetchAllSubscribers());
    window.addEventListener("storage", handleStorage);
    window.addEventListener("cms-updated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cms-updated", handleStorage);
    };
  }, []);

  return subscribers;
}

export async function submitLead(lead: Omit<LeadEntry, "id" | "created_at" | "status">): Promise<LeadEntry> {
  const newLead: LeadEntry = {
    ...lead,
    id: "lead_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    status: "new",
    created_at: new Date().toISOString(),
  };

  try {
    await supabase.from("contact_messages").insert({
      name: lead.name,
      email: lead.email,
      subject: lead.subject,
      message: lead.message,
      is_read: false,
    });
  } catch (err) {
    console.warn("Supabase lead insert note:", err);
  }

  const current = getLocal<LeadEntry[]>(STORAGE_KEYS.LEADS, []);
  setLocal(STORAGE_KEYS.LEADS, [newLead, ...current]);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cms-updated"));
  }
  return newLead;
}

export function fetchAllLeads(): LeadEntry[] {
  return getLocal<LeadEntry[]>(STORAGE_KEYS.LEADS, []);
}

export function updateLeadStatus(id: string, status: LeadEntry["status"]): LeadEntry[] {
  const current = fetchAllLeads();
  const updated = current.map((l) => (l.id === id ? { ...l, status } : l));
  setLocal(STORAGE_KEYS.LEADS, updated);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cms-updated"));
  }
  return updated;
}

export async function deleteLead(id: string): Promise<LeadEntry[]> {
  try {
    await supabase.from("contact_messages").delete().eq("id", id);
  } catch {
    /* fallback */
  }
  const current = fetchAllLeads();
  const updated = current.filter((l) => l.id !== id);
  setLocal(STORAGE_KEYS.LEADS, updated);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cms-updated"));
  }
  return updated;
}

export async function deleteMultipleLeads(ids: string[]): Promise<LeadEntry[]> {
  try {
    await supabase.from("contact_messages").delete().in("id", ids);
  } catch {
    /* fallback */
  }
  const current = fetchAllLeads();
  const updated = current.filter((l) => !ids.includes(l.id));
  setLocal(STORAGE_KEYS.LEADS, updated);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cms-updated"));
  }
  return updated;
}

export async function addSubscriber(email: string, name?: string, source: string = "website"): Promise<boolean> {
  try {
    await supabase.from("newsletter_subscribers").insert({
      email,
      name: name || null,
      source,
    });
  } catch (err) {
    console.warn("Supabase subscriber insert note:", err);
  }

  const current = getLocal<SubscriberEntry[]>(STORAGE_KEYS.SUBSCRIBERS, []);
  if (!current.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
    const entry: SubscriberEntry = {
      id: "sub_" + Date.now().toString(36),
      email,
      name,
      source,
      created_at: new Date().toISOString(),
    };
    setLocal(STORAGE_KEYS.SUBSCRIBERS, [entry, ...current]);
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cms-updated"));
  }
  return true;
}

export function fetchAllSubscribers(): SubscriberEntry[] {
  return getLocal<SubscriberEntry[]>(STORAGE_KEYS.SUBSCRIBERS, []);
}

// -------------------------------------------------------------
// Backup & Restore
// -------------------------------------------------------------
export function exportCMSBackup() {
  const backup = {
    version: "2.0.0",
    exported_at: new Date().toISOString(),
    master_content: getCMSContent(),
    projects: fetchAllProjects(),
    blogs: fetchAllBlogs(),
    services: fetchAllServices(),
    deployments: getDeploymentsLocal(),
    tech_stack: getTechStackLocal(),
    resume: getResumeLocal(),
    leads: fetchAllLeads(),
    subscribers: fetchAllSubscribers(),
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `doodle_cms_master_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importCMSBackup(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.master_content) saveCMSContent(data.master_content);
    if (data.projects) setLocal(STORAGE_KEYS.PROJECTS, data.projects);
    if (data.blogs) setLocal(STORAGE_KEYS.BLOGS, data.blogs);
    if (data.services) setLocal(STORAGE_KEYS.SERVICES, data.services);
    if (data.deployments) setLocal(STORAGE_KEYS.DEPLOYMENTS, data.deployments);
    if (data.tech_stack) setLocal(STORAGE_KEYS.TECH_STACK, data.tech_stack);
    if (data.resume) setLocal(STORAGE_KEYS.RESUME, data.resume);
    if (data.leads) setLocal(STORAGE_KEYS.LEADS, data.leads);
    if (data.subscribers) setLocal(STORAGE_KEYS.SUBSCRIBERS, data.subscribers);
    return true;
  } catch {
    return false;
  }
}
