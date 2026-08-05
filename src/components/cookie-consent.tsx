import { useEffect, useState } from "react";
import { Cookie, ShieldCheck, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const CONSENT_KEY = "doodle_cookie_consent";

export type ConsentSettings = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
};

export function getConsentSettings(): ConsentSettings | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? (JSON.parse(raw) as ConsentSettings) : null;
  } catch {
    return null;
  }
}

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = getConsentSettings();
    if (!existing) {
      setShow(true);
    }
  }, []);

  const save = (all: boolean) => {
    const settings: ConsentSettings = {
      essential: true,
      analytics: all ? true : analytics,
      marketing: all ? true : marketing,
      decidedAt: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(settings));
    setShow(false);
    setShowModal(false);
  };

  return (
    <>
      <AnimatePresence>
        {show ? (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl border-2 border-ink bg-card p-5 doodle-shadow sm:bottom-6 sm:left-6"
            style={{ borderRadius: "20px 26px 20px 28px" }}
          >
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-sun text-ink">
                <Cookie className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display text-lg font-bold">Privacy & Cookie Consent</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  We use cookies and telemetry to analyze site traffic, personalize content, and record project inquiries in a GDPR-compliant manner.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => save(true)}
                    className="rounded-xl border-2 border-ink bg-mint px-4 py-1.5 text-xs font-bold doodle-shadow-sm transition-transform hover:-translate-y-0.5"
                  >
                    Accept All
                  </button>
                  <button
                    type="button"
                    onClick={() => save(false)}
                    className="rounded-xl border-2 border-ink bg-background px-4 py-1.5 text-xs font-bold doodle-shadow-sm transition-transform hover:-translate-y-0.5"
                  >
                    Essential Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="hand text-base text-coral underline underline-offset-4 ml-1"
                  >
                    Customize →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-xs">
          <div
            className="w-full max-w-md border-2 border-ink bg-card p-6 doodle-shadow"
            style={{ borderRadius: "22px 28px 22px 30px" }}
          >
            <div className="flex items-center justify-between border-b-2 border-ink/20 pb-3">
              <div className="flex items-center gap-2 font-display text-xl font-bold">
                <ShieldCheck className="h-5 w-5 text-mint" /> Privacy Preferences
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="rounded-full p-1 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="flex items-center justify-between rounded-xl border-2 border-ink/40 bg-muted/40 p-3">
                <div>
                  <div className="font-bold text-sm">Essential Cookies</div>
                  <div className="text-muted-foreground">Required for basic site navigation and security.</div>
                </div>
                <input type="checkbox" checked disabled className="h-4 w-4 rounded border-ink text-mint" />
              </div>

              <div className="flex items-center justify-between rounded-xl border-2 border-ink bg-card p-3 doodle-shadow-sm">
                <div>
                  <div className="font-bold text-sm">Analytics Telemetry</div>
                  <div className="text-muted-foreground">Anonymous page views, scroll depth, and interaction stats.</div>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="h-4 w-4 rounded border-ink text-mint accent-mint"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border-2 border-ink bg-card p-3 doodle-shadow-sm">
                <div>
                  <div className="font-bold text-sm">Marketing & Leads</div>
                  <div className="text-muted-foreground">Tracks lead inquiry origins and chatbot preferences.</div>
                </div>
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="h-4 w-4 rounded border-ink text-coral accent-coral"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => save(false)}
                className="rounded-xl border-2 border-ink bg-mint px-5 py-2 text-xs font-bold doodle-shadow-sm"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
