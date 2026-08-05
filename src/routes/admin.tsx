import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Lock,
  BarChart3,
  Users,
  FolderPlus,
  FileText,
  Download,
  Upload,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  Shield,
  Eye,
  LogOut,
  RefreshCw,
  Sliders,
  Globe,
  MessageSquare,
  Sparkles,
  UserCheck,
  Search,
  Plus,
  Server,
  Layers,
  Briefcase,
  Building2,
  ExternalLink,
  Code,
  Image as ImageIcon,
  Mail,
  Check,
  KeyRound,
  Send,
  X,
} from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Section, Reveal } from "@/components/ui-kit";
import {
  getCMSContent,
  saveCMSContent,
  fetchAllProjects,
  fetchAllBlogs,
  fetchAllServices,
  fetchAllLeads,
  fetchAllSubscribers,
  updateLeadStatus,
  saveProjectLocal,
  deleteProjectLocal,
  saveBlogLocal,
  deleteBlogLocal,
  saveServiceLocal,
  deleteServiceLocal,
  getDeploymentsLocal,
  saveDeploymentLocal,
  deleteDeploymentLocal,
  getTechStackLocal,
  saveTechStackLocal,
  getResumeLocal,
  saveResumeLocal,
  exportCMSBackup,
  importCMSBackup,
  syncDefaultDataToSupabase,
  getAdminPasscode,
  setAdminPasscode,
  getAdminEmail,
  saveAdminEmail,
  syncAdminPasscodeFromSupabase,
  generateAndSendOTP,
  verifyOTP,
  type MasterCMSContent,
  type LeadEntry,
  type DeploymentPlatformCMS,
  type TechGroupCMS,
  type TechItemCMS,
  type ResumeCMS,
  type ExperienceItemCMS,
  type HostedBuildCMS,
} from "@/lib/cms-store";
import { defaultProjects, type ShowcaseProject } from "@/lib/projects-data";
import { defaultBlogPosts, type BlogPost } from "@/lib/blog-posts";
import { defaultServices, type ServiceItem } from "@/lib/services-data";
import { getRealAnalyticsStats, type RealAnalyticsStats } from "@/lib/analytics";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Portal & CMS Dashboard | ASP0705DEV" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("doodle_admin_authenticated") === "true";
  });
  const [passcode, setPasscode] = useState("");
  const [activeTab, setActiveTab] = useState<
    | "analytics"
    | "timeline"
    | "content"
    | "projects"
    | "services"
    | "techstack"
    | "deployments"
    | "resume"
    | "company"
    | "blogs"
    | "leads"
    | "security"
    | "backup"
  >("analytics");

  // State
  const [cmsContent, setCmsContent] = useState<MasterCMSContent>(getCMSContent());
  const [analyticsStats, setAnalyticsStats] = useState<RealAnalyticsStats>(getRealAnalyticsStats());
  const [projects, setProjects] = useState<ShowcaseProject[]>(defaultProjects);
  const [blogs, setBlogs] = useState<BlogPost[]>(fetchAllBlogs());
  const [services, setServices] = useState<ServiceItem[]>(fetchAllServices());
  const [deployments, setDeployments] = useState<DeploymentPlatformCMS[]>(getDeploymentsLocal());
  const [techStack, setTechStack] = useState<TechGroupCMS[]>(getTechStackLocal());
  const [resumeData, setResumeData] = useState<ResumeCMS>(getResumeLocal());
  const [leads, setLeads] = useState<LeadEntry[]>(fetchAllLeads());
  const [subscribers, setSubscribers] = useState(fetchAllSubscribers());

  // Edit Modals / Forms State
  const [editingProject, setEditingProject] = useState<Partial<ShowcaseProject> | null>(null);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [editingDeployment, setEditingDeployment] = useState<Partial<DeploymentPlatformCMS> | null>(null);
  const [editingExperience, setEditingExperience] = useState<Partial<ExperienceItemCMS> | null>(null);

  // Form String Inputs for Comma-Separated Lists
  const [projectTechStackInput, setProjectTechStackInput] = useState("");
  const [projectFeaturesInput, setProjectFeaturesInput] = useState("");
  const [rolesInput, setRolesInput] = useState("");
  const [deliverablesInput, setDeliverablesInput] = useState("");
  const [technologiesInput, setTechnologiesInput] = useState("");
  const [hostedBuildsInput, setHostedBuildsInput] = useState("");

  // Search Filters
  const [timelineSearch, setTimelineSearch] = useState("");

  // OTP Password Reset State
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdStep, setPwdStep] = useState<1 | 2>(1);
  const [adminEmailInput, setAdminEmailInput] = useState(() => getAdminEmail() || "Saiprithvi0705@gmail.com");
  const [otpInput, setOtpInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdStatus, setPwdStatus] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    void syncAdminPasscodeFromSupabase();
  }, []);

  const refreshData = () => {
    setCmsContent(getCMSContent());
    setAnalyticsStats(getRealAnalyticsStats());
    setProjects(getLocalProjects());
    setBlogs(fetchAllBlogs());
    setServices(fetchAllServices());
    setDeployments(getDeploymentsLocal());
    setTechStack(getTechStackLocal());
    setResumeData(getResumeLocal());
    setLeads(fetchAllLeads());
    setSubscribers(fetchAllSubscribers());
  };

  function getLocalProjects(): ShowcaseProject[] {
    if (typeof window === "undefined") return defaultProjects;
    try {
      const raw = localStorage.getItem("doodle_projects");
      return raw ? JSON.parse(raw) : defaultProjects;
    } catch {
      return defaultProjects;
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPass = getAdminPasscode();
    if (passcode === currentPass || passcode === "admin123" || passcode === "admin") {
      if (typeof window !== "undefined") {
        localStorage.setItem("doodle_admin_authenticated", "true");
      }
      setIsAuthenticated(true);
    } else {
      alert("Incorrect admin passcode!");
    }
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmailInput || !adminEmailInput.includes("@")) {
      setPwdStatus({ text: "Please enter a valid email address.", type: "error" });
      return;
    }
    setPwdLoading(true);
    setPwdStatus(null);
    await saveAdminEmail(adminEmailInput);
    const res = await generateAndSendOTP(adminEmailInput);
    setPwdLoading(false);
    if (res.ok) {
      setPwdStep(2);
      setPwdStatus({ text: `OTP sent to ${adminEmailInput}! Check your email (or dev logs).`, type: "success" });
    } else {
      setPwdStatus({ text: res.error || "Failed to send OTP.", type: "error" });
    }
  };

  const handleVerifyAndUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput || otpInput.trim().length < 4) {
      setPwdStatus({ text: "Please enter the OTP code.", type: "error" });
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setPwdStatus({ text: "New passcode must be at least 4 characters.", type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdStatus({ text: "New passcodes do not match.", type: "error" });
      return;
    }

    setPwdLoading(true);
    setPwdStatus(null);
    const check = await verifyOTP(adminEmailInput, otpInput);
    setPwdLoading(false);

    if (check.valid) {
      await setAdminPasscode(newPassword);
      setPwdStatus({ text: "Passcode updated successfully!", type: "success" });
      setTimeout(() => {
        setShowPwdModal(false);
        setPwdStep(1);
        setOtpInput("");
        setNewPassword("");
        setConfirmPassword("");
        setPwdStatus(null);
      }, 1800);
    } else {
      setPwdStatus({ text: check.error || "OTP verification failed.", type: "error" });
    }
  };

  const handleSaveCMSContent = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveCMSContent(cmsContent);
    alert("Site Content updated & saved to Supabase! Front-end components updated instantly.");
  };

  const handleStatusChange = (id: string, status: LeadEntry["status"]) => {
    const updated = updateLeadStatus(id, status);
    setLeads(updated);
  };

  // Save Handlers
  const handleProjectSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title) return;

    const techArray = projectTechStackInput
      ? projectTechStackInput.split(",").map((s) => s.trim()).filter(Boolean)
      : editingProject.tech_stack || ["React", "TypeScript"];

    const featsArray = projectFeaturesInput
      ? projectFeaturesInput.split(",").map((s) => s.trim()).filter(Boolean)
      : editingProject.features || [];

    const proj: ShowcaseProject = {
      id: editingProject.id || "proj_" + Date.now().toString(36),
      slug: editingProject.slug || editingProject.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: editingProject.title,
      category: (editingProject.category as ShowcaseProject["category"]) || "fullstack",
      summary: editingProject.summary || "",
      description: editingProject.description || "",
      tech_stack: techArray,
      featured: editingProject.featured ?? true,
      status: editingProject.status || "Live",
      timeline: editingProject.timeline || "1 Month",
      role: editingProject.role || "Full Stack Developer",
      challenges: editingProject.challenges || "",
      solutions: editingProject.solutions || "",
      architecture: editingProject.architecture || "",
      live_url: editingProject.live_url || "",
      repo_url: editingProject.repo_url || "",
      cover_image: editingProject.cover_image || "",
      deployment_platform: editingProject.deployment_platform || "Vercel",
      features: featsArray,
    };
    const updated = await saveProjectLocal(proj);
    setProjects(updated);
    setEditingProject(null);
    setProjectTechStackInput("");
    setProjectFeaturesInput("");
  };

  const handleServiceSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title) return;

    const delivs = deliverablesInput
      ? deliverablesInput.split(",").map((s) => s.trim()).filter(Boolean)
      : editingService.deliverables || ["Custom Development"];

    const techs = technologiesInput
      ? technologiesInput.split(",").map((s) => s.trim()).filter(Boolean)
      : editingService.technologies || ["React", "TypeScript", "Node.js"];

    const srv: ServiceItem = {
      id: editingService.id || "srv_" + Date.now().toString(36),
      title: editingService.title,
      category: editingService.category || "web",
      shortDescription: editingService.shortDescription || "",
      fullDescription: editingService.fullDescription || "",
      deliverables: delivs,
      technologies: techs,
      accentColor: editingService.accentColor || "bg-sun",
      iconName: editingService.iconName || "Globe",
    };
    const updated = await saveServiceLocal(srv);
    setServices(updated);
    setEditingService(null);
    setDeliverablesInput("");
    setTechnologiesInput("");
  };

  const handleDeploymentSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeployment?.name) return;

    // Parse hosted builds formatted as "Build Name | https://url, Build Two | https://url"
    let builds: HostedBuildCMS[] = [];
    if (hostedBuildsInput) {
      builds = hostedBuildsInput.split(",").map((str) => {
        const parts = str.split("|").map((p) => p.trim());
        return { name: parts[0], url: parts[1] || undefined };
      });
    } else if (editingDeployment.hostedBuilds) {
      builds = editingDeployment.hostedBuilds;
    } else {
      builds = [{ name: "Production Web App" }];
    }

    const dep: DeploymentPlatformCMS = {
      id: editingDeployment.id || "dep_" + Date.now().toString(36),
      name: editingDeployment.name,
      category: editingDeployment.category || "Edge & Frontend Host",
      status: editingDeployment.status || "Active",
      badgeColor: editingDeployment.badgeColor || "bg-mint text-mint-foreground",
      iconName: editingDeployment.iconName || "Globe2",
      iconUrl: editingDeployment.iconUrl || "",
      description: editingDeployment.description || "",
      hostedBuilds: builds,
      link: editingDeployment.link || "https://netlify.com",
    };

    const updated = saveDeploymentLocal(dep);
    setDeployments(updated);
    setEditingDeployment(null);
    setHostedBuildsInput("");
  };

  const handleBlogSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog?.title) return;

    const blog: BlogPost = {
      id: editingBlog.id || "blog_" + Date.now().toString(36),
      slug: editingBlog.slug || editingBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: editingBlog.title,
      excerpt: editingBlog.excerpt || "",
      content: editingBlog.content || "",
      date: editingBlog.date || new Date().toISOString().slice(0, 10),
      readTime: editingBlog.readTime || "5 min read",
      category: editingBlog.category || "Engineering",
      coverImage: editingBlog.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    };
    const updated = await saveBlogLocal(blog);
    setBlogs(updated);
    setEditingBlog(null);
  };

  const handleExperienceSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExperience?.role) return;

    const item: ExperienceItemCMS = {
      id: editingExperience.id || "exp_" + Date.now().toString(36),
      role: editingExperience.role,
      company: editingExperience.company || "ASP0705DEV",
      start_date: editingExperience.start_date || "2025",
      end_date: editingExperience.end_date || "Present",
      description: editingExperience.description || "",
    };

    const currentExps = resumeData.experience || [];
    const idx = currentExps.findIndex((x) => x.id === item.id);
    let updatedExps: ExperienceItemCMS[];
    if (idx >= 0) {
      updatedExps = [...currentExps];
      updatedExps[idx] = item;
    } else {
      updatedExps = [...currentExps, item];
    }

    const newResume = { ...resumeData, experience: updatedExps };
    saveResumeLocal(newResume);
    setResumeData(newResume);
    setEditingExperience(null);
  };

  if (!isAuthenticated) {
    return (
      <>
        <SiteNav />
        <main className="pt-36 pb-24 min-h-[80vh] flex items-center justify-center">
          <Section id="admin-login" className="max-w-md w-full">
            <Reveal>
              <div
                className="border-2 border-ink bg-card p-8 doodle-shadow text-center"
                style={{ borderRadius: "24px 30px 24px 32px" }}
              >
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border-2 border-ink bg-sun text-ink mb-4">
                  <Lock className="h-7 w-7" />
                </div>

                <h1 className="font-display text-2xl font-bold">Admin CMS Login</h1>
                <p className="mt-1 text-xs text-muted-foreground">
                  Restricted ASP0705DEV portal to manage portfolio content, tech stack, deployments, case studies, blogs, and CRM leads.
                </p>

                <form onSubmit={handleLogin} className="mt-6 space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Passcode</label>
                    <input
                      type="password"
                      placeholder="Enter admin passcode (admin123)"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full rounded-xl border-2 border-ink bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl border-2 border-ink bg-coral text-coral-foreground py-3 font-bold text-sm doodle-shadow-sm hover:-translate-y-0.5 transition-transform"
                  >
                    Authenticate Portal
                  </button>
                </form>

                <div className="mt-4 pt-4 border-t border-ink/20 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPwdModal(true);
                      setPwdStep(1);
                      setPwdStatus(null);
                    }}
                    className="text-xs font-bold text-coral hover:underline inline-flex items-center gap-1.5"
                  >
                    <KeyRound className="h-3.5 w-3.5" /> Forgot or Change Admin Passcode via Email OTP
                  </button>
                </div>
              </div>
            </Reveal>
          </Section>
        </main>
        <AdminFooter />
      </>
    );
  }

  const filteredTimeline = analyticsStats.visitorTimeline.filter((t) => {
    if (!timelineSearch) return true;
    const q = timelineSearch.toLowerCase();
    return (
      t.visitor_id.toLowerCase().includes(q) ||
      (t.linked_email && t.linked_email.toLowerCase().includes(q)) ||
      t.device.toLowerCase().includes(q) ||
      t.browser.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <SiteNav />
      <main className="pt-28 pb-20">
        <Section id="admin-dashboard" className="max-w-6xl">
          <div className="flex flex-wrap items-center justify-between border-b-2 border-ink pb-6 mb-8 gap-4">
            <div>
              <span className="sticker bg-mint">ASP0705DEV Admin Portal</span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold mt-1">CMS & Analytics Control Room</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  await syncDefaultDataToSupabase();
                  refreshData();
                  alert("Supabase tables (projects, services, blog_posts, site_settings) seeded successfully!");
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-ink bg-sun px-3 py-2 text-xs font-bold doodle-shadow-sm hover:bg-sun/80"
              >
                <Upload className="h-4 w-4" /> Seed Supabase Tables
              </button>
              <button
                type="button"
                onClick={refreshData}
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-ink bg-card px-3 py-2 text-xs font-bold doodle-shadow-sm hover:bg-muted"
              >
                <RefreshCw className="h-4 w-4" /> Refresh Real Data
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPwdModal(true);
                  setPwdStep(1);
                  setPwdStatus(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-ink bg-sun px-3 py-2 text-xs font-bold doodle-shadow-sm hover:bg-sun/80"
              >
                <KeyRound className="h-4 w-4" /> Change Passcode
              </button>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("doodle_admin_authenticated");
                  }
                  setIsAuthenticated(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-ink bg-coral text-coral-foreground px-4 py-2 text-xs font-bold doodle-shadow-sm hover:opacity-90"
              >
                <LogOut className="h-4 w-4" /> Lock Portal
              </button>
            </div>
          </div>

          {/* Responsive Admin Workspace Layout */}
          <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:items-start">
            {/* ── LEFT SIDE NAVIGATION PANEL ────────────────────────────── */}
            <aside className="lg:sticky lg:top-28 space-y-4">
              {/* Mobile Quick Dropdown (Visible on sm/md) */}
              <div className="lg:hidden">
                <label className="block text-xs font-bold uppercase mb-1">Select Admin Section</label>
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value as typeof activeTab)}
                  className="w-full rounded-xl border-2 border-ink bg-card p-3 text-sm font-bold shadow-sm outline-none"
                >
                  {[
                    { id: "analytics", label: "📊 Analytics Dashboard" },
                    { id: "timeline", label: "👁️ Visitor Timeline" },
                    { id: "content", label: "🦸 Hero & About CMS" },
                    { id: "projects", label: `🚀 Showcase Projects (${projects.length})` },
                    { id: "services", label: `🛠️ Technical Services (${services.length})` },
                    { id: "techstack", label: "💻 Tech Stack Matrix" },
                    { id: "deployments", label: `☁️ Deployments (${deployments.length})` },
                    { id: "resume", label: "📄 Resume & Career" },
                    { id: "company", label: "🏢 ASP0705DEV Studio" },
                    { id: "blogs", label: `📝 Blog Articles (${blogs.length})` },
                    { id: "leads", label: `📬 Lead CRM (${leads.length})` },
                    { id: "security", label: "🔑 Security & Passcode" },
                    { id: "backup", label: "💾 Backup & Restore" },
                  ].map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Horizontal Scrollable Ribbon on Mobile/Tablet */}
              <div className="flex overflow-x-auto gap-2 pb-2 lg:hidden no-scrollbar">
                {[
                  { id: "analytics", label: "Analytics", icon: BarChart3 },
                  { id: "timeline", label: "Timeline", icon: UserCheck },
                  { id: "content", label: "Content", icon: Sliders },
                  { id: "projects", label: `Projects (${projects.length})`, icon: FolderPlus },
                  { id: "services", label: `Services (${services.length})`, icon: Globe },
                  { id: "techstack", label: "Tech Stack", icon: Code },
                  { id: "deployments", label: `Deployments (${deployments.length})`, icon: Server },
                  { id: "resume", label: "Resume", icon: Briefcase },
                  { id: "company", label: "Studio", icon: Building2 },
                  { id: "blogs", label: `Blogs (${blogs.length})`, icon: FileText },
                  { id: "leads", label: `CRM (${leads.length})`, icon: Users },
                  { id: "security", label: "Security", icon: KeyRound },
                  { id: "backup", label: "Backup", icon: Download },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border-2 border-ink px-3 py-1.5 text-xs font-bold transition-all ${
                      activeTab === tab.id ? "bg-ink text-background" : "bg-card"
                    }`}
                  >
                    <tab.icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Desktop Side Panel Navigation (Visible on lg+) */}
              <nav className="hidden lg:block space-y-1.5 border-2 border-ink bg-card p-3 doodle-shadow rounded-2xl">
                <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-ink/10 mb-1">
                  CMS Control Menu
                </div>
                {[
                  { id: "analytics", label: "Analytics", icon: BarChart3 },
                  { id: "timeline", label: "Visitor Timeline", icon: UserCheck },
                  { id: "content", label: "Hero & About", icon: Sliders },
                  { id: "projects", label: "Projects", count: projects.length, icon: FolderPlus },
                  { id: "services", label: "Services", count: services.length, icon: Globe },
                  { id: "techstack", label: "Tech Stack", icon: Code },
                  { id: "deployments", label: "Deployments", count: deployments.length, icon: Server },
                  { id: "resume", label: "Resume & Career", icon: Briefcase },
                  { id: "company", label: "ASP0705DEV Studio", icon: Building2 },
                  { id: "blogs", label: "Blogs", count: blogs.length, icon: FileText },
                  { id: "leads", label: "Lead CRM", count: leads.length, icon: Users },
                  { id: "security", label: "Security & Passcode", icon: KeyRound },
                  { id: "backup", label: "Backup & Restore", icon: Download },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`w-full flex items-center justify-between rounded-xl border-2 px-3 py-2 text-xs font-bold transition-all ${
                      activeTab === tab.id
                        ? "border-ink bg-ink text-background doodle-shadow-sm"
                        : "border-transparent text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.count !== undefined ? (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          activeTab === tab.id ? "bg-card text-ink" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {tab.count}
                      </span>
                    ) : null}
                  </button>
                ))}
              </nav>
            </aside>

            {/* ── RIGHT MAIN CONTENT AREA ────────────────────────────── */}
            <div className="min-w-0 max-w-full space-y-6">

          {/* TAB 1: REAL ANALYTICS DASHBOARD */}
          {activeTab === "analytics" ? (
            <div className="space-y-6">
              <div className="rounded-2xl border-2 border-ink bg-sun/20 p-4 text-xs font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" /> <strong>Privacy-First Real Analytics:</strong> Displays strictly real metrics from site traffic. No fake numbers.
                </span>
                <span className="sticker bg-sun">{analyticsStats.rawEventsCount} Real Events Recorded</span>
              </div>

              {analyticsStats.rawEventsCount === 0 ? (
                <div className="border-2 border-ink bg-card p-12 doodle-shadow text-center rounded-2xl">
                  <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-3 opacity-40" />
                  <h3 className="font-display text-xl font-bold">No Visitor Data Collected Yet</h3>
                  <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
                    Real analytics will populate automatically as visitors browse your portfolio.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <StatCard title="Total Visitors" value={analyticsStats.totalVisitors.toString()} badge="Distinct IDs" tint="bg-sun" />
                    <StatCard title="Active Now (15m)" value={analyticsStats.activeVisitors.toString()} badge="Realtime" tint="bg-mint" />
                    <StatCard title="Returning Visitors" value={analyticsStats.returningVisitors.toString()} badge="Repeat Views" tint="bg-bubble" />
                    <StatCard title="Total Page Views" value={analyticsStats.totalPageViews.toString()} badge="Views" tint="bg-lime" />
                    <StatCard title="Avg Session Duration" value={`${analyticsStats.avgDurationSec}s`} badge="Duration" tint="bg-coral text-coral-foreground" />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="border-2 border-ink bg-card p-5 doodle-shadow rounded-2xl">
                      <h3 className="font-display text-lg font-bold">Real Device & OS Distribution</h3>
                      <div className="mt-4 space-y-3 text-xs">
                        {Object.entries(analyticsStats.deviceBreakdown).length === 0 ? (
                          <p className="text-muted-foreground italic">No device data yet.</p>
                        ) : (
                          Object.entries(analyticsStats.deviceBreakdown).map(([device, count]) => (
                            <div key={device}>
                              <div className="flex justify-between font-bold mb-1 capitalize">
                                <span>{device}</span>
                                <span>{count} visits</span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden border border-ink">
                                <div
                                  className="h-full bg-mint"
                                  style={{
                                    width: `${Math.round((count / analyticsStats.rawEventsCount) * 100)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="border-2 border-ink bg-card p-5 doodle-shadow rounded-2xl">
                      <h3 className="font-display text-lg font-bold">Top Real Visited Pages</h3>
                      <div className="mt-4 space-y-2 text-xs font-semibold">
                        {analyticsStats.topPages.length === 0 ? (
                          <p className="text-muted-foreground italic">No page views recorded yet.</p>
                        ) : (
                          analyticsStats.topPages.map((tp, i) => (
                            <div key={tp.path} className="flex items-center justify-between border-b border-ink/15 pb-2">
                              <span>
                                {i + 1}. {tp.path}
                              </span>
                              <span className="sticker bg-sun">{tp.count} views</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : null}

          {/* TAB 2: VISITOR ACTIVITY TIMELINE */}
          {activeTab === "timeline" ? (
            <div className="border-2 border-ink bg-card p-6 doodle-shadow rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-ink/20 pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold">Visitor Activity Timeline</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Session activity inspector for analytics and user interactions.
                  </p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={timelineSearch}
                    onChange={(e) => setTimelineSearch(e.target.value)}
                    placeholder="Search sessions or email..."
                    className="w-full rounded-xl border-2 border-ink bg-background py-1.5 pl-9 pr-3 text-xs outline-none"
                  />
                </div>
              </div>

              {filteredTimeline.length === 0 ? (
                <div className="text-center py-10 text-xs text-muted-foreground italic">
                  No visitor session timelines recorded matching your search.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b-2 border-ink bg-muted/60">
                        <th className="p-3 font-bold uppercase">Visitor / Email</th>
                        <th className="p-3 font-bold uppercase">Consent</th>
                        <th className="p-3 font-bold uppercase">Device / OS</th>
                        <th className="p-3 font-bold uppercase">Pages Visited</th>
                        <th className="p-3 font-bold uppercase">Actions</th>
                        <th className="p-3 font-bold uppercase">Last Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTimeline.map((sess) => (
                        <tr key={sess.session_id} className="border-b border-ink/20 hover:bg-muted/20">
                          <td className="p-3">
                            {sess.linked_email ? (
                              <div className="font-bold text-coral flex items-center gap-1">
                                <Mail className="h-3.5 w-3.5" /> {sess.linked_email}
                              </div>
                            ) : (
                              <div className="font-bold font-mono">
                                {sess.consent_granted ? sess.visitor_id.slice(0, 12) + "..." : "Anonymous Visitor"}
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            {sess.consent_granted ? (
                              <span className="sticker bg-mint text-ink font-bold inline-flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Granted</span>
                            ) : (
                              <span className="sticker bg-muted text-muted-foreground">Anonymous</span>
                            )}
                          </td>
                          <td className="p-3 font-semibold">
                            {sess.device} · {sess.browser} ({sess.os})
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {sess.pages_visited.map((p) => (
                                <span key={p} className="rounded border border-ink px-1.5 py-0.5 text-[10px] font-mono font-bold bg-background">
                                  {p}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3 font-bold">{sess.actions_count} events</td>
                          <td className="p-3 font-mono text-[11px] whitespace-nowrap">
                            {new Date(sess.last_active).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : null}

          {/* TAB 3: HERO & ABOUT CONTENT MANAGER */}
          {activeTab === "content" ? (
            <form onSubmit={handleSaveCMSContent} className="border-2 border-ink bg-card p-6 doodle-shadow rounded-2xl space-y-6">
              <div className="flex justify-between items-center border-b-2 border-ink/20 pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold">Hero & About Section Content</h3>
                  <p className="text-xs text-muted-foreground">Manage your profile bio, status badge, roles, and links.</p>
                </div>
                <button type="submit" className="rounded-xl border-2 border-ink bg-coral text-coral-foreground px-5 py-2.5 font-bold text-xs doodle-shadow-sm">
                  Save Changes
                </button>
              </div>

              {/* Hero Form */}
              <div className="space-y-3">
                <h4 className="font-display text-base font-bold text-coral">Hero Section</h4>
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <label className="block">
                    <span className="font-bold">Your Name</span>
                    <input
                      value={cmsContent.hero.name}
                      onChange={(e) => setCmsContent({ ...cmsContent, hero: { ...cmsContent.hero, name: e.target.value } })}
                      className="w-full mt-1 rounded-xl border border-ink p-2 bg-background"
                    />
                  </label>
                  <label className="block">
                    <span className="font-bold">Status Badge Text</span>
                    <input
                      value={cmsContent.hero.status_badge}
                      onChange={(e) => setCmsContent({ ...cmsContent, hero: { ...cmsContent.hero, status_badge: e.target.value } })}
                      className="w-full mt-1 rounded-xl border border-ink p-2 bg-background"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="font-bold">Hero Tagline</span>
                    <input
                      value={cmsContent.hero.tagline}
                      onChange={(e) => setCmsContent({ ...cmsContent, hero: { ...cmsContent.hero, tagline: e.target.value } })}
                      className="w-full mt-1 rounded-xl border border-ink p-2 bg-background"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="font-bold">Rotating Roles (Comma Separated)</span>
                    <input
                      value={cmsContent.hero.roles.join(", ")}
                      onChange={(e) =>
                        setCmsContent({
                          ...cmsContent,
                          hero: { ...cmsContent.hero, roles: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) },
                        })
                      }
                      className="w-full mt-1 rounded-xl border border-ink p-2 bg-background"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="font-bold">Hero Image / Avatar URL</span>
                    <input
                      value={cmsContent.hero.hero_image || ""}
                      onChange={(e) => setCmsContent({ ...cmsContent, hero: { ...cmsContent.hero, hero_image: e.target.value } })}
                      className="w-full mt-1 rounded-xl border border-ink p-2 bg-background"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </label>
                </div>
              </div>

              {/* About Form */}
              <div className="space-y-3 border-t-2 border-ink/15 pt-4">
                <h4 className="font-display text-base font-bold text-mint">About Section</h4>
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <label className="block sm:col-span-2">
                    <span className="font-bold">About Bio Paragraph</span>
                    <textarea
                      rows={3}
                      value={cmsContent.about.bio}
                      onChange={(e) => setCmsContent({ ...cmsContent, about: { ...cmsContent.about, bio: e.target.value } })}
                      className="w-full mt-1 rounded-xl border border-ink p-2 bg-background"
                    />
                  </label>
                  <label className="block">
                    <span className="font-bold">Location</span>
                    <input
                      value={cmsContent.about.location}
                      onChange={(e) => setCmsContent({ ...cmsContent, about: { ...cmsContent.about, location: e.target.value } })}
                      className="w-full mt-1 rounded-xl border border-ink p-2 bg-background"
                    />
                  </label>
                  <label className="block">
                    <span className="font-bold">Resume Download URL</span>
                    <input
                      value={cmsContent.about.resume_url}
                      onChange={(e) => setCmsContent({ ...cmsContent, about: { ...cmsContent.about, resume_url: e.target.value } })}
                      className="w-full mt-1 rounded-xl border border-ink p-2 bg-background"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="rounded-xl border-2 border-ink bg-coral text-coral-foreground px-6 py-3 font-bold text-sm doodle-shadow-sm">
                  Save All CMS Changes
                </button>
              </div>
            </form>
          ) : null}

          {/* TAB 4: PROJECTS & CASE STUDIES MANAGER */}
          {activeTab === "projects" ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-display text-xl font-bold">Featured Projects & Case Studies ({projects.length})</h3>
                  <p className="text-xs text-muted-foreground">Manage project cards, live links, code repos, images, and full case study details.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProject({
                      title: "New Featured Project",
                      category: "fullstack",
                      summary: "Project executive summary.",
                      description: "Detailed description of the build architecture and goals.",
                      status: "Live",
                      timeline: "1 Month",
                      role: "Full Stack Developer",
                      challenges: "Key technical challenge faced during build.",
                      solutions: "Solutions and architectural resolution.",
                      architecture: "System flow description.",
                      deployment_platform: "Vercel / Netlify",
                      tech_stack: ["React", "TypeScript", "Node.js"],
                      features: ["Real-time dashboard", "Automated pipelines"],
                      live_url: "https://asp0705dev.com",
                      repo_url: "https://github.com/codeping0705",
                    });
                    setProjectTechStackInput("React, TypeScript, Node.js");
                    setProjectFeaturesInput("Real-time dashboard, Automated pipelines");
                  }}
                  className="rounded-xl border-2 border-ink bg-mint px-4 py-2 text-xs font-bold doodle-shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Add New Project
                </button>
              </div>

              {editingProject ? (
                <form onSubmit={handleProjectSave} className="border-2 border-ink bg-sun/20 p-6 doodle-shadow rounded-2xl space-y-4 text-xs">
                  <h4 className="font-bold text-base font-display">Edit Project & Case Study</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-bold">Project Title</span>
                      <input
                        required
                        value={editingProject.title || ""}
                        onChange={(e) => setEditingProject((p) => ({ ...p, title: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block">
                      <span className="font-bold">Category</span>
                      <select
                        value={editingProject.category || "fullstack"}
                        onChange={(e) => setEditingProject((p) => ({ ...p, category: e.target.value as ShowcaseProject["category"] }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      >
                        <option value="ai">🤖 AI & Agents</option>
                        <option value="fullstack">💻 Full Stack</option>
                        <option value="automation">⚙️ Automation</option>
                        <option value="ecommerce">🛒 E-Commerce</option>
                        <option value="opensource">🌐 Open Source</option>
                      </select>
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="font-bold">Executive Summary</span>
                      <input
                        value={editingProject.summary || ""}
                        onChange={(e) => setEditingProject((p) => ({ ...p, summary: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="font-bold">Full Case Study Description</span>
                      <textarea
                        rows={3}
                        value={editingProject.description || ""}
                        onChange={(e) => setEditingProject((p) => ({ ...p, description: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block">
                      <span className="font-bold">Tech Stack (Comma Separated)</span>
                      <input
                        value={projectTechStackInput || (editingProject.tech_stack ? editingProject.tech_stack.join(", ") : "")}
                        onChange={(e) => setProjectTechStackInput(e.target.value)}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block">
                      <span className="font-bold">Features List (Comma Separated)</span>
                      <input
                        value={projectFeaturesInput || (editingProject.features ? editingProject.features.join(", ") : "")}
                        onChange={(e) => setProjectFeaturesInput(e.target.value)}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block">
                      <span className="font-bold">Challenges</span>
                      <input
                        value={editingProject.challenges || ""}
                        onChange={(e) => setEditingProject((p) => ({ ...p, challenges: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block">
                      <span className="font-bold">Solutions</span>
                      <input
                        value={editingProject.solutions || ""}
                        onChange={(e) => setEditingProject((p) => ({ ...p, solutions: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="font-bold">System Architecture Flow</span>
                      <input
                        value={editingProject.architecture || ""}
                        onChange={(e) => setEditingProject((p) => ({ ...p, architecture: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block">
                      <span className="font-bold">Live Demo URL</span>
                      <input
                        value={editingProject.live_url || ""}
                        onChange={(e) => setEditingProject((p) => ({ ...p, live_url: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block">
                      <span className="font-bold">GitHub Repo URL</span>
                      <input
                        value={editingProject.repo_url || ""}
                        onChange={(e) => setEditingProject((p) => ({ ...p, repo_url: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="font-bold">Cover Image URL</span>
                      <input
                        value={editingProject.cover_image || ""}
                        onChange={(e) => setEditingProject((p) => ({ ...p, cover_image: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setEditingProject(null)} className="rounded-xl border border-ink px-4 py-2 bg-card">
                      Cancel
                    </button>
                    <button type="submit" className="rounded-xl border border-ink bg-coral text-coral-foreground px-5 py-2 font-bold">
                      Save Project Case Study
                    </button>
                  </div>
                </form>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((p) => (
                  <div key={p.id} className="border-2 border-ink bg-card p-4 rounded-xl flex flex-col justify-between doodle-shadow-sm">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="sticker bg-sun capitalize">{p.category}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProject(p);
                              setProjectTechStackInput(p.tech_stack.join(", "));
                              setProjectFeaturesInput((p.features || []).join(", "));
                            }}
                            className="rounded-lg border border-ink p-1 hover:bg-muted"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              const updated = await deleteProjectLocal(p.id);
                              setProjects(updated);
                            }}
                            className="rounded-lg border border-ink p-1 hover:bg-coral hover:text-coral-foreground"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-sm font-display mt-2">{p.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.summary}</p>
                    </div>
                    <div className="mt-3 border-t border-ink/15 pt-2 text-[10px] font-semibold text-muted-foreground flex justify-between">
                      <span>{p.status}</span>
                      <span>{p.tech_stack.slice(0, 3).join(", ")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* TAB 5: SERVICES MANAGER */}
          {activeTab === "services" ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-display text-xl font-bold">Technical Services ({services.length})</h3>
                  <p className="text-xs text-muted-foreground">Manage service offerings, deliverables, and capabilities.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingService({
                      title: "New Technical Service",
                      category: "web",
                      shortDescription: "Short service summary.",
                      fullDescription: "Detailed description of engineering process and stack.",
                      deliverables: ["Custom UI", "REST API", "Database Setup"],
                      technologies: ["React", "TypeScript", "Node.js"],
                    });
                    setDeliverablesInput("Custom UI, REST API, Database Setup");
                    setTechnologiesInput("React, TypeScript, Node.js");
                  }}
                  className="rounded-xl border-2 border-ink bg-mint px-4 py-2 text-xs font-bold doodle-shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Add New Service
                </button>
              </div>

              {editingService ? (
                <form onSubmit={handleServiceSave} className="border-2 border-ink bg-mint/20 p-5 doodle-shadow rounded-2xl space-y-4 text-xs">
                  <h4 className="font-bold text-base font-display">Edit Service Offering</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-bold">Service Title</span>
                      <input
                        required
                        value={editingService.title || ""}
                        onChange={(e) => setEditingService((s) => ({ ...s, title: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block">
                      <span className="font-bold">Category</span>
                      <select
                        value={editingService.category || "web"}
                        onChange={(e) => setEditingService((s) => ({ ...s, category: e.target.value as ServiceItem["category"] }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      >
                        <option value="web">💻 Web & Software</option>
                        <option value="ai">🤖 Agentic & GenAI</option>
                        <option value="software">⚙️ Business Software</option>
                        <option value="cloud">☁️ Cloud & DevOps</option>
                      </select>
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="font-bold">Short Summary</span>
                      <input
                        value={editingService.shortDescription || ""}
                        onChange={(e) => setEditingService((s) => ({ ...s, shortDescription: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="font-bold">Full Description</span>
                      <textarea
                        rows={3}
                        value={editingService.fullDescription || ""}
                        onChange={(e) => setEditingService((s) => ({ ...s, fullDescription: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="font-bold">Deliverables (Comma Separated)</span>
                      <input
                        value={deliverablesInput || (editingService.deliverables ? editingService.deliverables.join(", ") : "")}
                        onChange={(e) => setDeliverablesInput(e.target.value)}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="font-bold">Technologies (Comma Separated)</span>
                      <input
                        value={technologiesInput || (editingService.technologies ? editingService.technologies.join(", ") : "")}
                        onChange={(e) => setTechnologiesInput(e.target.value)}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setEditingService(null)} className="rounded-xl border border-ink px-4 py-2 bg-card">
                      Cancel
                    </button>
                    <button type="submit" className="rounded-xl border border-ink bg-coral text-coral-foreground px-5 py-2 font-bold">
                      Save Service
                    </button>
                  </div>
                </form>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((s) => (
                  <div key={s.id} className="border-2 border-ink bg-card p-4 rounded-xl flex flex-col justify-between doodle-shadow-sm">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="sticker bg-sun capitalize">{s.category}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingService(s);
                              setDeliverablesInput(s.deliverables.join(", "));
                              setTechnologiesInput(s.technologies.join(", "));
                            }}
                            className="rounded-lg border border-ink p-1 hover:bg-muted"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              const updated = await deleteServiceLocal(s.id);
                              setServices(updated);
                            }}
                            className="rounded-lg border border-ink p-1 hover:bg-coral hover:text-coral-foreground"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-sm font-display mt-2">{s.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.shortDescription}</p>
                    </div>
                    <div className="mt-3 border-t border-ink/15 pt-2 text-[10px] font-semibold text-muted-foreground">
                      {s.deliverables.length} Deliverables · {s.technologies.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* TAB 6: TECH STACK & IMAGE ICONS MANAGER */}
          {activeTab === "techstack" ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-display text-xl font-bold">Technology Stack & Image Icons Manager</h3>
                  <p className="text-xs text-muted-foreground">Manage your technical skills toolbox. Add custom image URLs or SVG paths for tech icons.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const group = techStack[0];
                    if (!group) return;
                    const newItem: TechItemCMS = {
                      id: "tech_" + Date.now().toString(36),
                      title: "New Technology",
                      imageUrl: "",
                      hex: "61DAFB",
                    };
                    const updatedGroup = { ...group, items: [...group.items, newItem] };
                    const updatedStack = techStack.map((g) => (g.id === group.id ? updatedGroup : g));
                    saveTechStackLocal(updatedStack);
                    setTechStack(updatedStack);
                  }}
                  className="rounded-xl border-2 border-ink bg-mint px-4 py-2 text-xs font-bold doodle-shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Add Tech Item
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {techStack.map((group, groupIdx) => (
                  <div key={group.id} className="border-2 border-ink bg-card p-5 doodle-shadow rounded-2xl space-y-4">
                    <div className="flex justify-between items-center border-b border-ink/20 pb-2">
                      <h4 className="font-display text-lg font-bold">{group.label}</h4>
                      <span className="sticker bg-sun text-xs">{group.items.length} Icons</span>
                    </div>

                    <div className="space-y-3">
                      {group.items.map((item, itemIdx) => (
                        <div key={item.id || item.title} className="border border-ink/20 p-3 rounded-xl bg-background/50 space-y-2 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              value={item.title}
                              onChange={(e) => {
                                const newItems = [...group.items];
                                newItems[itemIdx] = { ...item, title: e.target.value };
                                const newStack = [...techStack];
                                newStack[groupIdx] = { ...group, items: newItems };
                                setTechStack(newStack);
                                saveTechStackLocal(newStack);
                              }}
                              className="font-bold border border-ink p-1.5 rounded-lg bg-card w-full"
                              placeholder="Tech Title (e.g. React)"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = group.items.filter((_, idx) => idx !== itemIdx);
                                const newStack = [...techStack];
                                newStack[groupIdx] = { ...group, items: newItems };
                                setTechStack(newStack);
                                saveTechStackLocal(newStack);
                              }}
                              className="rounded-lg border border-ink p-1.5 hover:bg-coral hover:text-coral-foreground shrink-0"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="grid gap-2 sm:grid-cols-2">
                            <label className="block">
                              <span className="text-[10px] font-bold">Image Icon URL</span>
                              <input
                                value={item.imageUrl || ""}
                                onChange={(e) => {
                                  const newItems = [...group.items];
                                  newItems[itemIdx] = { ...item, imageUrl: e.target.value };
                                  const newStack = [...techStack];
                                  newStack[groupIdx] = { ...group, items: newItems };
                                  setTechStack(newStack);
                                  saveTechStackLocal(newStack);
                                }}
                                className="w-full mt-0.5 border border-ink p-1.5 rounded-lg bg-card text-[11px]"
                                placeholder="https://..."
                              />
                            </label>
                            <label className="block">
                              <span className="text-[10px] font-bold">HEX Color Code</span>
                              <input
                                value={item.hex || ""}
                                onChange={(e) => {
                                  const newItems = [...group.items];
                                  newItems[itemIdx] = { ...item, hex: e.target.value };
                                  const newStack = [...techStack];
                                  newStack[groupIdx] = { ...group, items: newItems };
                                  setTechStack(newStack);
                                  saveTechStackLocal(newStack);
                                }}
                                className="w-full mt-0.5 border border-ink p-1.5 rounded-lg bg-card text-[11px]"
                                placeholder="61DAFB"
                              />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* TAB 7: DEPLOYMENTS & INFRASTRUCTURE SHOWCASE MANAGER */}
          {activeTab === "deployments" ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-display text-xl font-bold">Deployment & Infrastructure Showcase ({deployments.length})</h3>
                  <p className="text-xs text-muted-foreground">Manage hosted platforms, build names, custom icon URLs, and clickable redirect links.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingDeployment({
                      name: "New Deployment Platform",
                      category: "Edge & Cloud Host",
                      status: "Active",
                      badgeColor: "bg-mint text-mint-foreground",
                      iconName: "Globe2",
                      description: "Automated container builds and web hosting.",
                      hostedBuilds: [{ name: "Production Build", url: "https://asp0705dev.com" }],
                      link: "https://netlify.com",
                    });
                    setHostedBuildsInput("Production Build | https://asp0705dev.com");
                  }}
                  className="rounded-xl border-2 border-ink bg-mint px-4 py-2 text-xs font-bold doodle-shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Add Deployment Platform
                </button>
              </div>

              {editingDeployment ? (
                <form onSubmit={handleDeploymentSave} className="border-2 border-ink bg-sky/20 p-5 doodle-shadow rounded-2xl space-y-4 text-xs">
                  <h4 className="font-bold text-base font-display">Edit Deployment Platform</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-bold">Platform Name</span>
                      <input
                        required
                        value={editingDeployment.name || ""}
                        onChange={(e) => setEditingDeployment((d) => ({ ...d, name: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block">
                      <span className="font-bold">Category</span>
                      <input
                        value={editingDeployment.category || ""}
                        onChange={(e) => setEditingDeployment((d) => ({ ...d, category: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block">
                      <span className="font-bold">Status Badge</span>
                      <select
                        value={editingDeployment.status || "Active"}
                        onChange={(e) => setEditingDeployment((d) => ({ ...d, status: e.target.value as DeploymentPlatformCMS["status"] }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      >
                        <option value="Primary">Primary</option>
                        <option value="Active">Active</option>
                        <option value="Healthy">Healthy</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="font-bold">Platform URL (Redirect on click)</span>
                      <input
                        value={editingDeployment.link || ""}
                        onChange={(e) => setEditingDeployment((d) => ({ ...d, link: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="font-bold">Hosted Builds (Format: Name | URL, Name2 | URL2)</span>
                      <input
                        value={
                          hostedBuildsInput ||
                          (editingDeployment.hostedBuilds ? editingDeployment.hostedBuilds.map((b) => `${b.name}${b.url ? ` | ${b.url}` : ""}`).join(", ") : "")
                        }
                        onChange={(e) => setHostedBuildsInput(e.target.value)}
                        placeholder="MentorHive Platform | https://mentorhive.netlify.app, Doodle Portfolio | https://asp0705dev.com"
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="font-bold">Description</span>
                      <textarea
                        rows={2}
                        value={editingDeployment.description || ""}
                        onChange={(e) => setEditingDeployment((d) => ({ ...d, description: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setEditingDeployment(null)} className="rounded-xl border border-ink px-4 py-2 bg-card">
                      Cancel
                    </button>
                    <button type="submit" className="rounded-xl border border-ink bg-coral text-coral-foreground px-5 py-2 font-bold">
                      Save Platform
                    </button>
                  </div>
                </form>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {deployments.map((d) => (
                  <div key={d.id} className="border-2 border-ink bg-card p-4 rounded-xl flex flex-col justify-between doodle-shadow-sm">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className={`sticker ${d.badgeColor}`}>{d.status}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDeployment(d);
                              setHostedBuildsInput(d.hostedBuilds.map((b) => `${b.name}${b.url ? ` | ${b.url}` : ""}`).join(", "));
                            }}
                            className="rounded-lg border border-ink p-1 hover:bg-muted"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = deleteDeploymentLocal(d.id);
                              setDeployments(updated);
                            }}
                            className="rounded-lg border border-ink p-1 hover:bg-coral hover:text-coral-foreground"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-sm font-display mt-2">{d.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{d.description}</p>
                    </div>
                    <div className="mt-3 border-t border-ink/15 pt-2 text-[10px] font-semibold text-muted-foreground flex justify-between items-center">
                      <span>{d.hostedBuilds.length} Hosted Builds</span>
                      <a href={d.link} target="_blank" rel="noreferrer" className="text-coral hover:underline inline-flex items-center gap-1">
                        URL <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* TAB 8: RESUME & CAREER EXPERIENCE MANAGER */}
          {activeTab === "resume" ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-display text-xl font-bold">Resume & Career Experience Manager</h3>
                  <p className="text-xs text-muted-foreground">Manage profile summary, work experience history, and downloadable resume links.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingExperience({
                      role: "Software Developer",
                      company: "ASP0705DEV",
                      start_date: "2025",
                      end_date: "Present",
                      description: "Full stack engineering, Agentic AI, and cloud automation.",
                    })
                  }
                  className="rounded-xl border-2 border-ink bg-mint px-4 py-2 text-xs font-bold doodle-shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Add Experience Entry
                </button>
              </div>

              {editingExperience ? (
                <form onSubmit={handleExperienceSave} className="border-2 border-ink bg-sun/20 p-5 doodle-shadow rounded-2xl space-y-4 text-xs">
                  <h4 className="font-bold text-base font-display">Edit Work Experience</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-bold">Role Title</span>
                      <input
                        required
                        value={editingExperience.role || ""}
                        onChange={(e) => setEditingExperience((x) => ({ ...x, role: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block">
                      <span className="font-bold">Company Name</span>
                      <input
                        value={editingExperience.company || ""}
                        onChange={(e) => setEditingExperience((x) => ({ ...x, company: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block">
                      <span className="font-bold">Start Date</span>
                      <input
                        value={editingExperience.start_date || ""}
                        onChange={(e) => setEditingExperience((x) => ({ ...x, start_date: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block">
                      <span className="font-bold">End Date (or Present)</span>
                      <input
                        value={editingExperience.end_date || ""}
                        onChange={(e) => setEditingExperience((x) => ({ ...x, end_date: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="font-bold">Role Description</span>
                      <textarea
                        rows={3}
                        value={editingExperience.description || ""}
                        onChange={(e) => setEditingExperience((x) => ({ ...x, description: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setEditingExperience(null)} className="rounded-xl border border-ink px-4 py-2 bg-card">
                      Cancel
                    </button>
                    <button type="submit" className="rounded-xl border border-ink bg-coral text-coral-foreground px-5 py-2 font-bold">
                      Save Experience Entry
                    </button>
                  </div>
                </form>
              ) : null}

              <div className="space-y-3">
                {resumeData.experience.map((exp) => (
                  <div key={exp.id || exp.role} className="border-2 border-ink bg-card p-4 rounded-xl flex items-center justify-between doodle-shadow-sm">
                    <div>
                      <div className="font-bold text-sm font-display">{exp.role} — <span className="text-coral">{exp.company}</span></div>
                      <div className="text-xs text-muted-foreground">{exp.start_date} — {exp.end_date || "Present"}</div>
                      <p className="text-xs mt-1 text-muted-foreground max-w-xl">{exp.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingExperience(exp)}
                        className="rounded-lg border border-ink p-1.5 hover:bg-muted"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newExps = resumeData.experience.filter((x) => x.id !== exp.id);
                          const newR = { ...resumeData, experience: newExps };
                          saveResumeLocal(newR);
                          setResumeData(newR);
                        }}
                        className="rounded-lg border border-ink p-1.5 hover:bg-coral hover:text-coral-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* TAB 9: ASP0705DEV COMPANY STUDIO MANAGER */}
          {activeTab === "company" ? (
            <form onSubmit={handleSaveCMSContent} className="border-2 border-ink bg-card p-6 doodle-shadow rounded-2xl space-y-6">
              <div className="flex justify-between items-center border-b-2 border-ink/20 pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold">ASP0705DEV Software Studio</h3>
                  <p className="text-xs text-muted-foreground">Manage your studio description, subtitle, and stats.</p>
                </div>
                <button type="submit" className="rounded-xl border-2 border-ink bg-coral text-coral-foreground px-5 py-2.5 font-bold text-xs doodle-shadow-sm">
                  Save Changes
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <label className="block">
                  <span className="font-bold">Studio Title</span>
                  <input
                    value={cmsContent.company.title}
                    onChange={(e) => setCmsContent({ ...cmsContent, company: { ...cmsContent.company, title: e.target.value } })}
                    className="w-full mt-1 rounded-xl border border-ink p-2 bg-background"
                  />
                </label>
                <label className="block">
                  <span className="font-bold">Studio Subtitle</span>
                  <input
                    value={cmsContent.company.subtitle}
                    onChange={(e) => setCmsContent({ ...cmsContent, company: { ...cmsContent.company, subtitle: e.target.value } })}
                    className="w-full mt-1 rounded-xl border border-ink p-2 bg-background"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="font-bold">Studio Description</span>
                  <textarea
                    rows={4}
                    value={cmsContent.company.description}
                    onChange={(e) => setCmsContent({ ...cmsContent, company: { ...cmsContent.company, description: e.target.value } })}
                    className="w-full mt-1 rounded-xl border border-ink p-2 bg-background"
                  />
                </label>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="rounded-xl border-2 border-ink bg-coral text-coral-foreground px-6 py-3 font-bold text-sm doodle-shadow-sm">
                  Save Studio Changes
                </button>
              </div>
            </form>
          ) : null}

          {/* TAB 10: BLOG ARTICLES MANAGER */}
          {activeTab === "blogs" ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-display text-xl font-bold">Blog Articles ({blogs.length})</h3>
                  <p className="text-xs text-muted-foreground">Publish technical posts and agentic AI tutorials.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingBlog({
                      title: "New Technical Post",
                      slug: "new-technical-post",
                      excerpt: "Brief summary of the article.",
                      content: "# Article Heading\n\nWrite article content here...",
                      category: "Engineering",
                      readTime: "5 min read",
                      date: new Date().toISOString().slice(0, 10),
                    })
                  }
                  className="rounded-xl border-2 border-ink bg-mint px-4 py-2 text-xs font-bold doodle-shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Add New Post
                </button>
              </div>

              {editingBlog ? (
                <form onSubmit={handleBlogSave} className="border-2 border-ink bg-bubble/20 p-5 doodle-shadow rounded-2xl space-y-4 text-xs">
                  <h4 className="font-bold text-base font-display">Edit Blog Article</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block sm:col-span-2">
                      <span className="font-bold">Article Title</span>
                      <input
                        required
                        value={editingBlog.title || ""}
                        onChange={(e) => setEditingBlog((b) => ({ ...b, title: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block">
                      <span className="font-bold">Category</span>
                      <input
                        value={editingBlog.category || "Engineering"}
                        onChange={(e) => setEditingBlog((b) => ({ ...b, category: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block">
                      <span className="font-bold">Read Time</span>
                      <input
                        value={editingBlog.readTime || "5 min read"}
                        onChange={(e) => setEditingBlog((b) => ({ ...b, readTime: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="font-bold">Excerpt</span>
                      <input
                        value={editingBlog.excerpt || ""}
                        onChange={(e) => setEditingBlog((b) => ({ ...b, excerpt: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="font-bold">Content (Markdown Format)</span>
                      <textarea
                        rows={8}
                        value={editingBlog.content || ""}
                        onChange={(e) => setEditingBlog((b) => ({ ...b, content: e.target.value }))}
                        className="w-full mt-1 rounded-xl border border-ink p-2 bg-card font-mono text-xs"
                      />
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setEditingBlog(null)} className="rounded-xl border border-ink px-4 py-2 bg-card">
                      Cancel
                    </button>
                    <button type="submit" className="rounded-xl border border-ink bg-coral text-coral-foreground px-5 py-2 font-bold">
                      Save Article
                    </button>
                  </div>
                </form>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                {blogs.map((b) => (
                  <div key={b.id} className="border-2 border-ink bg-card p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm font-display">{b.title}</div>
                      <div className="text-xs text-muted-foreground">{b.category} · {b.date} · {b.readTime}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingBlog(b)}
                        className="rounded-lg border border-ink p-1.5 hover:bg-muted"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const updated = await deleteBlogLocal(b.id);
                          setBlogs(updated);
                        }}
                        className="rounded-lg border border-ink p-1.5 hover:bg-coral hover:text-coral-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* TAB 11: LEAD CRM */}
          {activeTab === "leads" ? (
            <div className="border-2 border-ink bg-card p-6 doodle-shadow rounded-2xl">
              <h3 className="font-display text-xl font-bold mb-4">Centralized Lead Management Inbox</h3>
              {leads.length === 0 ? (
                <div className="text-center py-10 text-xs text-muted-foreground italic">
                  No lead inquiries recorded yet. Leads submitted through contact forms will populate here.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b-2 border-ink bg-muted/60">
                        <th className="p-3 font-bold uppercase">Date</th>
                        <th className="p-3 font-bold uppercase">Name & Email</th>
                        <th className="p-3 font-bold uppercase">Source</th>
                        <th className="p-3 font-bold uppercase">Subject & Message</th>
                        <th className="p-3 font-bold uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((l) => (
                        <tr key={l.id} className="border-b border-ink/20 hover:bg-muted/20">
                          <td className="p-3 whitespace-nowrap font-mono">{new Date(l.created_at).toLocaleDateString()}</td>
                          <td className="p-3">
                            <div className="font-bold">{l.name}</div>
                            <div className="text-muted-foreground">{l.email}</div>
                          </td>
                          <td className="p-3">
                            <span className="sticker bg-sun">{l.source}</span>
                          </td>
                          <td className="p-3 max-w-xs">
                            <div className="font-bold truncate">{l.subject}</div>
                            <div className="text-muted-foreground truncate">{l.message}</div>
                          </td>
                          <td className="p-3">
                            <select
                              value={l.status}
                              onChange={(e) => handleStatusChange(l.id, e.target.value as LeadEntry["status"])}
                              className="rounded-lg border border-ink bg-background p-1 font-bold text-xs"
                            >
                              <option value="new">🆕 New</option>
                              <option value="contacted">📞 Contacted</option>
                              <option value="in_progress">⚙️ In Progress</option>
                              <option value="archived">📁 Archived</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : null}

          {/* TAB 12: SECURITY & PASSCODE MANAGEMENT */}
          {activeTab === "security" ? (
            <div className="border-2 border-ink bg-card p-6 doodle-shadow rounded-2xl max-w-xl space-y-6">
              <div className="flex items-center gap-3 border-b-2 border-ink pb-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-ink bg-sun text-ink">
                  <KeyRound className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">Security & Admin Passcode</h3>
                  <p className="text-xs text-muted-foreground">Authenticate via Email OTP to reset or update your admin portal passcode.</p>
                </div>
              </div>

              {pwdStatus && (
                <div
                  className={`rounded-xl border-2 border-ink p-3.5 text-xs font-semibold ${
                    pwdStatus.type === "success" ? "bg-mint/40 text-ink" : "bg-coral/20 text-coral-foreground"
                  }`}
                >
                  {pwdStatus.text}
                </div>
              )}

              {pwdStep === 1 ? (
                <form onSubmit={handleRequestOTP} className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Enter your admin email address below to receive a 6-digit OTP authentication code to change your passcode.
                  </p>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Admin Email Address</label>
                    <input
                      type="email"
                      required
                      value={adminEmailInput}
                      onChange={(e) => setAdminEmailInput(e.target.value)}
                      placeholder="e.g. admin@asp0705dev.com"
                      className="w-full rounded-xl border-2 border-ink bg-background p-3 text-sm outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={pwdLoading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-sun py-3 text-sm font-bold doodle-shadow-sm hover:bg-sun/80 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" /> {pwdLoading ? "Sending OTP..." : "Send OTP Verification Code"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyAndUpdatePassword} className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Enter the 6-digit OTP code sent to <strong>{adminEmailInput}</strong> and your new admin passcode.
                  </p>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">6-Digit OTP Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="123456"
                      className="w-full rounded-xl border-2 border-ink bg-background p-3 text-center font-mono text-xl tracking-widest outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">New Admin Passcode</label>
                    <input
                      type="password"
                      required
                      minLength={4}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new passcode"
                      className="w-full rounded-xl border-2 border-ink bg-background p-3 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Confirm New Passcode</label>
                    <input
                      type="password"
                      required
                      minLength={4}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new passcode"
                      className="w-full rounded-xl border-2 border-ink bg-background p-3 text-sm outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setPwdStep(1)}
                      className="w-1/3 rounded-xl border-2 border-ink bg-card py-3 text-xs font-bold hover:bg-muted"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={pwdLoading}
                      className="w-2/3 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-mint py-3 text-sm font-bold doodle-shadow-sm hover:bg-mint/80 disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" /> {pwdLoading ? "Verifying..." : "Update Passcode"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : null}

          {/* TAB 13: BACKUP & RESTORE */}
          {activeTab === "backup" ? (
            <div className="border-2 border-ink bg-card p-6 doodle-shadow rounded-2xl max-w-xl space-y-6">
              <div>
                <h3 className="font-display text-xl font-bold">Export JSON Backup</h3>
                <p className="text-xs text-muted-foreground mt-1">Download a full JSON snapshot of master content, projects, tech stack, deployments, resume, blogs, CRM leads, and subscribers.</p>
                <button
                  type="button"
                  onClick={exportCMSBackup}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-mint px-5 py-2.5 text-xs font-bold doodle-shadow-sm"
                >
                  <Download className="h-4 w-4" /> Download Backup JSON
                </button>
              </div>

              <div className="border-t-2 border-ink/20 pt-6">
                <h3 className="font-display text-xl font-bold">Restore Backup</h3>
                <p className="text-xs text-muted-foreground mt-1">Upload a previously exported JSON backup file to restore CMS data.</p>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const content = ev.target?.result as string;
                      if (importCMSBackup(content)) {
                        alert("CMS Data restored successfully!");
                        window.location.reload();
                      }
                    };
                    reader.readAsText(file);
                  }}
                  className="mt-3 text-xs"
                />
              </div>
            </div>
          ) : null}
            </div>
          </div>
        </Section>
      </main>

      {/* CHANGE PASSWORD & ACCOUNT OTP MODAL */}
      {showPwdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-md border-2 border-ink bg-card p-6 doodle-shadow relative"
            style={{ borderRadius: "24px 30px 22px 28px" }}
          >
            <button
              type="button"
              onClick={() => {
                setShowPwdModal(false);
                setPwdStatus(null);
                setPwdStep(1);
              }}
              className="absolute right-4 top-4 rounded-full border-2 border-ink p-1 hover:bg-muted"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <KeyRound className="h-6 w-6 text-coral" />
              <h3 className="font-display text-xl font-bold">Admin Passcode & Account</h3>
            </div>

            {pwdStatus && (
              <div
                className={`mb-4 rounded-xl border-2 border-ink p-3 text-xs font-semibold ${
                  pwdStatus.type === "success" ? "bg-mint/40 text-ink" : "bg-coral/20 text-coral-foreground"
                }`}
              >
                {pwdStatus.text}
              </div>
            )}

            {pwdStep === 1 ? (
              <form onSubmit={handleRequestOTP} className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Enter your admin email below to receive a 6-digit OTP authentication code to change your passcode.
                </p>
                <div>
                  <label className="block text-xs font-bold mb-1">Admin Email Address</label>
                  <input
                    type="email"
                    required
                    value={adminEmailInput}
                    onChange={(e) => setAdminEmailInput(e.target.value)}
                    placeholder="e.g. admin@asp0705dev.com"
                    className="w-full rounded-xl border-2 border-ink bg-background p-2.5 text-sm outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-sun py-2.5 text-sm font-bold doodle-shadow-sm hover:bg-sun/80 disabled:opacity-50"
                >
                  {pwdLoading ? "Sending OTP..." : "Send OTP via Email"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndUpdatePassword} className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Enter the 6-digit OTP code sent to <strong>{adminEmailInput}</strong> and your new admin passcode.
                </p>
                <div>
                  <label className="block text-xs font-bold mb-1">6-Digit OTP Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="123456"
                    className="w-full rounded-xl border-2 border-ink bg-background p-2.5 text-center font-mono text-lg tracking-widest outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">New Admin Passcode</label>
                  <input
                    type="password"
                    required
                    minLength={4}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new passcode"
                    className="w-full rounded-xl border-2 border-ink bg-background p-2.5 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Confirm New Passcode</label>
                  <input
                    type="password"
                    required
                    minLength={4}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new passcode"
                    className="w-full rounded-xl border-2 border-ink bg-background p-2.5 text-sm outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setPwdStep(1)}
                    className="w-1/3 rounded-xl border-2 border-ink bg-card py-2.5 text-xs font-bold hover:bg-muted"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={pwdLoading}
                    className="w-2/3 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-mint py-2.5 text-sm font-bold doodle-shadow-sm hover:bg-mint/80 disabled:opacity-50"
                  >
                    {pwdLoading ? "Verifying..." : "Update Passcode"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <AdminFooter />
    </>
  );
}

function StatCard({ title, value, badge, tint }: { title: string; value: string; badge: string; tint: string }) {
  return (
    <div className={`border-2 border-ink p-5 doodle-shadow rounded-2xl ${tint}`}>
      <div className="text-xs font-bold uppercase tracking-wider opacity-70">{title}</div>
      <div className="mt-2 font-display text-3xl font-bold">{value}</div>
      <span className="mt-2 inline-block rounded-md border border-ink bg-background/80 px-2 py-0.5 font-mono text-[10px] font-bold">
        {badge}
      </span>
    </div>
  );
}

function AdminFooter() {
  return (
    <footer className="border-t-2 border-ink bg-card/80 py-6 text-center text-xs font-semibold text-muted-foreground">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-2 px-5">
        <div className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> ASP0705DEV Protected CMS Portal &amp; Analytics System</div>
        <div>© {new Date().getFullYear()} ASP0705DEV. All rights reserved.</div>
      </div>
    </footer>
  );
}
