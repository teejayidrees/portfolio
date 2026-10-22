// components/NewsletterModal.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { X, Send, Loader2 } from "lucide-react";

export default function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Storage key to remember the user's action
  const STORAGE_KEY = "ahmad_portfolio_newsletter_seen";

  useEffect(() => {
    // Check if the user has already seen or interacted with the modal
    const hasSeenModal = localStorage.getItem(STORAGE_KEY);

    if (!hasSeenModal) {
      // 60,000 milliseconds = 60 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 60000);

      return () => clearTimeout(timer);
    }
  }, []);

  const closeAndRemember = () => {
    setIsOpen(false);
    // Remember they dismissed it so it never shows again
    localStorage.setItem(STORAGE_KEY, "true");
  };

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error();

      toast.success("You're in!", { description: "Thanks for subscribing." });
      closeAndRemember();
    } catch {
      toast.error("Failed to subscribe. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 p-4 sm:p-5 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-2xl sm:p-8"
          >
            <button
              onClick={closeAndRemember}
              className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-6 text-center">
              <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Send className="h-5 w-5 text-primary" />
              </span>
              <h3 className="font-mono text-xl font-bold">Join the Terminal</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Occasional logs on full-stack builds, hardware hacking, and dev
                insights. No spam, ever.
              </p>
            </div>

            <form onSubmit={subscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-lg border border-input bg-background/60 px-3 py-2 font-mono text-sm outline-none transition-colors focus:border-primary/50"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-mono text-xs font-medium text-primary-foreground transition-all hover:glow-primary disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Join"
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
