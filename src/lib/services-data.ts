export type ServiceItem = {
  id: string;
  title: string;
  category: "web" | "ai" | "automation" | "cloud" | "design";
  shortDescription: string;
  fullDescription: string;
  deliverables: string[];
  technologies: string[];
  accentColor: string; // Tailwind background or border accent
  iconName: string;
};

export const defaultServices: ServiceItem[] = [
  {
    id: "custom-web-dev",
    title: "Custom Website Development",
    category: "web",
    shortDescription: "Tailor-made responsive websites built with high-performance frameworks and custom doodle visual identity.",
    fullDescription:
      "Crafting unique, scalable websites designed to represent your brand authentically. Built with modern web technologies, zero generic templates, and clean semantic code.",
    deliverables: ["Custom UI design", "SEO & Open Graph meta", "Responsive design", "Speed optimization"],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite", "HTML5/CSS3"],
    accentColor: "bg-sun",
    iconName: "Globe",
  },
  {
    id: "fullstack-apps",
    title: "Full Stack Web Applications",
    category: "web",
    shortDescription: "End-to-end web apps with reactive frontends, robust REST APIs, authentication, and database design.",
    fullDescription:
      "Building production-grade web applications from architectural schema to cloud deployment. Focus on clean state management, security, and smooth user interactions.",
    deliverables: ["Frontend & Backend code", "Database schema & migrations", "JWT/OAuth Auth", "API documentation"],
    technologies: ["React", "Node.js", "Express", "MongoDB", "PostgreSQL", "Supabase"],
    accentColor: "bg-mint",
    iconName: "Layers",
  },
  {
    id: "ecommerce-dev",
    title: "E-Commerce Development",
    category: "web",
    shortDescription: "Custom online storefronts, catalog filters, cart engines, quote generators, and payment integrations.",
    fullDescription:
      "High-converting online shopping platforms optimized for both B2B and B2C sales. Features fast product filtering, cart management, and automated order notifications.",
    deliverables: ["Product catalog & search", "Shopping cart & checkout", "Payment gateways (Stripe/Razorpay)", "Order CRM"],
    technologies: ["React", "Node.js", "MongoDB", "Stripe API", "WhatsApp Commerce API"],
    accentColor: "bg-bubble",
    iconName: "ShoppingCart",
  },
  {
    id: "wordpress-dev",
    title: "WordPress Development",
    category: "web",
    shortDescription: "Custom WordPress themes, Gutenberg blocks, plugin customizations, and headless CMS integrations.",
    fullDescription:
      "Modern WordPress builds that combine easy client content editing with lightning-fast frontends or headless REST API setups.",
    deliverables: ["Custom Theme/Child Theme", "ACF & Custom Fields setup", "Security & Caching", "Migration support"],
    technologies: ["WordPress", "PHP", "REST API", "Tailwind", "MySQL"],
    accentColor: "bg-sky/40",
    iconName: "Layout",
  },
  {
    id: "ai-web-apps",
    title: "AI-Powered Web Applications",
    category: "ai",
    shortDescription: "Integrating LLMs, computer vision, OpenAI, Cloudinary AI, and custom model endpoints into web interfaces.",
    fullDescription:
      "Infusing web software with intelligent capabilities — from image background removal and auto-tagging to natural language chat interfaces and smart generators.",
    deliverables: ["AI Model API integration", "Streaming UI responses", "Media transformation pipeline", "Cost & token monitoring"],
    technologies: ["OpenAI API", "Python", "Cloudinary AI", "FastAPI", "React"],
    accentColor: "bg-violet/30",
    iconName: "Sparkles",
  },
  {
    id: "agentic-ai",
    title: "Agentic AI Solutions",
    category: "ai",
    shortDescription: "Autonomous goal-driven AI agents, RAG vector retrieval pipelines, and multi-agent workflow systems.",
    fullDescription:
      "Architecting intelligent agents that can reason, break complex goals into tasks, query vector databases, call APIs, and execute code safely.",
    deliverables: ["Agent step planner", "RAG vector database integration", "Tool calling harness", "Reasoning trace UI"],
    technologies: ["Python", "Pinecone", "LangChain", "FastAPI", "Docker", "React"],
    accentColor: "bg-lime",
    iconName: "Bot",
  },
  {
    id: "cms-dev",
    title: "CMS Development & Integration",
    category: "web",
    shortDescription: "Custom administrative dashboards and headless CMS engines tailored to your specific content workflows.",
    fullDescription:
      "Empowering non-technical team members to edit text, publish articles, update project galleries, and review lead submissions effortlessly.",
    deliverables: ["Admin dashboard UI", "Role-based access control", "Content editor", "Data export/backup tools"],
    technologies: ["React", "Supabase", "TanStack Table", "Node.js", "Zod"],
    accentColor: "bg-coral/30",
    iconName: "Database",
  },
  {
    id: "business-automation",
    title: "Business Automation",
    category: "automation",
    shortDescription: "Automating repetitive data tasks, email notifications, lead generation flows, and webhook integrations.",
    fullDescription:
      "Connecting disparate business tools and streamlining manual workflows to save time, reduce human error, and accelerate business operations.",
    deliverables: ["Automated webhooks", "Email/WhatsApp autoresponders", "Data scraping/processing pipelines", "Cron jobs"],
    technologies: ["Node.js", "Python", "MQTT", "Zapier/n8n", "Docker"],
    accentColor: "bg-sun",
    iconName: "Zap",
  },
  {
    id: "dashboard-dev",
    title: "Dashboard & Analytics Development",
    category: "web",
    shortDescription: "Interactive, real-time analytics portals, metrics visualizations, and operational telemetry control rooms.",
    fullDescription:
      "Transforming raw telemetry and database data into actionable visual insights with interactive charts, date range filters, and CSV/PDF export features.",
    deliverables: ["Interactive charting UI", "Real-time metrics stream", "CSV/PDF report generator", "Filter controls"],
    technologies: ["React", "Recharts", "Lucide", "Node.js", "PostgreSQL"],
    accentColor: "bg-mint",
    iconName: "BarChart3",
  },
  {
    id: "api-integration",
    title: "API Development & Integration",
    category: "web",
    shortDescription: "Designing RESTful & GraphQL web APIs and integrating 3rd-party services (Payments, CRMs, Maps, Auth).",
    fullDescription:
      "Building clean, well-documented API endpoints and integrating third-party software APIs reliably with error retry logic and rate limiting.",
    deliverables: ["RESTful API endpoints", "OpenAPI/Swagger docs", "Webhook handlers", "Error handling & retries"],
    technologies: ["Node.js", "Express", "FastAPI", "Swagger", "Postman"],
    accentColor: "bg-bubble",
    iconName: "Workflow",
  },
  {
    id: "ui-ux-dev",
    title: "UI/UX & Interactive Design",
    category: "design",
    shortDescription: "Designing hand-crafted, high-converting interfaces with micro-animations and intuitive layout architecture.",
    fullDescription:
      "Creating memorable user experiences that combine rich visual aesthetics, accessible component hierarchy, smooth transitions, and brand flair.",
    deliverables: ["Figma / Wireframes", "Interactive prototypes", "Design tokens system", "Component library"],
    technologies: ["Figma", "Framer Motion", "Tailwind CSS", "React", "Lucide"],
    accentColor: "bg-sky/40",
    iconName: "Palette",
  },
  {
    id: "website-maintenance",
    title: "Website Maintenance & Support",
    category: "cloud",
    shortDescription: "Ongoing platform updates, performance monitoring, security patching, and content management support.",
    fullDescription:
      "Keeping your web applications secure, fast, and up to date with recurring health audits, database cleanups, and emergency hotfix support.",
    deliverables: ["Monthly dependency updates", "Uptime monitoring", "Security audits", "Speed performance tuning"],
    technologies: ["Git", "Docker", "Vite", "Supabase", "Lighthouse"],
    accentColor: "bg-violet/30",
    iconName: "ShieldCheck",
  },
  {
    id: "cloud-deployment",
    title: "Cloud Deployment & DevOps",
    category: "cloud",
    shortDescription: "Containerizing web services with Docker and deploying to Vercel, Netlify, Cloudflare, AWS, or DigitalOcean.",
    fullDescription:
      "Setting up zero-downtime deployment pipelines, environment variables, SSL certificates, CDN routing, and automated build scripts.",
    deliverables: ["Docker container configs", "CI/CD GitHub Actions pipeline", "DNS & SSL setup", "Server provisioning"],
    technologies: ["Docker", "AWS", "Cloudflare", "Vercel", "Netlify", "GitHub Actions"],
    accentColor: "bg-lime",
    iconName: "Cloud",
  },
  {
    id: "technical-consultation",
    title: "Technical Consultation & Advisory",
    category: "automation",
    shortDescription: "1-on-1 strategy sessions on tech stack selection, AI integration roadmaps, and architecture reviews.",
    fullDescription:
      "Providing expert technical advice to founders, engineering leads, and business owners looking to build software products or introduce AI.",
    deliverables: ["Architecture blueprint", "Tech stack recommendation", "Scope estimate & timeline", "Codebase audit report"],
    technologies: ["Architecture", "AI Systems", "Full Stack", "DevOps"],
    accentColor: "bg-coral/30",
    iconName: "Compass",
  },
];
