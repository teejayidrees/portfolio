"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Loader2 } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

type Entry = {
  _id: string;
  kind: "experience" | "education";
  title: string;
  org: string;
  period: string;
  detail: string;
};

export default function Timeline() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/journey")
      .then((res) => res.json())
      .then((data) => setEntries(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (entries.length === 0) return null;

  return (
    <section
      id="timeline"
      className="relative mx-auto max-w-4xl px-5 py-20 md:py-28"
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
          <GraduationCap className="h-4 w-4" /> {"// experience + education"}
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="mt-3 font-mono text-3xl font-bold tracking-tight sm:text-4xl"
        >
          The Journey
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mt-3 max-w-xl text-sm text-muted-foreground"
        >
          A timeline of where I have worked and studied.
        </motion.p>
      </motion.div>

      <div className="relative">
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary/60 via-border to-transparent md:left-1/2" />

        <div className="space-y-10">
          {entries.map((entry, i) => {
            const Icon =
              entry.kind === "experience" ? Briefcase : GraduationCap;
            return (
              <motion.div
                key={entry._id}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                className={`relative flex gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="absolute left-4 z-10 -translate-x-1/2 md:left-1/2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </div>

                <div
                  className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pl-12" : "md:pr-12 md:text-right"}`}
                >
                  <div className="rounded-xl border border-border/60 bg-card/60 p-5 transition-colors hover:border-primary/30">
                    <span className="font-mono text-[11px] text-primary">
                      {entry.period}
                    </span>
                    <h3 className="mt-1.5 font-mono text-base font-semibold tracking-tight">
                      {entry.title}
                    </h3>
                    <p className="mt-0.5 font-mono text-xs text-accent">
                      {entry.org}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                      {entry.detail}
                    </p>
                  </div>
                </div>

                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
