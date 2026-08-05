import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ShieldCheck, Database, Server, Terminal, Lock, Download, Layers } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Section, SectionHeading, Reveal } from "@/components/ui-kit";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [{ title: "CMS Documentation & Architecture Guide" }],
  }),
  component: DocsPage,
});

function DocsPage() {
  return (
    <>
      <SiteNav />
      <main className="pt-28 pb-20">
        <Section id="cms-docs" className="max-w-4xl">
          <SectionHeading
            kicker="developer & admin manual"
            title="CMS Architecture & Documentation"
            subtitle="Complete installation, configuration, administration, analytics, lead management, backup, and deployment guide."
            accent="text-sky"
          />

          <div
            className="border-2 border-ink bg-card p-8 doodle-shadow space-y-8 text-sm leading-relaxed"
            style={{ borderRadius: "24px 30px 24px 32px" }}
          >
            {/* Section 1: Overview & Architecture */}
            <div>
              <h2 className="font-display text-2xl font-bold flex items-center gap-2 border-b-2 border-ink/20 pb-2">
                <Layers className="h-6 w-6 text-mint" /> 1. System Architecture Overview
              </h2>
              <p className="mt-3 text-muted-foreground">
                The Doodle Portfolio & Business CMS is built using a hybrid **Client-Server & Local Fallback Strategy**. It operates seamlessly with **Supabase (PostgreSQL, Auth, RLS)** while automatically supporting offline local storage (`localStorage`) so admin features run reliably anywhere.
              </p>
              <div className="mt-4 rounded-2xl border-2 border-ink bg-muted/40 p-4 font-mono text-xs space-y-1">
                <div>• Frontend: React 18, TanStack Router, Vite, Tailwind CSS, Motion</div>
                <div>• Backend & Database: Supabase (PostgreSQL, RLS Policies, Realtime)</div>
                <div>• CMS Store: Dual Supabase Client + Local Storage Fallback Engine</div>
                <div>• Analytics: GDPR Consent Telemetry Tracker (`analytics_events`)</div>
                <div>• Chatbot: AI Agent Assistant + WhatsApp Business Handoff</div>
              </div>
            </div>

            {/* Section 2: Installation & Local Setup */}
            <div>
              <h2 className="font-display text-2xl font-bold flex items-center gap-2 border-b-2 border-ink/20 pb-2">
                <Terminal className="h-6 w-6 text-sun" /> 2. Local Installation & Development
              </h2>
              <div className="mt-3 space-y-2 text-xs">
                <p className="text-muted-foreground">Run the following commands in terminal to start development:</p>
                <pre className="rounded-xl border-2 border-ink bg-ink text-background p-4 font-mono">
                  {`# Install dependencies
npm install

# Run local development server
npm run dev

# Build production bundle
npm run build`}
                </pre>
              </div>
            </div>

            {/* Section 3: Admin Login & Access Control */}
            <div>
              <h2 className="font-display text-2xl font-bold flex items-center gap-2 border-b-2 border-ink/20 pb-2">
                <Lock className="h-6 w-6 text-coral" /> 3. Admin Login & Authentication
              </h2>
              <p className="mt-3 text-muted-foreground">
                The public portfolio stays accessible to all visitors without login. Admin authentication is restricted to the `/admin` portal.
              </p>
              <div className="mt-3 rounded-xl border border-ink bg-sun/20 p-3 text-xs font-semibold">
                🔑 Default Admin Passcode: <code className="bg-card border border-ink px-2 py-0.5 rounded">admin123</code> or <code className="bg-card border border-ink px-2 py-0.5 rounded">admin</code>
              </div>
            </div>

            {/* Section 4: Lead CRM & Content Management */}
            <div>
              <h2 className="font-display text-2xl font-bold flex items-center gap-2 border-b-2 border-ink/20 pb-2">
                <Database className="h-6 w-6 text-bubble text-ink" /> 4. Lead CRM & Content Management
              </h2>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground list-disc pl-5">
                <li>
                  <strong className="text-foreground">Lead Management:</strong> All contact form inquiries, chatbot sessions, and consultation bookings are consolidated in the `/admin` Lead CRM with status toggles (New, Contacted, In Progress, Archived).
                </li>
                <li>
                  <strong className="text-foreground">Project Manager:</strong> Add, edit, reorder, feature, or delete showcase projects dynamically.
                </li>
                <li>
                  <strong className="text-foreground">Blog Manager:</strong> Draft, publish, schedule, or categorize articles with SEO metadata.
                </li>
              </ul>
            </div>

            {/* Section 5: Backup & Deployment */}
            <div>
              <h2 className="font-display text-2xl font-bold flex items-center gap-2 border-b-2 border-ink/20 pb-2">
                <Server className="h-6 w-6 text-violet text-ink" /> 5. Backup, Restore & Deployment
              </h2>
              <p className="mt-3 text-muted-foreground text-xs">
                To back up full site content, navigate to <Link to="/admin" className="text-coral font-bold underline">/admin</Link> and select **Backup & Restore**. Clicking "Download Backup JSON" generates a complete snapshot file. To deploy to Vercel, Netlify, or Cloudflare, connect your GitHub repository and run <code className="font-mono">npm run build</code>.
              </p>
            </div>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
