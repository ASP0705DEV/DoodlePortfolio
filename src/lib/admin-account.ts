import { supabase } from "@/integrations/supabase/client";

export type AdminProfile = {
  id?: string;
  username: string;
  display_name: string;
  email: string;
  avatar_url: string;
  role: "admin" | "editor";
  last_login_at?: string;
  created_at?: string;
};

export type LoginAuditEntry = {
  id: string;
  user_email: string;
  ip_address: string;
  user_agent: string;
  status: "success" | "failed";
  logged_at: string;
};

const ADMIN_PROFILE_STORAGE_KEY = "doodle_admin_profile_cache";

export const defaultAdminProfile: AdminProfile = {
  username: "ASP0705",
  display_name: "Sai Prithvi",
  email: "saiprithvi0705@gmail.com",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  role: "admin",
  last_login_at: new Date().toISOString(),
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
};

/** Helper to convert Google Drive view/sharing URLs into direct, web-embeddable image URLs */
export function formatProfileImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== "string") return defaultAdminProfile.avatar_url;
  const trimmed = url.trim();
  if (!trimmed) return defaultAdminProfile.avatar_url;

  if (trimmed.includes("drive.google.com") || trimmed.includes("docs.google.com")) {
    const fileIdMatch =
      trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/id=([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);

    if (fileIdMatch && fileIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}=s1000`;
    }
  }

  return trimmed;
}

export function getAdminProfileLocal(): AdminProfile {
  if (typeof window === "undefined") return defaultAdminProfile;
  try {
    const raw = localStorage.getItem(ADMIN_PROFILE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return defaultAdminProfile;
}

export function saveAdminProfileLocal(profile: AdminProfile): AdminProfile {
  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }
  return profile;
}

export async function fetchAdminProfileFromSupabase(email: string): Promise<AdminProfile> {
  try {
    const { data, error } = await supabase
      .from("admin_profiles")
      .select("*")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (!error && data) {
      const fetched: AdminProfile = {
        id: data.id,
        username: data.username || "ASP0705",
        display_name: data.display_name || "Sai Prithvi",
        email: data.email || email,
        avatar_url: data.avatar_url || defaultAdminProfile.avatar_url,
        role: (data.role as "admin" | "editor") || "admin",
        last_login_at: data.last_login_at || new Date().toISOString(),
        created_at: data.created_at,
      };
      saveAdminProfileLocal(fetched);
      return fetched;
    }
  } catch (err) {
    console.warn("Could not fetch remote admin profile:", err);
  }
  return getAdminProfileLocal();
}

export async function updateAdminProfileInSupabase(profile: AdminProfile): Promise<AdminProfile> {
  saveAdminProfileLocal(profile);

  try {
    await supabase.from("admin_profiles").upsert(
      {
        username: profile.username,
        display_name: profile.display_name,
        email: profile.email.toLowerCase(),
        avatar_url: profile.avatar_url,
        role: profile.role,
        updated_at: new Date().toISOString(),
      } as never,
      { onConflict: "email" }
    );
  } catch (err) {
    console.warn("Could not sync admin profile to Supabase:", err);
  }

  return profile;
}

export async function logAdminLoginAudit(email: string, status: "success" | "failed" = "success") {
  if (typeof window === "undefined") return;

  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "Browser";
  const entry: LoginAuditEntry = {
    id: "audit_" + Date.now().toString(36),
    user_email: email,
    ip_address: "127.0.0.1",
    user_agent: ua,
    status,
    logged_at: new Date().toISOString(),
  };

  try {
    const existing: LoginAuditEntry[] = JSON.parse(localStorage.getItem("doodle_admin_login_audits") || "[]");
    localStorage.setItem("doodle_admin_login_audits", JSON.stringify([entry, ...existing].slice(0, 50)));
  } catch {
    /* ignore */
  }

  try {
    await supabase.from("login_audit_logs").insert({
      user_email: email,
      user_agent: ua,
      status,
    });
  } catch {
    /* ignore */
  }
}

export function fetchLoginAuditLogs(): LoginAuditEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("doodle_admin_login_audits");
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return [];
}
