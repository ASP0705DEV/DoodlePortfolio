export type ShowcaseProject = {
  id: string;
  slug: string;
  title: string;
  category: "ai" | "fullstack" | "automation" | "opensource" | "ecommerce";
  summary: string;
  description: string;
  tech_stack: string[];
  featured: boolean;
  status: "Completed" | "Live" | "Active";
  timeline: string;
  role: string;
  challenges: string;
  solutions: string;
  architecture: string;
  live_url?: string;
  repo_url?: string;
  cover_image?: string;
  before_image?: string;
  after_image?: string;
  deployment_platform: string;
  features: string[];
};

export const defaultProjects: ShowcaseProject[] = [
  {
    id: "ai-smart-gate",
    slug: "ai-smart-gate",
    title: "AI Smart Gate System",
    category: "ai",
    summary: "Automated gate access control system integrating IoT sensors, computer vision, and real-time security logs.",
    description:
      "The AI Smart Gate System is an enterprise-grade access control platform that automates vehicle and visitor verification at entry points. Utilizing computer vision edge models and IoT relay control, it grants instant access to authorized vehicles while flagging unknown entities.",
    tech_stack: ["Python", "OpenCV", "PyTorch", "React", "Node.js", "MQTT", "Docker", "Raspberry Pi"],
    featured: true,
    status: "Live",
    timeline: "3 Months",
    role: "Lead Full Stack & AI Systems Architect",
    challenges:
      "Processing high-resolution video streams in low-latency environments (<200ms) on edge devices while maintaining low false-positive access rates.",
    solutions:
      "Optimized YOLOv8 object detection with TensorRT acceleration on edge hardware, combined with an MQTT event broker and a reactive React dashboard for real-time guard monitoring.",
    architecture:
      "Edge Camera -> TensorRT Vision Pipeline -> MQTT Broker -> Node.js Microservice -> WebSockets -> React Admin Dashboard & Gate Relay Controller.",
    live_url: "https://github.com/codeping0705",
    repo_url: "https://github.com/codeping0705",
    cover_image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    deployment_platform: "Docker / AWS EC2 / Edge Hardware",
    features: [
      "Real-time license plate & vehicle detection (<200ms latency)",
      "Automated barrier relay triggering via MQTT protocol",
      "Security guard live stream telemetry and emergency override switch",
      "Visitor pre-registration QR scanner and access pass generation",
      "Historical access audit logs with image snapshots and analytics",
    ],
  },
  {
    id: "anpr-system",
    slug: "anpr-system",
    title: "Automatic Number Plate Recognition (ANPR)",
    category: "ai",
    summary: "High-precision license plate extraction and OCR pipeline for automated traffic and parking management.",
    description:
      "An end-to-end Automatic Number Plate Recognition system designed for high-density parking facilities and traffic monitoring. It extracts license plate regions from dynamic video feeds, performs OCR with 98.4% accuracy, and indexes vehicle movements.",
    tech_stack: ["Python", "FastAPI", "React", "OpenCV", "EasyOCR", "PostgreSQL", "Docker", "Tailwind CSS"],
    featured: true,
    status: "Live",
    timeline: "2.5 Months",
    role: "AI & Full Stack Engineer",
    challenges:
      "Handling license plate variations, poor lighting, motion blur, and non-standard typography during night-time surveillance.",
    solutions:
      "Implemented custom image preprocessing pipeline (CLAHE, bilateral filtering, perspective warp correction) combined with a fine-tuned EasyOCR model and confidence score thresholds.",
    architecture:
      "RTSP Stream Feed -> Python Frame Sampler -> Preprocessing & License Plate Localization -> OCR Engine -> FastAPI REST API -> PostgreSQL & React UI.",
    live_url: "https://github.com/codeping0705",
    repo_url: "https://github.com/codeping0705",
    cover_image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80",
    deployment_platform: "Cloudflare Pages / DigitalOcean App Platform",
    features: [
      "License plate detection with automated perspective distortion correction",
      "98.4% OCR accuracy across varying weather and lighting conditions",
      "Automated parking duration counter and fee calculator",
      "Blacklisted vehicle alerting system with instant Telegram/SMS notifications",
      "Exportable CSV/PDF traffic reports for facility administrators",
    ],
  },
  {
    id: "lovable-ai-revamp",
    slug: "lovable-ai-revamp",
    title: "Lovable AI Solution Revamp",
    category: "automation",
    summary: "Complete modernization of AI generation studio with prompt engineering engine and UI canvas preview.",
    description:
      "A complete architectural overhaul of an AI-driven Web Application generator. Introduced dynamic component preview canvases, intelligent prompt decomposition, real-time code generation streams, and automated layout linting.",
    tech_stack: ["React", "TypeScript", "TanStack Router", "Tailwind CSS", "Node.js", "OpenAI API", "Vite"],
    featured: true,
    status: "Completed",
    timeline: "2 Months",
    role: "Senior Full Stack Engineer",
    challenges:
      "Streaming large code payloads without breaking React UI hydration or causing cursor lag during real-time preview updates.",
    solutions:
      "Built a custom virtual web container streaming parser with Web Workers, isolating code execution from the main application UI thread.",
    architecture:
      "React Frontend -> Server-Sent Events (SSE) -> LLM Orchestrator -> Isolated Web Worker Sandbox -> Dynamic Live Preview Canvas.",
    live_url: "https://github.com/codeping0705",
    repo_url: "https://github.com/codeping0705",
    cover_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    deployment_platform: "Vercel / Cloudflare Workers",
    features: [
      "Real-time streaming LLM code generator with dynamic preview",
      "Prompt decomposition engine breaking high-level ideas into modular components",
      "Interactive code diff inspector and component sandbox",
      "One-click GitHub repository export and Vercel deployment trigger",
      "Custom doodle theme design system integration",
    ],
  },
  {
    id: "pixmate-image-tools",
    slug: "pixmate-image-tools",
    title: "Pixmate - AI Image Tools & Editor",
    category: "ai",
    summary: "Cloudinary-powered web studio featuring AI background removal, image enhancement, and before/after comparison.",
    description:
      "Pixmate is a full-featured online AI image processing studio. It empowers content creators and e-commerce sellers to strip image backgrounds in one click, enhance low-resolution assets, perform smart cropping, and inspect changes using an interactive Before & After slider.",
    tech_stack: ["React", "Tailwind CSS", "Node.js", "Express", "Cloudinary AI SDK", "MongoDB", "JWT"],
    featured: true,
    status: "Live",
    timeline: "2 Months",
    role: "Full Stack Developer",
    challenges:
      "Delivering instant AI background removal and image optimization while reducing overall page asset load time by over 40%.",
    solutions:
      "Leveraged Cloudinary's AI transformations pipeline directly via signed backend upload presets, caching processed image URLs in MongoDB for instant recurring retrieval.",
    architecture:
      "React Client -> Express API (JWT Auth) -> Cloudinary AI Transformations Pipeline -> Optimized CDN Delivery -> MongoDB Cache.",
    live_url: "https://github.com/codeping0705",
    repo_url: "https://github.com/codeping0705",
    cover_image: "https://images.unsplash.com/photo-1542744094-3a31216914fc?auto=format&fit=crop&w=800&q=80",
    before_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    after_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80&sat=-100&con=30",
    deployment_platform: "Render / Vercel",
    features: [
      "One-click AI background removal with transparent PNG download",
      "AI image upscaling and facial detail enhancement",
      "Interactive Before & After split slider visual inspector",
      "Cloudinary CDN storage integration reducing image load time by 40%",
      "Secure user authentication and session image library management",
    ],
  },
  {
    id: "mentorhive-platform",
    slug: "mentorhive-platform",
    title: "MentorHive - 1-on-1 Learning Platform",
    category: "fullstack",
    summary: "EdTech platform connecting learners with 100+ industry mentors, real-time availability tracking, and booking.",
    description:
      "MentorHive is a comprehensive peer-to-peer mentorship platform designed to facilitate 1-on-1 knowledge sharing. Supporting over 100 mentor profiles and 500+ booked sessions, it includes real-time availability calendars, RESTful APIs, JWT security, and interactive booking management.",
    tech_stack: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "JWT", "Socket.io"],
    featured: true,
    status: "Live",
    timeline: "3 Months",
    role: "Full Stack Developer",
    challenges:
      "Eliminating double-booking conflicts across time zones and tracking real-time mentor availability status.",
    solutions:
      "Built a dynamic slot booking engine with MongoDB optimistic concurrency locks and real-time Socket.io status updates, resulting in a 30% increase in mentor booking conversion.",
    architecture:
      "React SPA -> Express REST API -> MongoDB Atlas -> WebSockets -> Stripe/Razorpay Payment Gateway Integration.",
    live_url: "https://github.com/codeping0705",
    repo_url: "https://github.com/codeping0705",
    cover_image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    deployment_platform: "Netlify / Heroku / MongoDB Atlas",
    features: [
      "100+ vetted mentor profiles with skill tags, ratings, and reviews",
      "Real-time calendar slot availability tracking and instant booking",
      "RESTful API backend with secure JWT authentication and role middleware",
      "Integrated 1-on-1 video call room link generation",
      "Mentorship analytics dashboard for tracking completed hours and earnings",
    ],
  },
  {
    id: "ecommerce-construction-supply",
    slug: "ecommerce-construction-supply",
    title: "Construction Raw Material E-Commerce",
    category: "ecommerce",
    summary: "B2B and B2C marketplace for construction supplies with dynamic product filtering and quick quote generator.",
    description:
      "A fast, responsive e-commerce web platform engineered for raw construction material distribution (cement, steel, aggregate, bricks). Features 10+ product listings, advanced multi-attribute filtering, quantity bulk discount calculator, and mobile-optimized checkout flow.",
    tech_stack: ["React", "HTML5", "CSS3", "JavaScript", "Node.js", "Express", "Bootstrap"],
    featured: false,
    status: "Completed",
    timeline: "1.5 Months",
    role: "Full Stack Developer",
    challenges:
      "Managing complex bulk pricing tiers and heavy product specification filter matrices without slowing down page navigation.",
    solutions:
      "Implemented lightweight client-side state filtering combined with debounced search indices, increasing product discovery speed by 40%.",
    architecture:
      "React Frontend -> Express API -> Product Catalog Database -> Quotation PDF Generator -> WhatsApp Order Dispatch.",
    live_url: "https://github.com/codeping0705",
    repo_url: "https://github.com/codeping0705",
    cover_image: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80",
    deployment_platform: "Vercel",
    features: [
      "Comprehensive construction material catalog with multi-category filtering",
      "Dynamic bulk quantity pricing calculator and instant PDF quote exporter",
      "40% faster product discovery through client-side index caching",
      "Direct WhatsApp Business cart order dispatch link",
      "Fully responsive mobile and desktop layout optimized for field workers",
    ],
  },
  {
    id: "agentic-rag-studio",
    slug: "agentic-rag-studio",
    title: "Agentic RAG & Execution Studio",
    category: "ai",
    summary: "Autonomous agent execution platform with vector retrieval memory, step planner, and code execution sandbox.",
    description:
      "An advanced AI platform demonstrating autonomous agent loop design. The system accepts high-level natural language goals, generates execution plans, retrieves domain documents via hybrid vector search, executes Python/JS tool code safely, and critiques output before delivery.",
    tech_stack: ["Python", "FastAPI", "React", "Pinecone", "LangChain", "OpenAI API", "Docker"],
    featured: true,
    status: "Active",
    timeline: "Ongoing",
    role: "Agentic AI Developer",
    challenges:
      "Preventing agent infinite tool-calling loops and enforcing strict execution budgets during multi-step problem solving.",
    solutions:
      "Implemented a finite state machine (FSM) planner with max-step token budgets, structured JSON schema validation, and self-critique loop checkpoints.",
    architecture:
      "User Goal -> Agent Planner (FSM) -> Hybrid RAG Retrieval (Pinecone/Dense) -> Sandbox Tool Execution -> Verification Critic -> Response Stream.",
    live_url: "https://github.com/codeping0705",
    repo_url: "https://github.com/codeping0705",
    cover_image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
    deployment_platform: "AWS EC2 / Cloudflare Workers",
    features: [
      "Goal-driven multi-agent orchestration (Planner, Retriever, Critic, Executor)",
      "Hybrid vector and keyword search retrieval for grounded context",
      "Safe isolated code runner execution sandbox",
      "Visual step-by-step agent reasoning trace inspector",
      "Custom tool creation interface for adding new REST API tools",
    ],
  },
];
