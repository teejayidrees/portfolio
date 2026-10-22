import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models";
import { Terminal, Rss, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic"; // Ensures it fetches fresh posts on reload

export default async function BlogFeed() {
  await connectDB();
  const posts = await Post.find().sort({ createdAt: -1 }).lean();

  return (
    <main className="grid-bg min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-5">
        <div className="mb-10">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> cd ..
          </Link>
          <div className="flex items-center gap-2 font-mono text-xs text-primary">
            <Rss className="h-4 w-4" /> {"// the.broadcast"}
          </div>
          <h1 className="mt-3 font-mono text-4xl font-bold tracking-tight sm:text-5xl">
            Archive & Updates
          </h1>
          <p className="mt-3 text-muted-foreground">
            Newsletters, project logs, and experiments.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post: any) => (
            <Link
              href={`/blog/${post._id}`}
              key={post._id.toString()}
              className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card/40 transition-all hover:border-primary/50 hover:bg-card/60"
            >
              <div className="h-48 w-full overflow-hidden border-b border-border/60 bg-black/50">
                {post.mediaUrl ? (
                  post.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                      src={post.mediaUrl}
                      className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <Image
                    height={100}
                                      width={100}
                    src={post.mediaUrl}
                      alt={post.title}
                      className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                    />
                  )
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-secondary/20">
                    <Terminal className="h-8 w-8 text-muted-foreground/30" />
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
                <h2 className="font-mono text-lg font-semibold group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p
                  className="mt-2 text-sm text-muted-foreground line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: post.content.replace(/<[^>]*>?/gm, ""),
                  }}
                />
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-20 text-muted-foreground">
            <Rss className="h-8 w-8 opacity-40 mb-3" />
            <span className="font-mono text-sm">No broadcasts found.</span>
          </div>
        )}
      </div>
    </main>
  );
}
