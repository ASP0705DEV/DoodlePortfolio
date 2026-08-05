import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ProfileSettings = {
  name: string;
  tagline: string;
  roles: string[];
  company: string;
  company_url: string;
  about: string;
  email: string;
  resume_url: string;
  github: string;
  linkedin: string;
  github_username: string;
  location: string;
};

export type SectionToggles = Record<string, boolean>;

export const defaultProfile: ProfileSettings = {
  name: "Sai Prithvi",
  tagline: "Full Stack Developer crafting intelligent, agentic software.",
  roles: ["Full Stack Developer", "Agentic AI Developer"],
  company: "Gagellan Global Solutions",
  company_url: "https://gagellan.com/",
  about: "",
  email: "",
  resume_url: "",
  github: "https://github.com/Sai0705",
  linkedin: "https://www.linkedin.com/in/adapa-sai-prithvi-062413413",
  github_username: "Sai0705",
  location: "India",
};

export function useSetting<T>(key: string, fallback: T) {
  return useQuery({
    queryKey: ["setting", key],
    queryFn: async (): Promise<T> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      if (error) throw error;
      return ((data?.value as T) ?? fallback) as T;
    },
    initialData: fallback,
  });
}

import { useCMSContent } from "@/lib/cms-store";

function extractGithubUsername(githubUrl: string): string {
  if (!githubUrl) return "codeping0705";
  const clean = githubUrl.trim().replace(/\/$/, "");
  const parts = clean.split("/");
  const last = parts[parts.length - 1];
  return last && last !== "github.com" ? last : "codeping0705";
}

export function useProfile() {
  const cms = useCMSContent();
  return {
    data: {
      name: cms.hero.name,
      tagline: cms.hero.tagline,
      roles: cms.hero.roles,
      company: cms.hero.company,
      company_url: cms.hero.company_url,
      about: cms.about.bio,
      email: cms.about.email,
      resume_url: cms.about.resume_url,
      github: cms.social_links.github,
      linkedin: cms.social_links.linkedin,
      github_username: extractGithubUsername(cms.social_links.github || cms.about.github),
      location: cms.about.location,
    },
  };
}

const defaultSections: SectionToggles = {
  about: true,
  stack: true,
  projects: true,
  ai: true,
  github: true,
  playground: true,
  newsletter: true,
  contact: true,
};

export function useSections() {
  const q = useSetting<SectionToggles>("sections", {
    about: true,
    stack: true,
    projects: true,
    ai: true,
    github: true,
    playground: true,
    newsletter: true,
    contact: true,
  });
  return { ...q, data: q.data ?? defaultSections };
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useExperience() {
  return useQuery({
    queryKey: ["experience"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export type GithubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics?: string[];
};

export function useGithub(username: string) {
  return useQuery({
    queryKey: ["github", username],
    enabled: !!username,
    staleTime: 1000 * 60 * 10,
    retry: false,
    queryFn: async () => {
      try {
        const [userRes, repoRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`),
        ]);
        if (!userRes.ok || !repoRes.ok) {
          return {
            user: { public_repos: 0, followers: 0, following: 0, avatar_url: "", bio: null },
            repos: [],
          };
        }
        const user = (await userRes.json()) as {
          public_repos: number;
          followers: number;
          following: number;
          avatar_url: string;
          bio: string | null;
        };
        const repos = (await repoRes.json()) as GithubRepo[];
        return { user, repos };
      } catch {
        return {
          user: { public_repos: 0, followers: 0, following: 0, avatar_url: "", bio: null },
          repos: [],
        };
      }
    },
  });
}
