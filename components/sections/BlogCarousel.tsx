"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Rss, ArrowRight, Image as ImageIcon } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import Image from "next/image";

interface PostType {
  _id: string;
  title: string;
  content: string;
  mediaUrl?: string;
  createdAt: string;
}

export default function BlogCarousel() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || posts.length === 0) return null; // Don't show if empty or loading

  return (
    <section className="relative mx-auto max-w-6xl px-5 py-20 overflow-hidden">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mb-8 flex items-end justify-between"
      >
        <div>
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-2 font-mono text-xs text-primary"
          >
            <Rss className="h-4 w-4" /> {"// the.broadcast"}
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mt-3 font-mono text-3xl font-bold tracking-tight"
          >
            Latest Updates
          </motion.h2>
        </div>
        <motion.div variants={fadeUp} className="hidden sm:block">
          <Link
            href="/blog"
            className="flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>

      {/* The Draggable Carousel */}
      <div className="relative -mx-5 px-5 sm:mx-0 sm:px-0">
        <div className="flex w-full overflow-x-auto pb-8 pt-4 scrollbar-hide snap-x snap-mandatory">
          <div className="flex gap-6">
            {posts.slice(0, 6).map((post) => (
              <Link
                href={`/blog/${post._id}`}
                key={post._id}
                className="group relative flex w-72 shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-border/60 bg-card/40 transition-all hover:border-primary/50 hover:bg-card/60 sm:w-80"
              >
                <div className="h-40 w-full overflow-hidden border-b border-border/60 bg-black/50">
                  {post.mediaUrl ? (
                    post.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video
                        src={post.mediaUrl}
                        className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <Image
                        width={100}
                        height={100}
                        src={post.mediaUrl}
                        alt={post.title}
                        className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                      />
                    )
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary/20">
                      <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <span className="mb-2 font-mono text-[10px] text-primary">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <h3 className="font-mono text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  {/* Strip HTML tags for a clean preview text */}
                  <p
                    className="mt-2 text-xs text-muted-foreground line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: post.content.replace(/<[^>]*>?/gm, ""),
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Fade gradients to indicate scrolling on desktop */}
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-24 bg-gradient-to-l from-background to-transparent hidden sm:block" />
      </div>

      <div className="mt-4 flex justify-center sm:hidden">
        <Link
          href="/blog"
          className="flex items-center gap-2 rounded-lg border border-border/60 px-4 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          View all posts <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
