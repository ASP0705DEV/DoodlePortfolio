import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, PhoneCall, Check, ExternalLink, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { submitLead } from "@/lib/cms-store";
import { track } from "@/lib/analytics";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
  options?: { label: string; action: string }[];
};

const WHATSAPP_NUMBER = "917070362117";

export function DoodleChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hey there! I'm Sai's AI Assistant. How can I help you today?",
      options: [
        { label: "Recommend a Project", action: "recommend" },
        { label: "Explore Services", action: "services" },
        { label: "Book a Consultation", action: "consult" },
        { label: "Chat on WhatsApp", action: "whatsapp" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [leadForm, setLeadForm] = useState({ name: "", email: "", subject: "Project Inquiry", message: "" });
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showForm]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");

    void track("chatbot_message_sent", { label: query });

    setTimeout(() => {
      respondToUser(query.toLowerCase());
    }, 600);
  };

  const respondToUser = (q: string) => {
    let replyText = "";
    let opts: { label: string; action: string }[] | undefined;

    if (q.includes("recommend") || q.includes("project") || q.includes("work")) {
      replyText =
        "Sai has built impressive projects! Key highlights include:\n1. ANPR System (YOLOv8 license plate recognition)\n2. AI Smart Gate System (IoT & OpenCV access control)\n3. Pixmate (AI image background remover)\n4. MentorHive (1-on-1 mentorship platform with 100+ mentors)\n\nWhich category would you like to explore deeper?";
      opts = [
        { label: "See AI & Computer Vision", action: "ai_projects" },
        { label: "See Full Stack & Web", action: "web_projects" },
        { label: "Book Consultation", action: "consult" },
      ];
    } else if (q.includes("service") || q.includes("hire") || q.includes("offer")) {
      replyText =
        "Sai offers 14 core technical services including:\n• Custom Full Stack Web Applications\n• Agentic AI & RAG Vector Systems\n• E-Commerce Development\n• Business Automation & Dashboards\n• Cloud Deployment (AWS/Docker/Vercel)";
      opts = [
        { label: "Request a Quote", action: "consult" },
        { label: "Connect on WhatsApp", action: "whatsapp" },
      ];
    } else if (q.includes("consult") || q.includes("contact") || q.includes("book") || q.includes("quote")) {
      replyText = "Awesome! Let's get your project details recorded. Please fill in the brief lead inquiry form below, or connect directly via WhatsApp Business.";
      setShowForm(true);
      return;
    } else if (q.includes("whatsapp")) {
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Sai! I found your portfolio website and would like to discuss a project collaboration.")}`;
      window.open(waUrl, "_blank");
      replyText = "Opening WhatsApp to chat with Sai directly (+91 7070362117)!";
    } else {
      replyText =
        "Sai Prithvi is a Full Stack Developer & Agentic AI Systems Architect currently building digital solutions at Gagellan Global Solutions. Would you like to check his services, view projects, or leave an inquiry?";
      opts = [
        { label: "Explore Services", action: "services" },
        { label: "View Projects", action: "recommend" },
        { label: "Leave a Message", action: "consult" },
      ];
    }

    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "bot", text: replyText, options: opts }]);
  };

  const handleOptionClick = (opt: { label: string; action: string }) => {
    if (opt.action === "whatsapp") {
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Sai! I visited your portfolio website and want to discuss a project collaboration.")}`;
      window.open(waUrl, "_blank");
      void track("click_whatsapp_chatbot");
      return;
    }
    if (opt.action === "consult") {
      setShowForm(true);
      return;
    }
    handleSend(opt.label);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.email || !leadForm.name) return;

    const { linkVisitorEmail } = await import("@/lib/analytics");
    linkVisitorEmail(leadForm.email);

    await submitLead({
      name: leadForm.name,
      email: leadForm.email,
      subject: leadForm.subject,
      message: leadForm.message || "Project inquiry via AI Chatbot",
      source: "chatbot",
    });

    setFormSubmitted(true);
    setShowForm(false);
    void track("chatbot_lead_captured", { label: leadForm.email });

    // Auto generate WhatsApp link as well
    const waText = `Hi Sai! My name is ${leadForm.name} (${leadForm.email}). Project Inquiry: ${leadForm.message || leadForm.subject}`;
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "bot",
        text: `Thanks ${leadForm.name}! Your project inquiry has been saved to the CMS database. You can also send this summary directly to Sai's WhatsApp now:`,
        options: [{ label: "Send to WhatsApp (+91 7070362117)", action: "whatsapp" }],
      },
    ]);
  };

  return (
    <>
      {/* Floating Scroll To Top Button */}
      <AnimatePresence>
        {showScrollTop ? (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-24 z-40 flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-mint text-ink doodle-shadow transition-all hover:bg-lime"
            aria-label="Scroll to Top"
            title="Scroll to Top"
          >
            <ArrowUp className="h-6 w-6 stroke-[3]" />
          </motion.button>
        ) : null}
      </AnimatePresence>

      {/* Floating Chatbot Trigger Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-coral text-coral-foreground doodle-shadow transition-shadow hover:doodle-shadow-lg"
        aria-label="Open AI Assistant Chatbot"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-7 w-7" />}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-mint border border-ink"></span>
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 z-40 flex h-[520px] w-[360px] flex-col border-2 border-ink bg-card doodle-shadow sm:right-6 sm:w-[400px]"
            style={{ borderRadius: "24px 30px 24px 32px" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-ink bg-sun/40 p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-sun text-ink">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-display text-base font-bold flex items-center gap-1">
                    Sai&apos;s AI Assistant <Sparkles className="h-3.5 w-3.5 text-coral" />
                  </div>
                  <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-mint" /> Online · WhatsApp Sync
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-ink hover:bg-ink/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl border-2 border-ink p-3 text-xs leading-relaxed ${
                      m.sender === "user" ? "bg-coral text-coral-foreground" : "bg-background text-foreground"
                    }`}
                    style={{ borderRadius: m.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px" }}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                  </div>

                  {m.options ? (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                      {m.options.map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => handleOptionClick(opt)}
                          className="rounded-xl border-2 border-ink bg-card px-2.5 py-1 text-[11px] font-bold doodle-shadow-sm transition-transform hover:-translate-y-0.5"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}

              {/* Lead Capture Inline Form */}
              {showForm ? (
                <form
                  onSubmit={handleFormSubmit}
                  className="rounded-2xl border-2 border-ink bg-mint/20 p-3 text-xs space-y-2 doodle-shadow-sm"
                >
                  <div className="font-bold font-display text-sm flex items-center gap-1.5"><PhoneCall className="h-3.5 w-3.5" /> Book Consultation / Inquiry</div>
                  <input
                    required
                    placeholder="Your Name *"
                    value={leadForm.name}
                    onChange={(e) => setLeadForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full rounded-xl border border-ink bg-card p-2 outline-none"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Your Email *"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full rounded-xl border border-ink bg-card p-2 outline-none"
                  />
                  <textarea
                    rows={2}
                    placeholder="Describe your project idea..."
                    value={leadForm.message}
                    onChange={(e) => setLeadForm((p) => ({ ...p, message: e.target.value }))}
                    className="w-full rounded-xl border border-ink bg-card p-2 outline-none resize-none"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="rounded-lg border border-ink px-3 py-1 bg-card text-[11px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg border border-ink bg-coral text-coral-foreground px-3 py-1 font-bold text-[11px]"
                    >
                      Save Lead
                    </button>
                  </div>
                </form>
              ) : null}
            </div>

            {/* Input Bar */}
            <div className="border-t-2 border-ink bg-background p-3">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about AI, projects, or services..."
                  className="flex-1 rounded-xl border-2 border-ink bg-card px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  className="grid h-9 w-9 place-items-center rounded-xl border-2 border-ink bg-coral text-coral-foreground doodle-shadow-sm hover:opacity-90"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground px-1 font-semibold">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-mint-foreground font-bold hover:underline"
                >
                  <PhoneCall className="h-3 w-3" /> WhatsApp: +91 7070362117
                </a>
                <span>Powered by Agentic AI</span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
