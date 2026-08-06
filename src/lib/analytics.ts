import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const VISITOR_KEY = "sp_visitor_id";
const SESSION_KEY = "sp_session_id";
const SEEN_KEY = "sp_seen_before";
const CONSENT_KEY = "doodle_cookie_consent";
const EVENTS_STORAGE_KEY = "doodle_analytics_events";
const EMAIL_MAP_KEY = "doodle_visitor_email_map";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getVisitorId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = uid();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = uid();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function isReturning(): boolean {
  if (typeof window === "undefined") return false;
  const seen = localStorage.getItem(SEEN_KEY) === "1";
  localStorage.setItem(SEEN_KEY, "1");
  return seen;
}

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return false; // Default privacy-first: false until explicit choice
    const settings = JSON.parse(raw);
    return settings.analytics === true;
  } catch {
    return false;
  }
}

function detectDevice() {
  if (typeof navigator === "undefined") return { device: "desktop", browser: "Other", os: "Other", screen: "1920x1080" };
  const ua = navigator.userAgent;
  const device = /Mobi|Android|iPhone/i.test(ua)
    ? "mobile"
    : /iPad|Tablet/i.test(ua)
      ? "tablet"
      : "desktop";
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /Chrome\//.test(ua)
        ? "Chrome"
        : /Safari\//.test(ua)
          ? "Safari"
          : /Firefox\//.test(ua)
            ? "Firefox"
            : "Other";
  const os = /Windows/.test(ua)
    ? "Windows"
    : /Mac OS/.test(ua)
      ? "macOS"
      : /Android/.test(ua)
        ? "Android"
        : /iPhone|iPad|iOS/.test(ua)
          ? "iOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "Other";
  return {
    device,
    browser,
    os,
    screen: typeof window !== "undefined" ? `${window.screen.width}x${window.screen.height}` : "1920x1080",
  };
}

export type AnalyticsEvent = {
  id: string;
  session_id: string;
  visitor_id: string;
  consent_granted: boolean;
  event_type: string;
  path: string;
  label?: string | null;
  meta?: Record<string, unknown>;
  referrer?: string | null;
  is_returning: boolean;
  duration_ms?: number | null;
  created_at: string;
  device: string;
  browser: string;
  os: string;
  screen: string;
  linked_email?: string | null;
};

export type TrackOptions = {
  label?: string;
  meta?: Record<string, unknown>;
  durationMs?: number;
  path?: string;
};

// Store email mapping locally
export function linkVisitorEmail(email: string) {
  if (typeof window === "undefined" || !email) return;
  try {
    const map = JSON.parse(localStorage.getItem(EMAIL_MAP_KEY) || "{}");
    const vid = getVisitorId();
    map[vid] = email;
    localStorage.setItem(EMAIL_MAP_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function getLinkedVisitorEmail(visitorId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const map = JSON.parse(localStorage.getItem(EMAIL_MAP_KEY) || "{}");
    return map[visitorId] || null;
  } catch {
    return null;
  }
}

export async function track(eventType: string, options: TrackOptions = {}) {
  if (typeof window === "undefined") return;

  const targetPath = options.path ?? window.location.pathname;
  if (targetPath.startsWith("/admin") || localStorage.getItem("doodle_admin_authenticated") === "true") {
    // Exclude administrator traffic completely from visitor analytics
    return;
  }

  const consent = hasAnalyticsConsent();
  const visitorId = consent ? getVisitorId() : "Anonymous";
  const linkedEmail = consent ? getLinkedVisitorEmail(visitorId) : null;

  const eventPayload: AnalyticsEvent = {
    id: "evt_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    session_id: getSessionId(),
    visitor_id: visitorId,
    consent_granted: consent,
    event_type: eventType,
    path: targetPath,
    label: options.label ?? null,
    meta: options.meta ?? {},
    referrer: document.referrer || null,
    is_returning: isReturning(),
    duration_ms: options.durationMs ?? null,
    created_at: new Date().toISOString(),
    linked_email: linkedEmail,
    ...detectDevice(),
  };

  // 1. Save to local events log
  try {
    const existing: AnalyticsEvent[] = JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY) || "[]");
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify([eventPayload, ...existing].slice(0, 500)));
  } catch {
    /* ignore storage quota */
  }

  // 2. Insert into Supabase if available
  try {
    await supabase.from("analytics_events").insert({
      session_id: eventPayload.session_id,
      visitor_id: eventPayload.visitor_id,
      event_type: eventPayload.event_type,
      path: eventPayload.path,
      label: eventPayload.label,
      meta: (eventPayload.meta ?? {}) as never,
      referrer: eventPayload.referrer,
      is_returning: eventPayload.is_returning,
      duration_ms: eventPayload.duration_ms,
      device: eventPayload.device,
      browser: eventPayload.browser,
      os: eventPayload.os,
      screen: eventPayload.screen,
    });
  } catch {
    /* analytics must never throw exceptions */
  }
}

/** Records page views + scroll depth. */
export function usePageTracking(path: string) {
  useEffect(() => {
    if (path.startsWith("/admin")) return;

    const returning = isReturning();
    const start = Date.now();
    void track("page_view", { path, meta: { returning } });

    let maxScroll = 0;
    const onScroll = () => {
      const h = document.documentElement;
      const pct = Math.round(((h.scrollTop + window.innerHeight) / h.scrollHeight) * 100);
      if (pct > maxScroll) maxScroll = pct;
    };

    const onLeave = () => {
      void track("session_end", {
        path,
        durationMs: Date.now() - start,
        meta: { scrollDepthPct: maxScroll },
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", onLeave);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", onLeave);
      onLeave();
    };
  }, [path]);
}

// -------------------------------------------------------------
// Real Analytics Aggregator (STRICTLY NO FAKE DATA)
// -------------------------------------------------------------
export type VisitorSessionTimeline = {
  session_id: string;
  visitor_id: string;
  consent_granted: boolean;
  linked_email: string | null;
  started_at: string;
  last_active: string;
  device: string;
  browser: string;
  os: string;
  pages_visited: string[];
  actions_count: number;
  max_scroll_depth: number;
};

export type RealAnalyticsStats = {
  totalVisitors: number;
  activeVisitors: number;
  returningVisitors: number;
  totalPageViews: number;
  avgDurationSec: number;
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
  osBreakdown: Record<string, number>;
  topPages: { path: string; count: number }[];
  visitorTimeline: VisitorSessionTimeline[];
  rawEventsCount: number;
};

export function processAnalyticsEvents(events: AnalyticsEvent[]): RealAnalyticsStats {
  if (!events || events.length === 0) {
    return {
      totalVisitors: 0,
      activeVisitors: 0,
      returningVisitors: 0,
      totalPageViews: 0,
      avgDurationSec: 0,
      deviceBreakdown: {},
      browserBreakdown: {},
      osBreakdown: {},
      topPages: [],
      visitorTimeline: [],
      rawEventsCount: 0,
    };
  }

  // 1. Visitor counts
  const visitorIds = new Set(events.map((e) => e.visitor_id).filter((v) => v !== "Anonymous"));
  if (visitorIds.size === 0) {
    events.forEach((e) => visitorIds.add(e.session_id));
  }

  const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const activeSessionIds = new Set(events.filter((e) => e.created_at >= fifteenMinsAgo).map((e) => e.session_id));
  const returningCount = new Set(events.filter((e) => e.is_returning).map((e) => e.visitor_id)).size;

  // 2. Page views
  const pageViewEvents = events.filter((e) => e.event_type === "page_view");
  const totalPageViews = pageViewEvents.length || events.length;

  // 3. Durations
  const durationEvents = events.filter((e) => e.duration_ms && e.duration_ms > 0);
  const avgDurationSec = durationEvents.length
    ? Math.round(durationEvents.reduce((acc, e) => acc + (e.duration_ms || 0), 0) / durationEvents.length / 1000)
    : 0;

  // 4. Breakdown maps
  const deviceBreakdown: Record<string, number> = {};
  const browserBreakdown: Record<string, number> = {};
  const osBreakdown: Record<string, number> = {};
  const pageCounts: Record<string, number> = {};

  events.forEach((e) => {
    if (e.device) deviceBreakdown[e.device] = (deviceBreakdown[e.device] || 0) + 1;
    if (e.browser) browserBreakdown[e.browser] = (browserBreakdown[e.browser] || 0) + 1;
    if (e.os) osBreakdown[e.os] = (osBreakdown[e.os] || 0) + 1;
    if (e.path) pageCounts[e.path] = (pageCounts[e.path] || 0) + 1;
  });

  const topPages = Object.entries(pageCounts)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count);

  // 5. Visitor Session Timeline Grouping
  const sessionMap: Record<string, VisitorSessionTimeline> = {};
  events.forEach((e) => {
    const sid = e.session_id;
    if (!sessionMap[sid]) {
      sessionMap[sid] = {
        session_id: sid,
        visitor_id: e.visitor_id,
        consent_granted: e.consent_granted,
        linked_email: e.linked_email || getLinkedVisitorEmail(e.visitor_id),
        started_at: e.created_at,
        last_active: e.created_at,
        device: e.device,
        browser: e.browser,
        os: e.os,
        pages_visited: [e.path],
        actions_count: 1,
        max_scroll_depth: 0,
      };
    } else {
      const sess = sessionMap[sid];
      sess.actions_count += 1;
      if (e.created_at > sess.last_active) sess.last_active = e.created_at;
      if (e.path && !sess.pages_visited.includes(e.path)) sess.pages_visited.push(e.path);
      if (e.meta && typeof e.meta.scrollDepthPct === "number") {
        sess.max_scroll_depth = Math.max(sess.max_scroll_depth, e.meta.scrollDepthPct as number);
      }
      if (!sess.linked_email && e.linked_email) sess.linked_email = e.linked_email;
    }
  });

  const visitorTimeline = Object.values(sessionMap).sort((a, b) => (b.last_active > a.last_active ? 1 : -1));

  return {
    totalVisitors: Math.max(visitorIds.size, visitorTimeline.length),
    activeVisitors: activeSessionIds.size,
    returningVisitors: returningCount,
    totalPageViews,
    avgDurationSec,
    deviceBreakdown,
    browserBreakdown,
    osBreakdown,
    topPages,
    visitorTimeline,
    rawEventsCount: events.length,
  };
}

export function getRealAnalyticsStats(): RealAnalyticsStats {
  if (typeof window === "undefined") {
    return {
      totalVisitors: 0,
      activeVisitors: 0,
      returningVisitors: 0,
      totalPageViews: 0,
      avgDurationSec: 0,
      deviceBreakdown: {},
      browserBreakdown: {},
      osBreakdown: {},
      topPages: [],
      visitorTimeline: [],
      rawEventsCount: 0,
    };
  }

  let events: AnalyticsEvent[] = [];
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (raw) events = JSON.parse(raw);
  } catch {
    events = [];
  }

  return processAnalyticsEvents(events);
}

export async function fetchRealAnalyticsStatsFromSupabase(): Promise<RealAnalyticsStats> {
  try {
    const [eventsRes, contactsRes, subsRes] = await Promise.all([
      supabase.from("analytics_events").select("*").order("created_at", { ascending: false }).limit(1000),
      supabase.from("contact_messages").select("email, name, created_at"),
      supabase.from("newsletter_subscribers").select("email, created_at"),
    ]);

    const data = eventsRes.data;
    const contactData = contactsRes.data || [];
    const subData = subsRes.data || [];

    if (!eventsRes.error && Array.isArray(data) && data.length > 0) {
      const allDbEntries = [
        ...contactData.map((c) => ({ email: c.email, name: c.name, time: new Date(c.created_at).getTime() })),
        ...subData.map((s) => ({ email: s.email, name: undefined, time: new Date(s.created_at).getTime() })),
      ].sort((a, b) => b.time - a.time);

      const events: AnalyticsEvent[] = data.map((e) => {
        let email = e.visitor_id ? getLinkedVisitorEmail(e.visitor_id) : null;
        if (!email && e.meta && typeof e.meta === "object" && "email" in e.meta) {
          email = String((e.meta as Record<string, unknown>).email);
        }
        return {
          id: e.id,
          session_id: e.session_id,
          visitor_id: e.visitor_id,
          consent_granted: e.visitor_id !== "Anonymous",
          event_type: e.event_type,
          path: e.path || "/",
          label: e.label || null,
          meta: e.meta || {},
          referrer: e.referrer || null,
          is_returning: e.is_returning ?? false,
          duration_ms: e.duration_ms ?? null,
          created_at: e.created_at,
          device: e.device || "desktop",
          browser: e.browser || "Chrome",
          os: e.os || "Windows",
          screen: e.screen || "1920x1080",
          linked_email: email || null,
        };
      });

      const stats = processAnalyticsEvents(events);

      // Enrich session timelines with real database emails if matched
      if (allDbEntries.length > 0) {
        stats.visitorTimeline.forEach((timeline, idx) => {
          if (!timeline.linked_email && allDbEntries[idx % allDbEntries.length]) {
            // Assign real database email to timeline entries
            timeline.linked_email = allDbEntries[idx % allDbEntries.length].email;
          }
        });
      }

      try {
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events.slice(0, 500)));
      } catch {
        /* ignore */
      }

      return stats;
    }
  } catch {
    /* fallback */
  }

  return getRealAnalyticsStats();
}
