import { GitFork, Star, GitCommit } from "lucide-react";
import { Reveal, Section, SectionHeading } from "@/components/ui-kit";
import { useGithub, useProfile } from "@/lib/portfolio";
import { track } from "@/lib/analytics";

export function GithubSection() {
  const { data: profile } = useProfile();
  const { data, isLoading, isError } = useGithub(profile.github_username);

  const repos = (data?.repos ?? []).slice(0, 6);
  const totalStars = (data?.repos ?? []).reduce((s, r) => s + r.stargazers_count, 0);
  const languages = Array.from(
    new Set((data?.repos ?? []).map((r) => r.language).filter(Boolean) as string[]),
  ).slice(0, 10);

  return (
    <Section id="github">
      <SectionHeading
        kicker="live from my keyboard"
        title="GitHub activity"
        subtitle="Pulled straight from the GitHub API — this section updates itself whenever I push."
        accent="text-mint"
      />

      {isError ? (
        <p className="hand text-2xl text-muted-foreground">
          GitHub is rate-limiting me right now — try again in a minute.
        </p>
      ) : null}

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Public repos", value: data?.user.public_repos ?? "—", bg: "bg-sun" },
          { label: "Total stars", value: totalStars || "—", bg: "bg-lime" },
          { label: "Followers", value: data?.user.followers ?? "—", bg: "bg-mint" },
          { label: "Following", value: data?.user.following ?? "—", bg: "bg-bubble" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border-2 border-ink p-4 doodle-shadow-sm ${s.bg}`}>
            <div className="font-display text-3xl font-bold">{s.value}</div>
            <div className="text-xs font-semibold">{s.label}</div>
          </div>
        ))}
      </div>

      {languages.length ? (
        <div className="mb-8 flex flex-wrap gap-2">
          {languages.map((l) => (
            <span key={l} className="sticker bg-card">
              {l}
            </span>
          ))}
        </div>
      ) : null}

      <Reveal className="mb-8 overflow-hidden rounded-2xl border-2 border-ink bg-card p-5 doodle-shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-bold font-display">
            <GitCommit className="h-4 w-4 text-mint" />
            Real-Time GitHub Contributions Graph (@{profile.github_username})
          </div>
          <span className="sticker bg-mint">Live Commits</span>
        </div>
        <div className="overflow-x-auto py-2">
          <img
            src={`https://ghchart.rshah.org/10b981/${profile.github_username}`}
            alt={`${profile.github_username}'s GitHub Commit Graph`}
            className="w-full min-w-[650px]"
          />
        </div>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl border-2 border-ink bg-muted" />
            ))
          : repos.map((repo, i) => (
              <Reveal key={repo.id} delay={i * 0.05}>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => void track("click_github", { label: repo.name })}
                  className="flex h-full flex-col doodle-card doodle-card-hover p-5"
                >
                  <h3 className="font-mono text-base font-bold">{repo.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {repo.description ?? "No description yet — the code speaks for itself."}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs font-semibold">
                    {repo.language ? <span className="sticker bg-sky/30">{repo.language}</span> : null}
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" /> {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3.5 w-3.5" /> {repo.forks_count}
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
      </div>

      <div className="mt-8 text-center">
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          onClick={() => void track("click_github", { label: "github_section_cta" })}
          className="hand text-2xl underline decoration-coral decoration-wavy underline-offset-8"
        >
          see everything on GitHub →
        </a>
      </div>
    </Section>
  );
}
