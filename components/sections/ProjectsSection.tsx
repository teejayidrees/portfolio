"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { toast } from "sonner";
import {
  FolderGit2,
  TerminalSquare,
  Cpu,
  Boxes,
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Project, ProjectCategory } from "@/lib/types";
// Animation Variants
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const viewportOnce = { once: true, margin: "-100px" };
const categoryIcon: Record<ProjectCategory, typeof FolderGit2> = {
  "Software Suite": TerminalSquare,
  "Hardware Garage": Cpu,
  Sandbox: Boxes,
};

const categoryColor: Record<ProjectCategory, string> = {
  "Software Suite": "text-primary border-primary/40 bg-primary/5",
  "Hardware Garage": "text-accent border-accent/40 bg-accent/5",
  Sandbox: "text-violet-400 border-violet-400/40 bg-violet-400/5",
};

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error();
        const data: Project[] = await res.json();
        if (cancelled) return;
        setProjects(data);
      } catch {
        if (!cancelled) toast.error("Could not load projects");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const project = projects[active];
  const go = (dir: number) =>
    setActive((i) => (i + dir + projects.length) % projects.length);

  return (
    <section
      id="projects"
      className="relative mx-auto max-w-6xl px-5 py-20 md:py-28"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mb-12"
      >
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-2 font-mono text-xs text-primary"
        >
          <FolderGit2 className="h-4 w-4" /> {"// the.core.feature"}
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="mt-3 font-mono text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Interactive Project Showcase
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mt-3 max-w-xl text-sm text-muted-foreground"
        >
          Browse live video demos of each build without leaving the page. Toggle
          through projects below.
        </motion.p>
      </motion.div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="font-mono text-sm text-muted-foreground animate-pulse">
            loading projects…
          </div>
        </div>
      ) : project ? (
        <motion.div
          key={project._id}
          variants={scaleIn}
          initial="hidden"
          animate="show"
        >
          {/* Project selector tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            {projects.map((p, i) => {
              const Icon = categoryIcon[p.category] ?? FolderGit2;
              return (
                <button
                  key={p._id}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs transition-all ${
                    i === active
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {p.title}
                </button>
              );
            })}
          </div>

          {/* Desktop: macOS browser frame (hidden on mobile) */}
          <div className="hidden md:block">
            <MacBrowserFrame
              project={project}
              onPrev={() => go(-1)}
              onNext={() => go(1)}
            />
          </div>

          {/* Mobile: smartphone frame (hidden on desktop) */}
          <div className="md:hidden">
            <PhoneFrame
              project={project}
              onPrev={() => go(-1)}
              onNext={() => go(1)}
            />
          </div>

          {/* Project meta */}
          <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${categoryColor[project.category]}`}
              >
                {project.category}
              </span>
              <h3 className="mt-3 font-mono text-2xl font-bold tracking-tight">
                {project.title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.techStack.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-border/60 bg-secondary/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-row gap-3 md:flex-col">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-mono text-xs font-medium text-primary-foreground transition-all hover:glow-primary"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 font-mono text-xs font-medium text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground"
                >
                  <Github className="h-3.5 w-3.5" /> Source
                </a>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="flex h-64 items-center justify-center font-mono text-sm text-muted-foreground">
          No projects yet.
        </div>
      )}
    </section>
  );
}

/* ---------------- Desktop macOS browser frame ---------------- */

function MacBrowserFrame({
  project,
  onPrev,
  onNext,
}: {
  project: Project;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card/60 shadow-2xl">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border/60 bg-secondary/40 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-destructive/70" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
        <span className="h-3 w-3 rounded-full bg-primary/70" />
        <div className="mx-auto flex w-full max-w-sm items-center gap-2 rounded-md border border-border/50 bg-background/60 px-3 py-1 font-mono text-[11px] text-muted-foreground">
          <span className="text-primary/60">🔒</span>
          {project.liveUrl
            ? project.liveUrl.replace(/^https?:\/\//, "")
            : "localhost"}
        </div>
      </div>
      {/* Content + nav */}
      <div className="relative bg-black">
        <video
          key={project.desktopVideoUrl}
          src={project.desktopVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="aspect-video w-full object-cover"
        />
        <button
          onClick={onPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-border/60 bg-background/70 p-2 backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-primary"
          aria-label="Previous project"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={onNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-border/60 bg-background/70 p-2 backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-primary"
          aria-label="Next project"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

/* ---------------- Mobile smartphone frame ---------------- */

function PhoneFrame({
  project,
  onPrev,
  onNext,
}: {
  project: Project;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[280px] rounded-[2.5rem] border-4 border-secondary/80 bg-card p-3 shadow-2xl sm:w-[320px]">
        {/* Notch */}
        <div className="absolute left-1/2 top-3 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-secondary/80" />
        <div className="overflow-hidden rounded-[2rem] bg-black">
          <video
            key={project.mobileVideoUrl}
            src={project.mobileVideoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="aspect-[9/19] w-full object-cover"
          />
        </div>
      </div>
      <div className="mt-5 flex gap-3">
        <button
          onClick={onPrev}
          className="rounded-full border border-border/60 bg-background/70 p-2.5 backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-primary"
          aria-label="Previous project"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={onNext}
          className="rounded-full border border-border/60 bg-background/70 p-2.5 backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-primary"
          aria-label="Next project"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
