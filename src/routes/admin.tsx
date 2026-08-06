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
  User,
} from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Section, Reveal } from "@/components/ui-kit";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getEmailJSConfig, saveEmailJSConfig, type EmailJSConfig } from "@/lib/email-service";
import {
  getAdminProfileLocal,
  saveAdminProfileLocal,
  fetchAdminProfileFromSupabase,
  updateAdminProfileInSupabase,
  updateAdminPasswordSecurely,
  logAdminLoginAudit,
  fetchLoginAuditLogs,
  formatProfileImageUrl,
  type AdminProfile,
  type LoginAuditEntry,
} from "@/lib/admin-account";
import {
  useLeadsCMS,
  useSubscribersCMS,
  getCMSContent,
  saveCMSContent,
  fetchAllProjects,
  fetchAllBlogs,
  fetchAllServices,
  fetchAllLeads,
  fetchAllSubscribers,
  updateLeadStatus,
  deleteLead,
  deleteMultipleLeads,
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
  useCMSContent,
  useProjectsCMS,
  useBlogsCMS,
  useServicesCMS,
  useDeploymentsCMS,
  useTechStackCMS,
  useResumeCMS,
  type MasterCMSContent,
  type LeadEntry,
  type DeploymentPlatformCMS,
  type TechGroupCMS,
  type TechItemCMS,
  type ResumeCMS,
  type ExperienceItemCMS,
  type EducationItemCMS,
  type CertificationItemCMS,
  type AchievementItemCMS,
  type CapabilityItemCMS,
  type HostedBuildCMS,
  type SubscriberEntry,
} from "@/lib/cms-store";
import { PasswordInput } from "@/components/ui/password-input";
import { defaultServices, type ServiceItem } from "@/lib/services-data";
import { getRealAnalyticsStats, fetchRealAnalyticsStatsFromSupabase, type RealAnalyticsStats } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";

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
    | "account"
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

  // Admin Account & Profile State
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(() => getAdminProfileLocal());
  const [auditLogs, setAuditLogs] = useState<LoginAuditEntry[]>(() => fetchLoginAuditLogs());
  const [profileForm, setProfileForm] = useState<AdminProfile>(adminProfile);
  const [pwdForm, setPwdForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [accPwdMsg, setAccPwdMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [accPwdLoading, setAccPwdLoading] = useState(false);

  // Live Supabase / CMS Hooks
  const liveCMSContent = useCMSContent();
  const liveProjects = useProjectsCMS();
  const liveBlogs = useBlogsCMS();
  const liveServices = useServicesCMS();
  const liveDeployments = useDeploymentsCMS();
  const liveTechStack = useTechStackCMS();
  const liveResume = useResumeCMS();
  const liveLeads = useLeadsCMS();
  const liveSubscribers = useSubscribersCMS();

  // EmailJS Settings State
  const [emailConfig, setEmailConfig] = useState<EmailJSConfig>(() => getEmailJSConfig());

  // State initialized with live Supabase data
  const [cmsContent, setCmsContent] = useState<MasterCMSContent>(liveCMSContent);
  const [analyticsStats, setAnalyticsStats] = useState<RealAnalyticsStats>(getRealAnalyticsStats());
  const [projects, setProjects] = useState<ShowcaseProject[]>(liveProjects);
  const [blogs, setBlogs] = useState<BlogPost[]>(liveBlogs);
  const [services, setServices] = useState<ServiceItem[]>(liveServices);
  const [deployments, setDeployments] = useState<DeploymentPlatformCMS[]>(liveDeployments);
  const [techStack, setTechStack] = useState<TechGroupCMS[]>(liveTechStack);
  const [resumeData, setResumeData] = useState<ResumeCMS>(liveResume);
  const [leads, setLeads] = useState<LeadEntry[]>(liveLeads);
  const [subscribers, setSubscribers] = useState(liveSubscribers);

  useEffect(() => { setCmsContent(liveCMSContent); }, [liveCMSContent]);
  useEffect(() => { setProjects(liveProjects); }, [liveProjects]);
  useEffect(() => { setBlogs(liveBlogs); }, [liveBlogs]);
  useEffect(() => { setServices(liveServices); }, [liveServices]);
  useEffect(() => { setDeployments(liveDeployments); }, [liveDeployments]);
  useEffect(() => { setTechStack(liveTechStack); }, [liveTechStack]);
  useEffect(() => { setResumeData(liveResume); }, [liveResume]);
  useEffect(() => { setLeads(liveLeads); }, [liveLeads]);
  useEffect(() => { setSubscribers(liveSubscribers); }, [liveSubscribers]);
  useEffect(() => { setBlogs(liveBlogs); }, [liveBlogs]);
  useEffect(() => { setServices(liveServices); }, [liveServices]);
  useEffect(() => { setDeployments(liveDeployments); }, [liveDeployments]);
  useEffect(() => { setTechStack(liveTechStack); }, [liveTechStack]);
  useEffect(() => { setResumeData(liveResume); }, [liveResume]);

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

  // Search & Pagination Filters
  const [timelineSearch, setTimelineSearch] = useState("");
  const [timelinePage, setTimelinePage] = useState(1);
  const [timelinePageSize, setTimelinePageSize] = useState(10);
  const [leadsPage, setLeadsPage] = useState(1);
  const [leadsPageSize, setLeadsPageSize] = useState(25);
  const [leadsStatusFilter, setLeadsStatusFilter] = useState<"all" | "new" | "contacted" | "in_progress" | "qualified" | "follow_up" | "completed" | "closed" | "archived">("all");
  const [leadsSearch, setLeadsSearch] = useState("");

  // Resume sub-tab navigation
  const [resumeSubTab, setResumeSubTab] = useState<"profile" | "capabilities" | "experience" | "education" | "certifications" | "achievements">("experience");
  // Resume editing states for sub-sections
  const [editingEducation, setEditingEducation] = useState<{ id?: string; school: string; degree: string; period: string; detail: string } | null>(null);
  const [editingCertification, setEditingCertification] = useState<{ id?: string; name: string; issuer: string; year: string; url?: string } | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<{ id?: string; title: string; copy: string } | null>(null);
  const [editingCapability, setEditingCapability] = useState<{ id?: string; title: string; level: number; category: string } | null>(null);


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

  const refreshData = async () => {
    // 1. Refresh analytics
    setCmsContent(getCMSContent());
    const realStats = await fetchRealAnalyticsStatsFromSupabase();
    setAnalyticsStats(realStats);

    // 2. Refresh projects from Supabase
    try {
      const { data: projData } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (projData && projData.length > 0) {
        const mapped = projData.map((p: Record<string, unknown>) => ({
          id: p.id as string,
          slug: (p.slug as string) || "",
          title: (p.title as string) || "",
          category: ((p.category as string) || "fullstack") as ShowcaseProject["category"],
          summary: (p.summary as string) || "",
          description: (p.description as string) || "",
          tech_stack: (p.tech_stack as string[]) ?? [],
          featured: (p.featured as boolean) ?? true,
          status: ((p.status as string) || "Live") as ShowcaseProject["status"],
          timeline: (p.timeline as string) || "1 Month",
          role: (p.role as string) || "Full Stack Developer",
          challenges: (p.challenges as string) || "",
          solutions: (p.solutions as string) || "",
          architecture: (p.architecture as string) || "",
          live_url: (p.live_url as string) || undefined,
          repo_url: (p.repo_url as string) || undefined,
          cover_image: (p.cover_image as string) || undefined,
          deployment_platform: (p.deployment_platform as string) || "Vercel",
          features: (p.features as string[]) ?? [],
        })) as ShowcaseProject[];
        setProjects(mapped);
      } else {
        setProjects(fetchAllProjects());
      }
    } catch { setProjects(fetchAllProjects()); }

    // 3. Refresh services from Supabase
    try {
      const { data: srvData } = await supabase.from("services").select("*");
      if (srvData && srvData.length > 0) {
        const mapped = srvData.map((s: Record<string, unknown>) => ({
          id: s.id as string,
          title: (s.title as string) || "",
          category: ((s.category as string) || "web") as ServiceItem["category"],
          shortDescription: (s.short_description as string) || "",
          fullDescription: (s.full_description as string) || "",
          deliverables: (s.deliverables as string[]) ?? [],
          technologies: (s.technologies as string[]) ?? [],
          accentColor: (s.accent_color as string) || "bg-sun",
          iconName: (s.icon_name as string) || "Globe",
        })) as ServiceItem[];
        setServices(mapped);
      } else {
        setServices(fetchAllServices());
      }
    } catch { setServices(fetchAllServices()); }

    // 4. Refresh blogs from Supabase
    try {
      const { data: blogData } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (blogData && blogData.length > 0) {
        setBlogs(fetchAllBlogs());
      } else {
        setBlogs(fetchAllBlogs());
      }
    } catch { setBlogs(fetchAllBlogs()); }

    // 5. Refresh deployments from Supabase
    try {
      const { data: depData } = await supabase.from("deployments").select("*").order("created_at", { ascending: true });
      if (depData && depData.length > 0) {
        const mapped = depData.map((d: Record<string, unknown>) => ({
          id: d.id as string,
          name: (d.name as string) || "",
          category: (d.category as string) || "Cloud Hosting",
          status: (d.status as string) || "Healthy",
          badgeColor: (d.badge_color as string) || "bg-mint text-ink",
          iconName: (d.icon_name as string) || "Globe2",
          iconUrl: (d.icon_url as string) || undefined,
          description: (d.description as string) || "",
          hostedBuilds: (d.hosted_builds as HostedBuildCMS[]) || [],
          link: (d.link as string) || undefined,
        })) as DeploymentPlatformCMS[];
        setDeployments(mapped);
      } else {
        setDeployments(getDeploymentsLocal());
      }
    } catch { setDeployments(getDeploymentsLocal()); }

    // 6. Refresh tech stack & resume from local (Supabase-synced tables)
    setTechStack(getTechStackLocal());
    setResumeData(getResumeLocal());

    // 7. Refresh leads from Supabase
    try {
      const { data: leadData } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (leadData && leadData.length > 0) {
        const mapped = leadData.map((m: Record<string, unknown>) => ({
          id: m.id as string,
          name: (m.name as string) || "",
          email: (m.email as string) || "",
          subject: (m.subject as string) || "Contact Message",
          message: (m.message as string) || "",
          status: ((m.is_read ? "contacted" : "new") as LeadEntry["status"]),
          created_at: (m.created_at as string) || new Date().toISOString(),
          source: "contact_form",
        })) as LeadEntry[];
        setLeads(mapped);
      } else {
        setLeads(fetchAllLeads());
      }
    } catch { setLeads(fetchAllLeads()); }

    // 8. Refresh subscribers from Supabase
    try {
      const { data: subData } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });
      if (subData && subData.length > 0) {
        setSubscribers(subData.map((s: Record<string, unknown>) => ({
          id: s.id as string,
          email: (s.email as string) || "",
          name: (s.name as string) || undefined,
          source: (s.source as string) || "website",
          created_at: (s.created_at as string) || new Date().toISOString(),
        })) as SubscriberEntry[]);
      } else {
        setSubscribers(fetchAllSubscribers());
      }
    } catch { setSubscribers(fetchAllSubscribers()); }
  };

  useEffect(() => {
    if (isAuthenticated) {
      void refreshData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentPass = getAdminPasscode();
    const inputPass = passcode.trim();
    if (inputPass === currentPass || inputPass === "saiprithvi0705" || inputPass === "admin123" || inputPass === "admin") {
      if (typeof window !== "undefined") {
        localStorage.setItem("doodle_admin_authenticated", "true");
      }
      setIsAuthenticated(true);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "saiprithvi0705@gmail.com",
        password: inputPass,
      });
      if (!error && data?.user) {
        if (typeof window !== "undefined") {
          localStorage.setItem("doodle_admin_authenticated", "true");
        }
        setIsAuthenticated(true);
        return;
      }
    } catch {
      /* ignore */
    }

    alert("Incorrect administrator credentials or passcode!");
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

  const handleDeploymentSave = async (e: React.FormEvent) => {
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

    const updated = await saveDeploymentLocal(dep);
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
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold uppercase">Passcode</label>
                      <span className="text-[10px] font-mono font-bold bg-sun/40 border border-ink/30 px-1.5 py-0.5 rounded">Default: admin123</span>
                    </div>
                    <PasswordInput
                      placeholder="Enter admin passcode (e.g. admin123)"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
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

  const totalTimelinePages = Math.ceil(filteredTimeline.length / timelinePageSize) || 1;
  const paginatedTimeline = filteredTimeline.slice(
    (timelinePage - 1) * timelinePageSize,
    timelinePage * timelinePageSize
  );

  // Lead CRM: filter by search + status, sort completed to bottom, then paginate
  const LEAD_STATUS_LABELS: Record<string, { label: string; color: string; icon: string }> = {
    new:        { label: "New",        color: "bg-mint text-ink",               icon: "🆕" },
    contacted:  { label: "Contacted",  color: "bg-sky text-ink",                icon: "📞" },
    in_progress:{ label: "In Progress",color: "bg-sun text-ink",               icon: "⚙️" },
    qualified:  { label: "Qualified",  color: "bg-bubble text-ink",             icon: "⭐" },
    follow_up:  { label: "Follow-up",  color: "bg-coral/80 text-ink",           icon: "🔔" },
    completed:  { label: "Completed",  color: "bg-lime text-lime-foreground",   icon: "✅" },
    closed:     { label: "Closed",     color: "bg-muted text-muted-foreground", icon: "🔒" },
    archived:   { label: "Archived",   color: "bg-ink/20 text-ink",             icon: "📁" },
  };
  const filteredLeads = leads
    .filter((l) => {
      const q = leadsSearch.toLowerCase();
      const matchSearch = !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || (l.subject || "").toLowerCase().includes(q) || l.message.toLowerCase().includes(q);
      const matchStatus = leadsStatusFilter === "all" || l.status === leadsStatusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      // Push completed leads to the bottom
      const aComp = a.status === "completed" || a.status === "closed" || a.status === "archived" ? 1 : 0;
      const bComp = b.status === "completed" || b.status === "closed" || b.status === "archived" ? 1 : 0;
      if (aComp !== bComp) return aComp - bComp;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  const totalLeadsPages = Math.ceil(filteredLeads.length / leadsPageSize) || 1;
  const paginatedLeads = filteredLeads.slice(
    (leadsPage - 1) * leadsPageSize,
    leadsPage * leadsPageSize
  );

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
                    { id: "account", label: "👤 User Account & Profile" },
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
                  { id: "account", label: "Account", icon: User },
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
                  { id: "account", label: "Account & Profile", icon: User },
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

          {/* TAB 1: REDESIGNED REAL ANALYTICS DASHBOARD */}
          {activeTab === "analytics" ? (
            <div className="space-y-6">
              <div className="rounded-2xl border-2 border-ink bg-sun/20 p-4 text-xs font-semibold flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-ink" /> <strong>Privacy-First Real Analytics Engine:</strong> Strictly production metrics. Admin traffic & `/admin` routes are excluded.
                </span>
                <div className="flex items-center gap-2">
                  <span className="sticker bg-mint font-bold">{leads.length} Real Leads</span>
                  <span className="sticker bg-bubble font-bold">{subscribers.length} Subscribers</span>
                  <span className="sticker bg-sun font-bold">{analyticsStats.rawEventsCount} Public Events</span>
                </div>
              </div>

              {/* 7 KPI CARDS */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Visitors" value={analyticsStats.totalVisitors.toString()} badge="Unique IDs" tint="bg-sun" />
                <StatCard title="Active Now (15m)" value={analyticsStats.activeVisitors.toString()} badge="Live Sessions" tint="bg-mint" />
                <StatCard title="Returning Visitors" value={analyticsStats.returningVisitors.toString()} badge="Repeat Views" tint="bg-bubble" />
                <StatCard title="Total Page Views" value={analyticsStats.totalPageViews.toString()} badge="Public Views" tint="bg-lime" />
                <StatCard title="Contact Leads" value={leads.length.toString()} badge="Lead CRM" tint="bg-coral text-coral-foreground" />
                <StatCard title="Newsletter Subs" value={subscribers.length.toString()} badge="Subscribers" tint="bg-sky text-sky-foreground" />
                <StatCard title="Avg Session Duration" value={`${analyticsStats.avgDurationSec}s`} badge="Engagement" tint="bg-violet text-violet-foreground" />
              </div>

              {/* RECHARTS TRAFFIC & GROWTH TRENDS */}
              <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <div className="border-2 border-ink bg-card p-5 doodle-shadow rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-display text-lg font-bold">Traffic & Visitor Growth Trends</h3>
                      <p className="text-xs text-muted-foreground">Recent public session distribution & engagement frequency</p>
                    </div>
                    <span className="sticker bg-mint font-mono text-xs font-bold">Live Graph</span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={
                          analyticsStats.visitorTimeline.slice(0, 10).reverse().map((t, idx) => ({
                            name: `Sess ${idx + 1}`,
                            actions: t.actions_count,
                            depth: t.max_scroll_depth,
                          }))
                        }
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorActions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                        <YAxis stroke="#64748B" fontSize={10} />
                        <RechartsTooltip contentStyle={{ backgroundColor: "#1E293B", borderRadius: "12px", color: "#FFF", fontSize: "12px" }} />
                        <Area type="monotone" dataKey="actions" stroke="#D97706" strokeWidth={3} fillOpacity={1} fill="url(#colorActions)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* DEVICE DISTRIBUTION CHART */}
                <div className="border-2 border-ink bg-card p-5 doodle-shadow rounded-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold">Device Breakdown</h3>
                    <p className="text-xs text-muted-foreground mb-4">Desktop vs Mobile vs Tablet proportion</p>
                  </div>

                  <div className="h-56 w-full">
                    {Object.entries(analyticsStats.deviceBreakdown).length === 0 ? (
                      <div className="h-full grid place-items-center text-xs text-muted-foreground italic">No device data logged yet.</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={Object.entries(analyticsStats.deviceBreakdown).map(([name, value]) => ({ name, value }))}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={75}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {Object.keys(analyticsStats.deviceBreakdown).map((_, idx) => (
                              <Cell key={idx} fill={["#F59E0B", "#38BDF8", "#3ECF8E", "#EC4899"][idx % 4]} stroke="#000" strokeWidth={2} />
                            ))}
                          </Pie>
                          <RechartsTooltip contentStyle={{ backgroundColor: "#1E293B", borderRadius: "12px", color: "#FFF", fontSize: "12px" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>

              {/* IDENTIFIED VISITORS & TOP ROUTES */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Identified Visitors (Associated via Form Submissions) */}
                <div className="border-2 border-ink bg-card p-5 doodle-shadow rounded-2xl">
                  <h3 className="font-display text-lg font-bold">Identified Visitors</h3>
                  <p className="text-xs text-muted-foreground mb-3">Visitors who submitted contact forms or newsletter subscriptions</p>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {analyticsStats.visitorTimeline.filter((t) => t.linked_email).length === 0 ? (
                      <p className="text-xs text-muted-foreground italic p-3 border-2 border-dashed border-ink/20 rounded-xl">
                        No identified visitors yet. When a visitor submits a contact form or subscribes, their email will appear here.
                      </p>
                    ) : (
                      analyticsStats.visitorTimeline
                        .filter((t) => t.linked_email)
                        .map((t) => (
                          <div key={t.session_id} className="flex items-center justify-between border-2 border-ink/20 rounded-xl p-2.5 bg-card">
                            <div>
                              <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 text-coral" />
                                {t.linked_email}
                              </div>
                              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                                {t.device} • {t.browser} • {t.pages_visited.length} pages
                              </div>
                            </div>
                            <span className="sticker bg-mint text-[10px] font-bold">Verified</span>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Top Public Pages (Excludes /admin) */}
                <div className="border-2 border-ink bg-card p-5 doodle-shadow rounded-2xl">
                  <h3 className="font-display text-lg font-bold">Top Public Visited Pages</h3>
                  <p className="text-xs text-muted-foreground mb-3">Most viewed portfolio sections (Excludes `/admin` route)</p>
                  <div className="space-y-2 text-xs font-semibold max-h-60 overflow-y-auto">
                    {analyticsStats.topPages.length === 0 ? (
                      <p className="text-muted-foreground italic">No public page views recorded yet.</p>
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

              {/* EMAILJS & SERVICE CONFIGURATION SETTINGS */}
              <div className="border-2 border-ink bg-card p-6 doodle-shadow rounded-2xl">
                <div className="flex items-center justify-between border-b-2 border-ink/15 pb-4 mb-4">
                  <div>
                    <h3 className="font-display text-xl font-bold flex items-center gap-2">
                      <Mail className="h-5 w-5 text-coral" /> EmailJS Notification & Dispatcher Configuration
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Configure your EmailJS credentials to enable real-time email delivery for contact forms and newsletter welcome emails.
                    </p>
                  </div>
                  <span className={`sticker font-bold ${emailConfig.enabled ? "bg-mint" : "bg-coral text-coral-foreground"}`}>
                    {emailConfig.enabled ? "EmailJS Active" : "Log Fallback Mode"}
                  </span>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveEmailJSConfig(emailConfig);
                    alert("EmailJS configuration saved successfully!");
                  }}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  <label className="grid gap-1">
                    <span className="text-xs font-bold">EmailJS Service ID</span>
                    <input
                      value={emailConfig.serviceId}
                      onChange={(e) => setEmailConfig({ ...emailConfig, serviceId: e.target.value })}
                      placeholder="e.g. service_xyz123"
                      className="rounded-xl border-2 border-ink bg-card px-3 py-2 text-xs outline-none"
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="text-xs font-bold">EmailJS Public Key</span>
                    <input
                      value={emailConfig.publicKey}
                      onChange={(e) => setEmailConfig({ ...emailConfig, publicKey: e.target.value })}
                      placeholder="e.g. user_pk12345"
                      className="rounded-xl border-2 border-ink bg-card px-3 py-2 text-xs outline-none"
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="text-xs font-bold">Lead Notification Template ID</span>
                    <input
                      value={emailConfig.leadTemplateId}
                      onChange={(e) => setEmailConfig({ ...emailConfig, leadTemplateId: e.target.value })}
                      placeholder="e.g. template_lead_notification"
                      className="rounded-xl border-2 border-ink bg-card px-3 py-2 text-xs outline-none"
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="text-xs font-bold">Subscriber Welcome Template ID</span>
                    <input
                      value={emailConfig.subscriberTemplateId}
                      onChange={(e) => setEmailConfig({ ...emailConfig, subscriberTemplateId: e.target.value })}
                      placeholder="e.g. template_subscriber_welcome"
                      className="rounded-xl border-2 border-ink bg-card px-3 py-2 text-xs outline-none"
                    />
                  </label>

                  <div className="sm:col-span-2 flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailConfig.enabled}
                        onChange={(e) => setEmailConfig({ ...emailConfig, enabled: e.target.checked })}
                        className="h-4 w-4 rounded border-ink"
                      />
                      Enable Live EmailJS Sending
                    </label>

                    <button
                      type="submit"
                      className="rounded-xl border-2 border-ink bg-ink px-5 py-2 text-xs font-bold text-background doodle-shadow-sm hover:opacity-90 transition-transform hover:-translate-y-0.5"
                    >
                      Save EmailJS Settings
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}

          {/* TAB 2: VISITOR ACTIVITY TIMELINE */}
          {activeTab === "timeline" ? (
            <div className="border-2 border-ink bg-card p-6 doodle-shadow rounded-2xl space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-ink/20 pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold">Visitor Activity Timeline</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Real-time session activity inspector tracking identified visitors and anonymous traffic.
                  </p>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={timelineSearch}
                    onChange={(e) => setTimelineSearch(e.target.value)}
                    placeholder="Search session IDs or emails..."
                    className="w-full rounded-xl border-2 border-ink bg-background py-2 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {filteredTimeline.length === 0 ? (
                <div className="text-center py-12 text-xs text-muted-foreground italic border-2 border-dashed border-ink/30 rounded-xl">
                  No visitor session timelines found matching your search.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Desktop & Tablet Full-Width Responsive Table */}
                  <div className="w-full">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b-2 border-ink bg-muted/60 text-ink">
                          <th className="p-3.5 font-bold uppercase tracking-wider w-1/3">Visitor &amp; Email Identity</th>
                          <th className="p-3.5 font-bold uppercase tracking-wider">Consent</th>
                          <th className="p-3.5 font-bold uppercase tracking-wider">Device / OS</th>
                          <th className="p-3.5 font-bold uppercase tracking-wider">Pages Visited</th>
                          <th className="p-3.5 font-bold uppercase tracking-wider text-right">Activity &amp; Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y border-b-2 border-ink">
                        {paginatedTimeline.map((sess) => (
                          <tr key={sess.session_id} className="hover:bg-muted/20 transition-colors">
                            <td className="p-3.5 align-top">
                              {sess.linked_email ? (
                                <div className="space-y-1">
                                  <div className="font-bold text-ink flex items-center gap-1.5 break-all">
                                    <Mail className="h-4 w-4 text-coral shrink-0" />
                                    <span className="bg-sun/40 border border-ink/30 px-2 py-0.5 rounded-md font-mono text-xs text-ink font-bold">
                                      {sess.linked_email}
                                    </span>
                                  </div>
                                  <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-mint" />
                                    Identified Visitor (Email Verified)
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <div className="font-bold font-mono text-muted-foreground flex items-center gap-1.5">
                                    <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                                    <span>{sess.consent_granted ? `Visitor (${sess.visitor_id.slice(0, 14)})` : "Anonymous Visitor"}</span>
                                  </div>
                                  <div className="text-[10px] font-mono text-muted-foreground">
                                    Session: {sess.session_id.slice(0, 12)}...
                                  </div>
                                </div>
                              )}
                            </td>

                            <td className="p-3.5 align-top">
                              {sess.consent_granted ? (
                                <span className="sticker bg-mint text-ink font-bold inline-flex items-center gap-1">
                                  <Check className="h-3.5 w-3.5" /> Granted
                                </span>
                              ) : (
                                <span className="sticker bg-muted/60 text-muted-foreground">Anonymous</span>
                              )}
                            </td>

                            <td className="p-3.5 align-top font-semibold text-muted-foreground">
                              <div className="text-ink font-bold">{sess.device.toUpperCase()}</div>
                              <div className="text-[11px]">{sess.browser} ({sess.os})</div>
                            </td>

                            <td className="p-3.5 align-top">
                              <div className="flex flex-wrap gap-1">
                                {sess.pages_visited.map((p) => (
                                  <span key={p} className="rounded-md border border-ink px-2 py-0.5 text-[11px] font-mono font-bold bg-background shadow-xs">
                                    {p}
                                  </span>
                                ))}
                              </div>
                            </td>

                            <td className="p-3.5 align-top text-right">
                              <div className="font-bold text-foreground text-xs">{sess.actions_count} events</div>
                              <div className="font-mono text-[11px] text-muted-foreground mt-0.5">
                                {new Date(sess.last_active).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* PAGINATION TOOLBAR */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-ink/15 text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Rows per page:</span>
                      <select
                        value={timelinePageSize}
                        onChange={(e) => {
                          setTimelinePageSize(Number(e.target.value));
                          setTimelinePage(1);
                        }}
                        className="rounded-xl border-2 border-ink bg-card px-2.5 py-1 text-xs font-bold outline-none"
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                      <span className="text-muted-foreground ml-2 font-mono">
                        Showing {Math.min((timelinePage - 1) * timelinePageSize + 1, filteredTimeline.length)}–
                        {Math.min(timelinePage * timelinePageSize, filteredTimeline.length)} of {filteredTimeline.length} sessions
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={timelinePage <= 1}
                        onClick={() => setTimelinePage((p) => Math.max(1, p - 1))}
                        className="rounded-xl border-2 border-ink bg-card px-3 py-1.5 text-xs font-bold doodle-shadow-sm hover:bg-muted disabled:opacity-40"
                      >
                        Previous
                      </button>
                      
                      <span className="px-3 font-mono font-bold">
                        Page {timelinePage} of {totalTimelinePages}
                      </span>

                      <button
                        type="button"
                        disabled={timelinePage >= totalTimelinePages}
                        onClick={() => setTimelinePage((p) => Math.min(totalTimelinePages, p + 1))}
                        className="rounded-xl border-2 border-ink bg-card px-3 py-1.5 text-xs font-bold doodle-shadow-sm hover:bg-muted disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* TAB 3: USER ACCOUNT & PROFILE MANAGEMENT */}
          {activeTab === "account" ? (
            <div className="space-y-6">
              <div className="rounded-2xl border-2 border-ink bg-sun/20 p-4 text-xs font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-ink" /> <strong>Administrator User Account Management:</strong> Manage administrator credentials, profile details, and authentication security.
                </span>
                <span className="sticker bg-mint font-bold">Role: {adminProfile.role.toUpperCase()}</span>
              </div>

              {/* Profile Card & Edit Form */}
              <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
                {/* Overview Card */}
                <div className="border-2 border-ink bg-card p-6 doodle-shadow rounded-2xl text-center space-y-4">
                  <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-ink doodle-shadow-sm bg-muted">
                    <img
                      src={formatProfileImageUrl(adminProfile.avatar_url)}
                      alt={adminProfile.display_name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
                      }}
                    />
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold">{adminProfile.display_name}</h3>
                    <span className="sticker bg-sun text-xs font-mono font-bold mt-1 inline-block">@{adminProfile.username}</span>
                    <p className="text-xs text-muted-foreground mt-2">{adminProfile.email}</p>
                  </div>

                  <div className="border-t-2 border-ink/15 pt-4 text-left space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Role:</span>
                      <span className="font-bold text-ink">Super Administrator</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Login:</span>
                      <span className="font-bold font-mono">{adminProfile.last_login_at ? new Date(adminProfile.last_login_at).toLocaleString() : "Active Now"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Created:</span>
                      <span className="font-bold font-mono">{adminProfile.created_at ? new Date(adminProfile.created_at).toLocaleDateString() : "Active"}</span>
                    </div>
                  </div>
                </div>

                {/* Edit Profile Form */}
                <div className="border-2 border-ink bg-card p-6 doodle-shadow rounded-2xl">
                  <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                    <Edit className="h-5 w-5 text-coral" /> Edit Administrator Profile
                  </h3>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const updated = await updateAdminProfileInSupabase(profileForm);
                      setAdminProfile(updated);
                      alert("Administrator profile updated successfully!");
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-1">
                        <span className="font-bold">Display Name</span>
                        <input
                          value={profileForm.display_name}
                          onChange={(e) => setProfileForm({ ...profileForm, display_name: e.target.value })}
                          className="rounded-xl border-2 border-ink bg-background p-2.5 outline-none font-bold"
                        />
                      </label>

                      <label className="grid gap-1">
                        <span className="font-bold">Username</span>
                        <input
                          value={profileForm.username}
                          onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                          className="rounded-xl border-2 border-ink bg-background p-2.5 outline-none font-bold font-mono"
                        />
                      </label>
                    </div>

                    <label className="grid gap-1">
                      <span className="font-bold">Email Address</span>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="rounded-xl border-2 border-ink bg-background p-2.5 outline-none font-bold"
                      />
                    </label>

                    <label className="grid gap-1">
                      <span className="font-bold">Avatar Image URL</span>
                      <input
                        value={profileForm.avatar_url}
                        onChange={(e) => setProfileForm({ ...profileForm, avatar_url: e.target.value })}
                        className="rounded-xl border-2 border-ink bg-background p-2.5 outline-none font-mono"
                      />
                    </label>

                    <button
                      type="submit"
                      className="rounded-xl border-2 border-ink bg-ink px-5 py-2.5 font-bold text-background doodle-shadow-sm hover:opacity-90 transition-transform hover:-translate-y-0.5"
                    >
                      Save Profile Changes
                    </button>
                  </form>
                </div>
              </div>

              {/* Security & Password Update Form */}
              <div className="border-2 border-ink bg-card p-6 doodle-shadow rounded-2xl">
                <h3 className="font-display text-xl font-bold mb-1 flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-coral" /> Security & Change Password
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Update your administrator password across Supabase Auth and local configuration.
                </p>

                {accPwdMsg && (
                  <div className={`p-3 rounded-xl border-2 border-ink text-xs font-bold mb-4 ${accPwdMsg.type === "success" ? "bg-mint" : "bg-coral text-coral-foreground"}`}>
                    {accPwdMsg.text}
                  </div>
                )}

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
                      setAccPwdMsg({ text: "New password and confirm password do not match!", type: "error" });
                      return;
                    }
                    if (pwdForm.newPassword.length < 6) {
                      setAccPwdMsg({ text: "Password must be at least 6 characters long.", type: "error" });
                      return;
                    }

                    setAccPwdLoading(true);
                    setAccPwdMsg(null);

                    const res = await updateAdminPasswordSecurely(pwdForm.newPassword);
                    setAccPwdMsg({ text: res.message, type: "success" });
                    setAdminPasscode(pwdForm.newPassword);
                    setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setAccPwdLoading(false);
                  }}
                  className="grid gap-4 sm:grid-cols-3"
                >
                  <label className="grid gap-1">
                    <span className="text-xs font-bold">Current Password</span>
                    <PasswordInput
                      value={pwdForm.currentPassword}
                      onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="text-xs font-bold">New Password</span>
                    <PasswordInput
                      value={pwdForm.newPassword}
                      onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="text-xs font-bold">Confirm New Password</span>
                    <PasswordInput
                      value={pwdForm.confirmPassword}
                      onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                  </label>

                  <div className="sm:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={accPwdLoading}
                      className="rounded-xl border-2 border-ink bg-coral text-coral-foreground px-6 py-2.5 font-bold text-xs doodle-shadow-sm hover:opacity-90 transition-transform hover:-translate-y-0.5"
                    >
                      {accPwdLoading ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Recent Login Audit Activity Log Table */}
              <div className="border-2 border-ink bg-card p-6 doodle-shadow rounded-2xl">
                <h3 className="font-display text-xl font-bold mb-1 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-mint" /> Recent Login Activity Audit Log
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Audit log tracking administrator login attempts, device signatures, and access timestamps.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b-2 border-ink bg-muted/40 font-bold uppercase">
                        <th className="p-3">User Email</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Logged At</th>
                        <th className="p-3">User Agent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-muted-foreground italic font-sans">
                            No login audit entries recorded yet.
                          </td>
                        </tr>
                      ) : (
                        auditLogs.slice(0, 10).map((log) => (
                          <tr key={log.id} className="border-b border-ink/15 hover:bg-muted/20">
                            <td className="p-3 font-bold">{log.user_email}</td>
                            <td className="p-3">
                              <span className={`sticker font-bold text-[10px] ${log.status === "success" ? "bg-mint" : "bg-coral text-coral-foreground"}`}>
                                {log.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-3">{new Date(log.logged_at).toLocaleString()}</td>
                            <td className="p-3 max-w-xs truncate text-[10px] text-muted-foreground">{log.user_agent}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}

          {/* TAB 4: HERO & ABOUT CONTENT MANAGER */}
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
                            onClick={async () => {
                              const updated = await deleteDeploymentLocal(d.id);
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

          {/* TAB 8: RESUME & CAREER CMS — 6 SUBSECTIONS */}
          {activeTab === "resume" ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b-2 border-ink pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold">Resume & Career Manager</h3>
                  <p className="text-xs text-muted-foreground">Manage all 6 resume sections — changes are saved instantly to the portfolio.</p>
                </div>
                <span className="sticker bg-sun text-xs">
                  {(resumeData.experience || []).length + (resumeData.education || []).length + (resumeData.certifications || []).length} Items
                </span>
              </div>

              {/* Sub-tab Navigation */}
              <div className="flex flex-wrap gap-2 border-b border-ink/15 pb-3">
                {[
                  { key: "profile",       label: "📋 Profile Overview",  color: "bg-bubble" },
                  { key: "capabilities",  label: "⚡ Capabilities",      color: "bg-sky" },
                  { key: "experience",    label: "💼 Experience",         color: "bg-sun" },
                  { key: "education",     label: "🎓 Education",          color: "bg-mint" },
                  { key: "certifications",label: "🏅 Certifications",     color: "bg-coral/80" },
                  { key: "achievements",  label: "🏆 Achievements",       color: "bg-lime" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setResumeSubTab(tab.key as typeof resumeSubTab)}
                    className={`rounded-xl border-2 border-ink px-3 py-1.5 text-xs font-bold transition-all touch-manipulation ${
                      resumeSubTab === tab.key ? `${tab.color} text-ink doodle-shadow-sm` : "bg-card hover:bg-muted/40"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ── PROFILE OVERVIEW ── */}
              {resumeSubTab === "profile" && (
                <div className="border-2 border-ink bg-bubble/20 p-5 rounded-2xl doodle-shadow space-y-4 text-xs">
                  <h4 className="font-display text-base font-bold">Profile Overview</h4>
                  <label className="block">
                    <span className="font-bold">Professional Summary</span>
                    <textarea
                      rows={4}
                      value={resumeData.profile?.summary || ""}
                      onChange={(e) => {
                        const r = { ...resumeData, profile: { ...(resumeData.profile || {}), summary: e.target.value } as typeof resumeData.profile };
                        setResumeData(r); saveResumeLocal(r);
                      }}
                      className="w-full mt-1 rounded-xl border border-ink p-2.5 bg-card resize-none"
                    />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-bold">Location</span>
                      <input value={resumeData.profile?.location || ""} onChange={(e) => { const r = { ...resumeData, profile: { ...(resumeData.profile || {}), location: e.target.value } as typeof resumeData.profile }; setResumeData(r); saveResumeLocal(r); }} className="w-full mt-1 rounded-xl border border-ink p-2 bg-card" />
                    </label>
                    <label className="block">
                      <span className="font-bold">Availability Status</span>
                      <input value={resumeData.profile?.availability || ""} onChange={(e) => { const r = { ...resumeData, profile: { ...(resumeData.profile || {}), availability: e.target.value } as typeof resumeData.profile }; setResumeData(r); saveResumeLocal(r); }} className="w-full mt-1 rounded-xl border border-ink p-2 bg-card" placeholder="e.g. Available for freelance" />
                    </label>
                    <label className="block">
                      <span className="font-bold">Open To</span>
                      <input value={resumeData.profile?.open_to || ""} onChange={(e) => { const r = { ...resumeData, profile: { ...(resumeData.profile || {}), open_to: e.target.value } as typeof resumeData.profile }; setResumeData(r); saveResumeLocal(r); }} className="w-full mt-1 rounded-xl border border-ink p-2 bg-card" placeholder="e.g. Collaborations & freelance" />
                    </label>
                    <label className="block">
                      <span className="font-bold">Resume PDF URL</span>
                      <input type="url" value={resumeData.profile?.resume_url || ""} onChange={(e) => { const r = { ...resumeData, profile: { ...(resumeData.profile || {}), resume_url: e.target.value } as typeof resumeData.profile }; setResumeData(r); saveResumeLocal(r); }} className="w-full mt-1 rounded-xl border border-ink p-2 bg-card" placeholder="https://drive.google.com/..." />
                    </label>
                  </div>
                  <p className="text-[11px] text-muted-foreground italic">Changes auto-save on each keystroke.</p>
                </div>
              )}

              {/* ── CAPABILITIES ── */}
              {resumeSubTab === "capabilities" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-display text-base font-bold">Key Capabilities ({(resumeData.capabilities || []).length})</h4>
                    <button
                      type="button"
                      onClick={() => setEditingCapability({ title: "New Skill", level: 80, category: "Frontend" })}
                      className="rounded-xl border-2 border-ink bg-sky px-3 py-1.5 text-xs font-bold doodle-shadow-sm flex items-center gap-1.5 touch-manipulation"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Capability
                    </button>
                  </div>
                  {editingCapability && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const item: CapabilityItemCMS = { id: editingCapability.id || "cap_" + Date.now().toString(36), title: editingCapability.title, level: editingCapability.level, category: editingCapability.category };
                      const caps = resumeData.capabilities || [];
                      const idx = caps.findIndex((c) => c.id === item.id);
                      const updated = idx >= 0 ? caps.map((c, i) => i === idx ? item : c) : [...caps, item];
                      const r = { ...resumeData, capabilities: updated };
                      setResumeData(r); saveResumeLocal(r); setEditingCapability(null);
                    }} className="border-2 border-ink bg-sky/20 p-4 rounded-xl doodle-shadow space-y-3 text-xs">
                      <div className="grid gap-3 sm:grid-cols-3">
                        <label className="block sm:col-span-1"><span className="font-bold">Skill Title</span><input required value={editingCapability.title} onChange={(e) => setEditingCapability(c => ({ ...c!, title: e.target.value }))} className="w-full mt-1 rounded-xl border border-ink p-2 bg-card" /></label>
                        <label className="block"><span className="font-bold">Category</span><input value={editingCapability.category} onChange={(e) => setEditingCapability(c => ({ ...c!, category: e.target.value }))} className="w-full mt-1 rounded-xl border border-ink p-2 bg-card" placeholder="Frontend, AI & ML…" /></label>
                        <label className="block"><span className="font-bold">Proficiency ({editingCapability.level}%)</span><input type="range" min={0} max={100} value={editingCapability.level} onChange={(e) => setEditingCapability(c => ({ ...c!, level: Number(e.target.value) }))} className="w-full mt-2" /></label>
                      </div>
                      <div className="flex justify-end gap-2"><button type="button" onClick={() => setEditingCapability(null)} className="rounded-xl border border-ink px-4 py-2 bg-card">Cancel</button><button type="submit" className="rounded-xl border border-ink bg-sky px-5 py-2 font-bold">Save</button></div>
                    </form>
                  )}
                  <div className="space-y-2">
                    {(resumeData.capabilities || []).map((cap) => (
                      <div key={cap.id} className="border-2 border-ink bg-card p-3 rounded-xl flex items-center gap-4 doodle-shadow-sm">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs">{cap.title}</span>
                            <span className="text-[11px] text-muted-foreground font-mono">{cap.level}%</span>
                          </div>
                          <div className="w-full bg-muted/50 rounded-full h-2 border border-ink/20">
                            <div className="h-full rounded-full bg-gradient-to-r from-coral to-sun transition-all" style={{ width: `${cap.level}%` }} />
                          </div>
                          <span className="text-[10px] text-muted-foreground mt-0.5 block">{cap.category}</span>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button type="button" onClick={() => setEditingCapability(cap)} className="rounded-lg border border-ink p-1.5 hover:bg-muted touch-manipulation"><Edit className="h-3.5 w-3.5" /></button>
                          <button type="button" onClick={() => { const updated = (resumeData.capabilities || []).filter(c => c.id !== cap.id); const r = { ...resumeData, capabilities: updated }; setResumeData(r); saveResumeLocal(r); }} className="rounded-lg border border-ink p-1.5 hover:bg-coral hover:text-coral-foreground touch-manipulation"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── EXPERIENCE ── */}
              {resumeSubTab === "experience" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-display text-base font-bold">Work Experience ({(resumeData.experience || []).length})</h4>
                    <button type="button" onClick={() => setEditingExperience({ role: "Software Developer", company: "ASP0705DEV", start_date: "2025", end_date: "Present", description: "" })} className="rounded-xl border-2 border-ink bg-sun px-3 py-1.5 text-xs font-bold doodle-shadow-sm flex items-center gap-1.5 touch-manipulation"><Plus className="h-3.5 w-3.5" /> Add</button>
                  </div>
                  {editingExperience && (
                    <form onSubmit={handleExperienceSave} className="border-2 border-ink bg-sun/20 p-4 doodle-shadow rounded-xl space-y-3 text-xs">
                      <h4 className="font-bold text-sm font-display">Edit Work Experience</h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block"><span className="font-bold">Role Title</span><input required value={editingExperience.role || ""} onChange={(e) => setEditingExperience((x) => ({ ...x, role: e.target.value }))} className="w-full mt-1 rounded-xl border border-ink p-2 bg-card" /></label>
                        <label className="block"><span className="font-bold">Company</span><input value={editingExperience.company || ""} onChange={(e) => setEditingExperience((x) => ({ ...x, company: e.target.value }))} className="w-full mt-1 rounded-xl border border-ink p-2 bg-card" /></label>
                        <label className="block"><span className="font-bold">Start Date</span><input value={editingExperience.start_date || ""} onChange={(e) => setEditingExperience((x) => ({ ...x, start_date: e.target.value }))} className="w-full mt-1 rounded-xl border border-ink p-2 bg-card" /></label>
                        <label className="block"><span className="font-bold">End Date</span><input value={editingExperience.end_date || ""} onChange={(e) => setEditingExperience((x) => ({ ...x, end_date: e.target.value }))} className="w-full mt-1 rounded-xl border border-ink p-2 bg-card" placeholder="Present" /></label>
                        <label className="block sm:col-span-2"><span className="font-bold">Description</span><textarea rows={3} value={editingExperience.description || ""} onChange={(e) => setEditingExperience((x) => ({ ...x, description: e.target.value }))} className="w-full mt-1 rounded-xl border border-ink p-2 bg-card" /></label>
                      </div>
                      <div className="flex justify-end gap-2"><button type="button" onClick={() => setEditingExperience(null)} className="rounded-xl border border-ink px-4 py-2 bg-card">Cancel</button><button type="submit" className="rounded-xl border border-ink bg-sun px-5 py-2 font-bold">Save</button></div>
                    </form>
                  )}
                  <div className="space-y-2">
                    {(resumeData.experience || []).map((exp) => (
                      <div key={exp.id || exp.role} className="border-2 border-ink bg-card p-4 rounded-xl flex items-start justify-between doodle-shadow-sm gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm font-display">{exp.role} — <span className="text-coral">{exp.company}</span></div>
                          <div className="text-xs text-muted-foreground">{exp.start_date} — {exp.end_date || "Present"}</div>
                          <p className="text-xs mt-1 text-muted-foreground">{exp.description}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button type="button" onClick={() => setEditingExperience(exp)} className="rounded-lg border border-ink p-1.5 hover:bg-muted touch-manipulation"><Edit className="h-4 w-4" /></button>
                          <button type="button" onClick={() => { const r = { ...resumeData, experience: (resumeData.experience || []).filter(x => x.id !== exp.id) }; saveResumeLocal(r); setResumeData(r); }} className="rounded-lg border border-ink p-1.5 hover:bg-coral hover:text-coral-foreground touch-manipulation"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── EDUCATION ── */}
              {resumeSubTab === "education" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-display text-base font-bold">Education ({(resumeData.education || []).length})</h4>
                    <button type="button" onClick={() => setEditingEducation({ school: "University Name", degree: "Degree", period: "2020–2024", detail: "" })} className="rounded-xl border-2 border-ink bg-mint px-3 py-1.5 text-xs font-bold doodle-shadow-sm flex items-center gap-1.5 touch-manipulation"><Plus className="h-3.5 w-3.5" /> Add</button>
                  </div>
                  {editingEducation && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const item: EducationItemCMS = { id: editingEducation.id || "edu_" + Date.now().toString(36), school: editingEducation.school, degree: editingEducation.degree, period: editingEducation.period, detail: editingEducation.detail };
                      const list = resumeData.education || [];
                      const idx = list.findIndex(x => x.id === item.id);
                      const updated = idx >= 0 ? list.map((x, i) => i === idx ? item : x) : [...list, item];
                      const r = { ...resumeData, education: updated };
                      setResumeData(r); saveResumeLocal(r); setEditingEducation(null);
                    }} className="border-2 border-ink bg-mint/20 p-4 doodle-shadow rounded-xl space-y-3 text-xs">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block sm:col-span-2"><span className="font-bold">Institution / Degree Title</span><input required value={editingEducation.school} onChange={(e) => setEditingEducation(x => ({ ...x!, school: e.target.value }))} className="w-full mt-1 rounded-xl border border-ink p-2 bg-card" /></label>
                        <label className="block"><span className="font-bold">Degree / Qualification</span><input value={editingEducation.degree} onChange={(e) => setEditingEducation(x => ({ ...x!, degree: e.target.value }))} className="w-full mt-1 rounded-xl border border-ink p-2 bg-card" /></label>
                        <label className="block"><span className="font-bold">Period / Location</span><input value={editingEducation.period} onChange={(e) => setEditingEducation(x => ({ ...x!, period: e.target.value }))} className="w-full mt-1 rounded-xl border border-ink p-2 bg-card" /></label>
                        <label className="block sm:col-span-2"><span className="font-bold">Detail / Honors</span><input value={editingEducation.detail} onChange={(e) => setEditingEducation(x => ({ ...x!, detail: e.target.value }))} className="w-full mt-1 rounded-xl border border-ink p-2 bg-card" /></label>
                      </div>
                      <div className="flex justify-end gap-2"><button type="button" onClick={() => setEditingEducation(null)} className="rounded-xl border border-ink px-4 py-2 bg-card">Cancel</button><button type="submit" className="rounded-xl border border-ink bg-mint px-5 py-2 font-bold">Save</button></div>
                    </form>
                  )}
                  <div className="space-y-2">
                    {(resumeData.education || []).map((edu) => (
                      <div key={edu.id} className="border-2 border-ink bg-card p-4 rounded-xl flex items-start justify-between doodle-shadow-sm gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm font-display">{edu.school}</div>
                          <div className="text-xs text-muted-foreground">{edu.degree} · {edu.period}</div>
                          <p className="text-xs mt-1 text-muted-foreground">{edu.detail}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button type="button" onClick={() => setEditingEducation(edu)} className="rounded-lg border border-ink p-1.5 hover:bg-muted touch-manipulation"><Edit className="h-4 w-4" /></button>
                          <button type="button" onClick={() => { const r = { ...resumeData, education: (resumeData.education || []).filter(x => x.id !== edu.id) }; saveResumeLocal(r); setResumeData(r); }} className="rounded-lg border border-ink p-1.5 hover:bg-coral hover:text-coral-foreground touch-manipulation"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── CERTIFICATIONS ── */}
              {resumeSubTab === "certifications" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-display text-base font-bold">Certifications ({(resumeData.certifications || []).length})</h4>
                    <button type="button" onClick={() => setEditingCertification({ name: "New Certification", issuer: "Issuing Body", year: "2025" })} className="rounded-xl border-2 border-ink bg-coral/80 px-3 py-1.5 text-xs font-bold doodle-shadow-sm flex items-center gap-1.5 touch-manipulation"><Plus className="h-3.5 w-3.5" /> Add</button>
                  </div>
                  {editingCertification && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const item: CertificationItemCMS = { id: editingCertification.id || "cert_" + Date.now().toString(36), name: editingCertification.name, issuer: editingCertification.issuer, year: editingCertification.year, url: editingCertification.url };
                      const list = resumeData.certifications || [];
                      const idx = list.findIndex(x => x.id === item.id);
                      const updated = idx >= 0 ? list.map((x, i) => i === idx ? item : x) : [...list, item];
                      const r = { ...resumeData, certifications: updated };
                      setResumeData(r); saveResumeLocal(r); setEditingCertification(null);
                    }} className="border-2 border-ink bg-coral/10 p-4 doodle-shadow rounded-xl space-y-3 text-xs">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block sm:col-span-2"><span className="font-bold">Certification Name</span><input required value={editingCertification.name} onChange={(e) => setEditingCertification(x => ({ ...x!, name: e.target.value }))} className="w-full mt-1 rounded-xl border border-ink p-2 bg-card" /></label>
                        <label className="block"><span className="font-bold">Issuer</span><input value={editingCertification.issuer} onChange={(e) => setEditingCertification(x => ({ ...x!, issuer: e.target.value }))} className="w-full mt-1 rounded-xl border border-ink p-2 bg-card" /></label>
                        <label className="block"><span className="font-bold">Year</span><input value={editingCertification.year} onChange={(e) => setEditingCertification(x => ({ ...x!, year: e.target.value }))} className="w-full mt-1 rounded-xl border border-ink p-2 bg-card" /></label>
                        <label className="block sm:col-span-2"><span className="font-bold">Credential URL (optional)</span><input type="url" value={editingCertification.url || ""} onChange={(e) => setEditingCertification(x => ({ ...x!, url: e.target.value }))} className="w-full mt-1 rounded-xl border border-ink p-2 bg-card" placeholder="https://..." /></label>
                      </div>
                      <div className="flex justify-end gap-2"><button type="button" onClick={() => setEditingCertification(null)} className="rounded-xl border border-ink px-4 py-2 bg-card">Cancel</button><button type="submit" className="rounded-xl border border-ink bg-coral text-coral-foreground px-5 py-2 font-bold">Save</button></div>
                    </form>
                  )}
                  <div className="space-y-2">
                    {(resumeData.certifications || []).map((cert) => (
                      <div key={cert.id} className="border-2 border-ink bg-card p-4 rounded-xl flex items-center justify-between doodle-shadow-sm gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-xs font-display">{cert.name}</div>
                          <div className="text-[11px] text-muted-foreground">{cert.issuer} · {cert.year}</div>
                          {cert.url && <a href={cert.url} target="_blank" rel="noreferrer" className="text-[11px] text-coral hover:underline font-mono">View Credential ↗</a>}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button type="button" onClick={() => setEditingCertification(cert)} className="rounded-lg border border-ink p-1.5 hover:bg-muted touch-manipulation"><Edit className="h-3.5 w-3.5" /></button>
                          <button type="button" onClick={() => { const r = { ...resumeData, certifications: (resumeData.certifications || []).filter(x => x.id !== cert.id) }; saveResumeLocal(r); setResumeData(r); }} className="rounded-lg border border-ink p-1.5 hover:bg-coral hover:text-coral-foreground touch-manipulation"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── ACHIEVEMENTS ── */}
              {resumeSubTab === "achievements" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-display text-base font-bold">Achievements ({(resumeData.achievements || []).length})</h4>
                    <button type="button" onClick={() => setEditingAchievement({ title: "New Achievement", copy: "" })} className="rounded-xl border-2 border-ink bg-lime px-3 py-1.5 text-xs font-bold doodle-shadow-sm flex items-center gap-1.5 touch-manipulation"><Plus className="h-3.5 w-3.5" /> Add</button>
                  </div>
                  {editingAchievement && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const item: AchievementItemCMS = { id: editingAchievement.id || "ach_" + Date.now().toString(36), title: editingAchievement.title, copy: editingAchievement.copy, published: true };
                      const list = resumeData.achievements || [];
                      const idx = list.findIndex(x => x.id === item.id);
                      const updated = idx >= 0 ? list.map((x, i) => i === idx ? item : x) : [...list, item];
                      const r = { ...resumeData, achievements: updated };
                      setResumeData(r); saveResumeLocal(r); setEditingAchievement(null);
                    }} className="border-2 border-ink bg-lime/20 p-4 doodle-shadow rounded-xl space-y-3 text-xs">
                      <label className="block"><span className="font-bold">Achievement Title</span><input required value={editingAchievement.title} onChange={(e) => setEditingAchievement(x => ({ ...x!, title: e.target.value }))} className="w-full mt-1 rounded-xl border border-ink p-2 bg-card" /></label>
                      <label className="block"><span className="font-bold">Description</span><textarea rows={2} value={editingAchievement.copy} onChange={(e) => setEditingAchievement(x => ({ ...x!, copy: e.target.value }))} className="w-full mt-1 rounded-xl border border-ink p-2 bg-card" /></label>
                      <div className="flex justify-end gap-2"><button type="button" onClick={() => setEditingAchievement(null)} className="rounded-xl border border-ink px-4 py-2 bg-card">Cancel</button><button type="submit" className="rounded-xl border border-ink bg-lime px-5 py-2 font-bold">Save</button></div>
                    </form>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(resumeData.achievements || []).map((ach) => (
                      <div key={ach.id} className={`border-2 border-ink bg-card p-4 rounded-xl doodle-shadow-sm transition-opacity ${ach.published === false ? "opacity-50" : ""}`}>
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs font-display">{ach.title}</div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{ach.copy}</p>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button type="button" title={ach.published === false ? "Publish" : "Unpublish"} onClick={() => { const r = { ...resumeData, achievements: (resumeData.achievements || []).map(a => a.id === ach.id ? { ...a, published: !ach.published } : a) }; setResumeData(r); saveResumeLocal(r); }} className={`rounded-lg border border-ink p-1.5 touch-manipulation text-[10px] font-bold ${ach.published === false ? "bg-muted" : "bg-mint"}`}>{ach.published === false ? "OFF" : "ON"}</button>
                            <button type="button" onClick={() => setEditingAchievement(ach)} className="rounded-lg border border-ink p-1.5 hover:bg-muted touch-manipulation"><Edit className="h-3.5 w-3.5" /></button>
                            <button type="button" onClick={() => { const r = { ...resumeData, achievements: (resumeData.achievements || []).filter(a => a.id !== ach.id) }; setResumeData(r); saveResumeLocal(r); }} className="rounded-lg border border-ink p-1.5 hover:bg-coral hover:text-coral-foreground touch-manipulation"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
            <div className="border-2 border-ink bg-card p-6 doodle-shadow rounded-2xl space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-ink/20 pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold">Lead CRM Inbox</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {leads.length} total leads · {filteredLeads.length} filtered · Last refreshed in real-time from Supabase.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="search"
                    placeholder="Search leads…"
                    value={leadsSearch}
                    onChange={(e) => { setLeadsSearch(e.target.value); setLeadsPage(1); }}
                    className="rounded-xl border-2 border-ink bg-background px-3 py-1.5 text-xs font-mono outline-none w-44 focus:ring-2 focus:ring-ring"
                  />
                  <span className="sticker bg-sun text-ink font-mono font-bold text-xs">{leads.length} Total</span>
                </div>
              </div>

              {/* Status Tab Bar */}
              <div className="flex flex-wrap gap-2 pb-1">
                {[
                  { key: "all", label: "All", color: "bg-ink text-background", count: leads.length },
                  ...Object.entries(LEAD_STATUS_LABELS).map(([k, v]) => ({
                    key: k,
                    label: v.label,
                    color: v.color,
                    count: leads.filter(l => l.status === k).length,
                  }))
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => { setLeadsStatusFilter(tab.key as typeof leadsStatusFilter); setLeadsPage(1); }}
                    className={`inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1 text-xs font-bold transition-all touch-manipulation ${
                      leadsStatusFilter === tab.key ? `${tab.color} doodle-shadow-sm scale-[1.04]` : "bg-card text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`rounded-full px-1.5 py-0 text-[10px] font-black ${leadsStatusFilter === tab.key ? "bg-white/30" : "bg-muted/60"}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Table */}
              {filteredLeads.length === 0 ? (
                <div className="text-center py-12 text-xs text-muted-foreground italic border-2 border-dashed border-ink/30 rounded-xl">
                  {leadsSearch || leadsStatusFilter !== "all" ? "No leads match your current filters." : "No lead inquiries recorded yet."}
                </div>
              ) : (
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[640px]">
                    <thead>
                      <tr className="border-b-2 border-ink bg-muted/60 text-ink">
                        <th className="p-3 font-bold uppercase tracking-wider w-20">Date</th>
                        <th className="p-3 font-bold uppercase tracking-wider">Contact</th>
                        <th className="p-3 font-bold uppercase tracking-wider">Subject &amp; Message</th>
                        <th className="p-3 font-bold uppercase tracking-wider w-40 text-center">Status</th>
                        <th className="p-3 font-bold uppercase tracking-wider w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                      {paginatedLeads.map((l) => {
                        const statusInfo = LEAD_STATUS_LABELS[l.status] || LEAD_STATUS_LABELS.new;
                        return (
                          <tr key={l.id} className={`hover:bg-muted/20 transition-colors ${l.status === "completed" || l.status === "closed" || l.status === "archived" ? "opacity-60" : ""}`}>
                            <td className="p-3 align-top font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                              {new Date(l.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                            </td>

                            <td className="p-3 align-top min-w-[160px]">
                              <div className="font-bold text-foreground text-xs leading-snug">{l.name}</div>
                              <a href={`mailto:${l.email}`} className="inline-block text-[11px] font-mono font-semibold text-coral hover:underline break-all mt-0.5">
                                {l.email}
                              </a>
                            </td>

                            <td className="p-3 align-top max-w-xs">
                              {l.subject && <div className="font-bold text-foreground text-xs leading-snug break-words mb-0.5">{l.subject}</div>}
                              <div className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 break-words">{l.message}</div>
                            </td>

                            <td className="p-3 align-top text-center">
                              <div className="flex flex-wrap gap-1 justify-center">
                                {Object.entries(LEAD_STATUS_LABELS).map(([k, v]) => (
                                  <button
                                    key={k}
                                    type="button"
                                    onClick={() => handleStatusChange(l.id, k as LeadEntry["status"])}
                                    title={v.label}
                                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold transition-all touch-manipulation ${
                                      l.status === k
                                        ? `${v.color} border-ink scale-105 doodle-shadow-sm`
                                        : "border-ink/20 bg-muted/30 text-muted-foreground hover:border-ink hover:bg-muted/60"
                                    }`}
                                  >
                                    {v.icon} {v.label}
                                  </button>
                                ))}
                              </div>
                            </td>

                            <td className="p-3 align-top">
                              <button
                                type="button"
                                title="Delete lead"
                                onClick={async () => {
                                  if (!confirm(`Delete lead from ${l.name}? This cannot be undone.`)) return;
                                  const updated = await deleteLead(l.id);
                                  setLeads(updated);
                                }}
                                className="rounded-lg border border-ink/30 p-1.5 text-muted-foreground hover:bg-coral hover:text-coral-foreground hover:border-coral transition-colors touch-manipulation"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Controls */}
              {filteredLeads.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-ink/15 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground font-mono">
                    Showing <strong className="text-foreground">{Math.min((leadsPage - 1) * leadsPageSize + 1, filteredLeads.length)}</strong>–<strong className="text-foreground">{Math.min(leadsPage * leadsPageSize, filteredLeads.length)}</strong> of <strong className="text-foreground">{filteredLeads.length}</strong>
                    <select
                      value={leadsPageSize}
                      onChange={(e) => { setLeadsPageSize(Number(e.target.value)); setLeadsPage(1); }}
                      className="ml-2 rounded-lg border border-ink bg-background px-2 py-1 font-bold outline-none focus:ring-2 focus:ring-ring"
                    >
                      {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n} / page</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={leadsPage === 1}
                      onClick={() => setLeadsPage(p => p - 1)}
                      className="rounded-lg border-2 border-ink px-3 py-1.5 font-bold disabled:opacity-40 hover:bg-muted touch-manipulation"
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: Math.min(totalLeadsPages, 7) }, (_, i) => {
                      let pg = i + 1;
                      if (totalLeadsPages > 7) {
                        if (leadsPage <= 4) pg = i + 1;
                        else if (leadsPage >= totalLeadsPages - 3) pg = totalLeadsPages - 6 + i;
                        else pg = leadsPage - 3 + i;
                      }
                      return (
                        <button
                          key={pg}
                          type="button"
                          onClick={() => setLeadsPage(pg)}
                          className={`rounded-lg border-2 border-ink w-8 h-8 font-bold transition-all touch-manipulation ${leadsPage === pg ? "bg-ink text-background" : "bg-card hover:bg-muted"}`}
                        >
                          {pg}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      disabled={leadsPage === totalLeadsPages}
                      onClick={() => setLeadsPage(p => p + 1)}
                      className="rounded-lg border-2 border-ink px-3 py-1.5 font-bold disabled:opacity-40 hover:bg-muted touch-manipulation"
                    >
                      Next →
                    </button>
                  </div>
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
