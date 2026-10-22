"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  FolderGit2,
  GraduationCap,
  Mail,
  Menu,
  X,
  Rss,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle"; // <-- Imported ThemeToggle
import Link from "next/link";

const links = [
  { href: "/#projects", label: "Projects", icon: FolderGit2 },
  { href: "/blog", label: "Updates", icon: Rss }, // Added Blog to nav
  { href: "/#timeline", label: "Experience", icon: GraduationCap },
  { href: "/#contact", label: "Contact", icon: Mail },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link
          href="/#top"
          className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight"
        >
          <Terminal className="h-4 w-4 text-primary" />
          <span className="text-glow text-primary">ahmad</span>
          <span className="text-muted-foreground">@idris</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <l.icon className="h-3.5 w-3.5 transition-colors group-hover:text-primary" />
              {l.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="ml-2 mr-2 rounded-md border border-border/60 px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            admin
          </Link>

          {/* Desktop Theme Toggle */}
          <div className="border-l border-border/60 pl-3">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile controls (Toggle + Menu Button) */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Mobile Theme Toggle */}
          <ThemeToggle />

          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-3">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 font-mono text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                >
                  <l.icon className="h-4 w-4 text-primary" />
                  {l.label}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2.5 font-mono text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              >
                <Terminal className="h-4 w-4 text-primary" />
                Admin Panel
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
