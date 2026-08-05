import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Mail, Send } from "lucide-react";
import { Reveal, Section, SectionHeading, MagneticButton } from "@/components/ui-kit";
import { DoodleCloud, DoodleStar } from "@/components/doodles";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";
import { useProfile } from "@/lib/portfolio";

const subscribeSchema = z.object({
  email: z.string().trim().email("That email looks a little sketchy").max(255),
  name: z.string().trim().max(80).optional(),
});

const contactSchema = z.object({
  name: z.string().trim().min(1, "Your name please").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().max(150),
  message: z.string().trim().min(5, "Tell me a bit more").max(2000),
});

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = subscribeSchema.safeParse({ email, name });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: parsed.data.email,
      name: parsed.data.name || null,
    });
    setBusy(false);
    if (error) {
      toast.error(
        error.code === "23505" ? "You're already on the list!" : "Could not subscribe, try again.",
      );
      return;
    }
    void track("newsletter_subscribe");
    setEmail("");
    setName("");
    toast.success("You're in! New projects and AI notes are heading your way.");
  };

  return (
    <Section id="newsletter">
      <Reveal className="relative overflow-hidden rounded-3xl border-2 border-ink bg-sun p-8 doodle-shadow-lg sm:p-12">
        <DoodleCloud className="absolute -right-6 -top-6 h-24 w-36 text-ink/15" />
        <DoodleStar className="wobble absolute bottom-4 left-6 h-10 w-10 text-ink/20" />
        <div className="relative max-w-xl">
          <span className="hand text-2xl">the occasional dispatch</span>
          <h2 className="mt-1 text-4xl">Get new projects & AI notes</h2>
          <p className="mt-3 text-sm">
            No spam, no growth hacks. Just new builds, agentic experiments and things I learn
            the hard way.
          </p>
          <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name (optional)"
              className="rounded-2xl border-2 border-ink bg-card px-4 py-3 text-sm outline-none sm:w-40"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="you@example.com"
              className="flex-1 rounded-2xl border-2 border-ink bg-card px-4 py-3 text-sm outline-none"
            />
            <MagneticButton type="submit" className="bg-ink text-background">
              <Mail className="h-4 w-4" /> {busy ? "…" : "Subscribe"}
            </MagneticButton>
          </form>
        </div>
      </Reveal>
    </Section>
  );
}

export function Contact() {
  const { data: profile } = useProfile();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onIntent = (e: Event) => {
      const subject = (e as CustomEvent<string>).detail;
      if (typeof subject === "string") setForm((f) => ({ ...f, subject }));
    };
    window.addEventListener("collab-intent", onIntent);
    return () => window.removeEventListener("collab-intent", onIntent);
  }, []);


  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setBusy(true);
    const { linkVisitorEmail } = await import("@/lib/analytics");
    const { submitLead } = await import("@/lib/cms-store");
    linkVisitorEmail(parsed.data.email);

    await submitLead({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
      source: "contact_form",
    });

    setBusy(false);
    void track("contact_submit");
    setForm({ name: "", email: "", subject: "", message: "" });
    toast.success("Message sent! I'll get back to you soon.");
  };

  return (
    <Section id="contact">
      <SectionHeading
        kicker="let's build something"
        title="Say hello"
        subtitle="Collaboration, freelance work, agentic AI ideas or just a good technical conversation."
        accent="text-coral"
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <Reveal className="doodle-card p-7">
          <form onSubmit={submit} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Your name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
              />
            </div>
            <Field
              label="Subject"
              value={form.subject}
              onChange={(v) => setForm({ ...form, subject: v })}
            />
            <label className="grid gap-1.5">
              <span className="text-sm font-bold">Message</span>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="rounded-2xl border-2 border-ink bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <MagneticButton type="submit" className="justify-self-start bg-coral text-coral-foreground">
              <Send className="h-4 w-4" /> {busy ? "Sending…" : "Send message"}
            </MagneticButton>
          </form>
        </Reveal>

        <div className="grid gap-4">
          <Reveal delay={0.1} className="rounded-2xl border-2 border-ink bg-mint p-6 doodle-shadow">
            <h3 className="text-xl">Currently</h3>
            <p className="mt-2 text-sm">
              Founder & Lead Engineer at <strong className="font-bold underline">ASP0705DEV</strong> and Software Developer at Gagellan Global Solutions. Open to full stack software collaborations and Agentic/GenAI projects.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="rounded-2xl border-2 border-ink bg-bubble p-6 doodle-shadow">
            <h3 className="text-xl">Find me here</h3>
            <div className="mt-3 grid gap-2 text-sm font-semibold">
              <a href={profile.github} target="_blank" rel="noreferrer" className="underline">
                github.com/{profile.github_username}
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="underline">
                LinkedIn
              </a>
              {profile.email ? <a href={`mailto:${profile.email}`} className="underline">{profile.email}</a> : null}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-2xl border-2 border-ink bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}
