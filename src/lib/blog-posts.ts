export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: "AI & Agents" | "Full Stack" | "Computer Vision" | "Architecture";
  author: string;
  date: string;
  readTime: string;
  featuredImage: string;
  published: boolean;
  tags: string[];
};

export const defaultBlogPosts: BlogPost[] = [
  {
    id: "blog-1",
    slug: "building-autonomous-agentic-ai-systems",
    title: "Building Autonomous Agentic AI Systems with RAG & Tool Execution",
    summary: "A deep dive into state machines, token budgets, and vector retrieval memory for reliable goal-driven AI agents.",
    content: `
# Building Autonomous Agentic AI Systems

Large Language Models (LLMs) have evolved from simple text predictors into **autonomous agents** capable of reasoning, breaking down complex objectives into sequential steps, querying external databases, and executing code in sandboxed environments.

In this article, we explore the core architectural pillars required to transition from basic prompt-response wrappers to deterministic, reliable agentic systems.

---

## 1. The Agent Finite State Machine (FSM)

An agent without a state machine easily falls into infinite tool-calling loops or context degradation. A robust loop follows a strict **Plan -> Act -> Retrieve -> Critique -> Deliver** cycle:

\`\`\`
[ User Goal ] -> ( Planner Agent ) -> ( Tool Executor ) -> ( RAG Retriever ) -> ( Critic Checkpoint ) -> [ Output ]
\`\`\`

- **Planner Agent:** Decomposes natural language requests into structured JSON action plans.
- **Tool Executor:** Safely runs specific API calls, Python scripts, or data transformations.
- **RAG Retriever:** Queries Pinecone or vector databases for dense embeddings and grounded facts.
- **Critic Checkpoint:** Evaluates tool execution results against original goal constraints before returning output to the user.

---

## 2. Token Budgeting & Self-Critique

To guarantee production reliability, every agent run is assigned a maximum **step budget** (e.g., max 5 tool executions) and a **token usage guardrail**. If a tool execution returns an error, the agent passes the traceback back to itself for automated debugging rather than crashing.

---

## Conclusion

Agentic AI represents a fundamental shift in software engineering — blending traditional deterministic workflows with probabilistic AI reasoning.
    `,
    category: "AI & Agents",
    author: "Adapa Sai Prithvi",
    date: "2026-08-01",
    readTime: "6 min read",
    featuredImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
    published: true,
    tags: ["Agentic AI", "Python", "RAG", "Pinecone", "LangChain"],
  },
  {
    id: "blog-2",
    slug: "realtime-anpr-computer-vision-yolo-easyocr",
    title: "Real-Time License Plate Recognition using YOLOv8 & OpenCV",
    summary: "How we achieved 98.4% OCR accuracy on dynamic video feeds under challenging lighting conditions.",
    content: `
# Real-Time License Plate Recognition with YOLOv8 and EasyOCR

Automatic Number Plate Recognition (ANPR) systems require ultra-low latency processing while handling difficult environmental factors like motion blur, night-time glare, and non-standard vehicle plates.

Here is how we architected our vision pipeline for the **AI Smart Gate** and **ANPR System**:

---

## The Vision Processing Pipeline

1. **RTSP Stream Decoding:** Capture high-frame-rate IP camera feeds using OpenCV.
2. **Plate Localization:** Utilize a lightweight YOLOv8 model trained specifically on license plate bounding boxes.
3. **Image Preprocessing:** Apply CLAHE (Contrast Limited Adaptive Histogram Equalization) and perspective transformation to flatten tilted plates.
4. **Optical Character Recognition (OCR):** Pass preprocessed text regions to EasyOCR with custom regex filtering for license plate formats.
5. **MQTT Broadcast:** Publish localized plate string and timestamp to the gate relay microservice in under 180ms.

---

## Key Performance Improvements

By isolating plate detection from full-frame OCR, processing speed increased from **4 FPS to over 32 FPS**, enabling real-time barrier control at entry gates.
    `,
    category: "Computer Vision",
    author: "Adapa Sai Prithvi",
    date: "2026-07-20",
    readTime: "5 min read",
    featuredImage: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80",
    published: true,
    tags: ["Computer Vision", "Python", "YOLOv8", "OpenCV", "ANPR"],
  },
  {
    id: "blog-3",
    slug: "scaling-peer-to-peer-mentorship-mentorhive",
    title: "Scaling Peer-to-Peer Mentorship Platforms: Lessons from MentorHive",
    summary: "Architecting 1-on-1 booking slots, optimistic concurrency locks, and RESTful JWT APIs for 100+ mentors.",
    content: `
# Scaling Peer-to-Peer Mentorship Platforms

When building **MentorHive**, our primary goal was connecting over 100 industry mentors with 500+ active learners while maintaining zero double-booking conflicts across global time zones.

---

## Engineering Highlights

- **Optimistic Concurrency Locks:** Prevented simultaneous calendar bookings using MongoDB document version keys and atomic query updates.
- **JWT & Role-Based Middleware:** Enforced granular authorization levels separating Mentors, Mentees, and Platform Admins.
- **WebSocket Availability Telemetry:** Broadcasted live online/offline status changes to student search lists instantly.

---

## Results

Optimizing client-side product search and availability filtering resulted in a **30% increase in successful session bookings** within the first month.
    `,
    category: "Full Stack",
    author: "Adapa Sai Prithvi",
    date: "2026-07-10",
    readTime: "4 min read",
    featuredImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    published: true,
    tags: ["React", "Node.js", "MongoDB", "Full Stack", "System Design"],
  },
];
