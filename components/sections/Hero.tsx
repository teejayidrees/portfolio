"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Terminal, ChevronDown } from "lucide-react";

const bioLines = [
  { prompt: "$", text: "who-am-i", out: "Ahmad-Idris" },
  { prompt: "$", text: "role", out: "Web Developer (MERN / Next.js)" },
  {
    prompt: "$",
    text: "skills",
    out: "Next.js · React · Node.js · MongoDB · IoT Enthusiast",
  },
  {
    prompt: "$",
    text: "./connect --status",
    out: "available for opportunities",
  },
];
export default function Hero() {
  // 1. Default to closed (mobile-first approach)
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  // 2. Add this effect to open it automatically on desktop sizes
  useEffect(() => {
    // 768px is the standard Tailwind 'md' breakpoint
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setIsTerminalOpen(true);
    }
  }, []);

  return (
    <section
      id="top"
      className="relative grid-bg min-h-screen overflow-hidden pt-24"
    >
      {/* Ambient glows with subtle pulse animation */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
      />

      {/* Changed layout to flex col-reverse on mobile, grid on desktop */}
      <div className="relative mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 px-5 py-16 md:grid md:grid-cols-2 md:py-24">
        {/* Left/Bottom: identity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex w-full flex-col items-center text-center md:items-start md:text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-xs text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            available for opportunities
          </span>

          <h1 className="mt-5 font-mono text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Ahmad Haruna <span className="text-glow text-primary">Idris</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">
            <span className="text-foreground">Web Developer: </span>
            (Next.js / MERN) &amp;{" "}
            <span className="text-accent">IoT Enthusiast</span>.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <a
              href="#projects"
              className="rounded-lg bg-primary px-5 py-2.5 font-mono text-sm font-medium text-primary-foreground transition-all hover:glow-primary hover:scale-105 active:scale-95"
            >
              View Projects
            </a>
            <a
              href="/cv"
              className="rounded-lg border border-primary/50 bg-primary/10 px-5 py-2.5 font-mono text-sm font-medium text-primary transition-all hover:bg-primary/20 hover:scale-105 active:scale-95"
            >
              View CV
            </a>
            <a
              href="#contact"
              className="rounded-lg border border-border px-5 py-2.5 font-mono text-sm font-medium text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground hover:scale-105 active:scale-95"
            >
              Contact
            </a>
          </div>
        </motion.div>

        {/* Right/Top: avatar + collapsible terminal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex w-full flex-col items-center gap-6"
        >
          <Avatar className="h-32 w-32 ring-2 ring-primary/40 ring-offset-2 ring-offset-background sm:h-40 sm:w-40">
            {/* Update this src to your actual Cloudinary image URL later */}
            <AvatarImage
              src="https://res.cloudinary.com/dsdi7vlqw/image/upload/v1792678465/gllk5udvwfcuw4phpozj.jpg"
              alt="Ahmad Haruna Idris"
            />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>

          {/* Collapsible Terminal component */}
          <div className="w-full max-w-md overflow-hidden rounded-xl border border-border/60 bg-card/80 shadow-2xl backdrop-blur-sm">
            <button
              onClick={() => setIsTerminalOpen(!isTerminalOpen)}
              className="flex w-full items-center justify-between border-b border-border/60 bg-secondary/40 px-4 py-2.5 transition-colors hover:bg-secondary/60 focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-destructive/70" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <span className="h-3 w-3 rounded-full bg-primary/70" />
                <span className="ml-2 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  <Terminal className="h-3 w-3" /> bash — ahmad-idris
                </span>
              </div>

              <div className="relative flex items-center justify-center">
                {/* Rotating text ring - only visible when closed */}
                <AnimatePresence>
                  {!isTerminalOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1, rotate: 360 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{
                        rotate: {
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear",
                        },
                        opacity: { duration: 0.2 },
                      }}
                      className="absolute h-10 w-10 rounded-full border border-dashed border-primary/40"
                    >
                      <svg
                        viewBox="0 0 100 100"
                        className="h-full w-full overflow-visible"
                      >
                        <path
                          id="textPath"
                          d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                          fill="transparent"
                        />
                        <text className="fill-primary/70 text-[18px] font-bold tracking-widest">
                          <textPath href="#textPath" startOffset="0%">
                            • OPEN TERMINAL • OPEN TERMINAL
                          </textPath>
                        </text>
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Chevron Icon */}
                <motion.div
                  animate={{ rotate: isTerminalOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`z-10 rounded-full bg-background/50 p-1 backdrop-blur-sm ${!isTerminalOpen ? "text-primary" : "text-muted-foreground"}`}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isTerminalOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 p-4 font-mono text-xs leading-relaxed sm:text-sm">
                    {bioLines.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.15, duration: 0.3 }}
                      >
                        <span className="text-primary">{line.prompt}</span>{" "}
                        <span className="text-foreground">{line.text}</span>
                        <div className="pl-3 text-muted-foreground">
                          › {line.out}
                        </div>
                      </motion.div>
                    ))}
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ delay: 0.8, duration: 1, repeat: Infinity }}
                      className="mt-2 inline-block h-4 w-2 bg-primary"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
