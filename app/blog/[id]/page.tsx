import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models";
import { ArrowLeft, Calendar } from "lucide-react";
import Image from "next/image";

export default async function BlogPost({ params }: { params: { id: string } }) {
  await connectDB();

  let post;
  try {
    post = await Post.findById(params.id).lean();
  } catch (e) {
    return notFound();
  }

  if (!post) {
    return notFound();
  }

  return (
    <main className="grid-bg min-h-screen pt-24 pb-20">
      <article className="mx-auto max-w-3xl px-5">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> cd ../
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-2 font-mono text-xs text-primary mb-4">
            <Calendar className="h-4 w-4" />
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <h1 className="font-mono text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
        </header>

        {post.mediaUrl && (
          <div className="mb-12 overflow-hidden rounded-xl border border-border/60 bg-black shadow-2xl">
            {post.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
              <video src={post.mediaUrl} controls className="w-full" />
            ) : (
              <Image
                height={100}
                width={100}
                src={post.mediaUrl}
                alt={post.title}
                className="w-full object-cover"
              />
            )}
          </div>
        )}

        {/* 
          Content Wrapper 
          Uses arbitrary Tailwind variants to style raw HTML tags (h1, p, a, ul, etc) 
          so it perfectly matches your dark theme without needing a typography plugin.
        */}
        <div
          className="font-mono text-sm sm:text-base leading-relaxed text-foreground/90 
          [&>h1]:mt-8 [&>h1]:mb-4 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-primary 
          [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-primary 
          [&>h3]:mt-6 [&>h3]:mb-3 [&>h3]:text-lg [&>h3]:font-bold 
          [&>p]:mb-6 [&>p]:text-muted-foreground 
          [&>a]:text-primary [&>a]:underline [&>a]:underline-offset-4 hover:[&>a]:text-primary/80 
          [&>ul]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:text-muted-foreground 
          [&>ol]:mb-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:text-muted-foreground 
          [&>li]:mb-2 
          [&>blockquote]:border-l-2 [&>blockquote]:border-primary/50 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <hr className="my-12 border-border/60" />

        <div className="flex justify-between items-center">
          <span className="font-mono text-xs text-muted-foreground">EOF</span>
          <Link
            href="/blog"
            className="rounded-lg bg-secondary/40 px-4 py-2 font-mono text-xs text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
          >
            Back to Archive
          </Link>
        </div>
      </article>
    </main>
  );
}
