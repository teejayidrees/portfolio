"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Placeholder aesthetic images — swap these URLs with yours later!
const images = [
  {
    url: "https://res.cloudinary.com/dsdi7vlqw/image/upload/v1792675615/xnepbtjtgptvktmponcd.jpg",
    rotation: "-rotate-3",
  },
  {
    url: "https://res.cloudinary.com/dsdi7vlqw/image/upload/v1792675657/xbxg5nf64qkwb3lmou2w.jpg",
    rotation: "rotate-2",
  },
  {
    url: "https://res.cloudinary.com/dsdi7vlqw/image/upload/v1792675685/idyedn1zqnz4n07mueud.jpg",
    rotation: "-rotate-2",
  },
  {
    url: "https://res.cloudinary.com/dsdi7vlqw/image/upload/v1792675711/lui5hcxjeknb0sk7a4tk.jpg",
    rotation: "rotate-3",
  },
  {
    url: "https://res.cloudinary.com/dsdi7vlqw/image/upload/v1792675736/lus8egvr5vzwy1kwavzo.jpg",
    rotation: "-rotate-1",
  },
  {
    url: "https://res.cloudinary.com/dsdi7vlqw/image/upload/v1792675758/f0sglshbwdyl9v9oojtu.jpg",
    rotation: "rotate-1",
  },

  // Existing placeholders
  {
    url: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=800",
    rotation: "-rotate-3",
  },
  {
    url: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?q=80&w=800",
    rotation: "rotate-2",
  },
  {
    url: "https://images.unsplash.com/photo-1508138221679-760a23a2285b?q=80&w=800",
    rotation: "-rotate-1",
  },
];

export default function AishaPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background pt-24 pb-20 selection:bg-rose-500/30">
      {/* Soft Romantic Ambient Glows */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-rose-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 top-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[100px]" />

      <div className="mx-auto max-w-4xl px-5 text-center">
        {/* Header Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <div className="mb-4 flex items-center justify-center gap-2 text-rose-400">
            <Sparkles className="h-4 w-4" />
            <span className="font-mono text-xs tracking-widest uppercase">
              For You
            </span>
            <Sparkles className="h-4 w-4" />
          </div>

          <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Aisha
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            To the one who makes everything a little brighter, a little warmer,
            and a lot more beautiful. Here is a small collection of moments,
            just because you deserve your own space in my world.
          </p>
        </motion.div>

        {/* Polaroid Collage */}
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`group relative aspect-[4/5] overflow-hidden rounded-xl border-[6px] border-white bg-white shadow-xl transition-all duration-300 hover:z-10 hover:rotate-0 hover:scale-105 sm:${img.rotation} dark:border-secondary dark:bg-secondary`}
            >
              <Image
                fill
                src={img.url}
                alt={`Beautiful moment ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Subtle hover overlay */}
              <div className="absolute inset-0 bg-rose-500/0 transition-colors duration-300 group-hover:bg-rose-500/10" />
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-20 flex flex-col items-center justify-center gap-4"
        >
          <Heart className="h-6 w-6 animate-pulse text-rose-500 fill-rose-500/50" />
          <Link
            href="/"
            className="font-mono text-xs text-muted-foreground transition-colors hover:text-rose-400"
          >
            cd ..
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
