import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { CV } from "@/lib/models";
import { ArrowLeft, Download, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CVPage() {
  // Direct DB call because this is a Server Component (Fastest method!)
  await connectDB();
  const activeCV = await CV.findOne({ isActive: true }).lean();

  // Create the mobile-safe Google Docs Viewer URL
  const viewerUrl = activeCV
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(activeCV.url)}&embedded=true`
    : "";

  return (
    <main className="grid-bg min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-5">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" /> cd ..
            </Link>
            <h1 className="font-mono text-3xl font-bold tracking-tight sm:text-4xl">
              Resume <span className="text-primary">/ CV</span>
            </h1>
          </div>

          {activeCV && (
            <a
              href={activeCV.url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-mono text-sm font-medium text-primary-foreground transition-all hover:glow-primary"
            >
              <Download className="h-4 w-4" /> Download PDF
            </a>
          )}
        </div>

        {activeCV ? (
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card/40 shadow-2xl">
            {/* macOS Title Bar */}
            <div className="flex items-center gap-2 border-b border-border/60 bg-secondary/40 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-destructive/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <span className="h-3 w-3 rounded-full bg-primary/70" />
              <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                {activeCV.versionName}.pdf
              </span>
            </div>

            {/* Bulletproof PDF Viewer for Desktop & Mobile */}
            <div className="h-[75vh] w-full bg-secondary/20">
              <iframe
                src={viewerUrl}
                className="h-full w-full border-none"
                title="Resume Preview"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-20 text-muted-foreground">
            <FileText className="h-8 w-8 opacity-40 mb-3" />
            <span className="font-mono text-sm">No active CV found.</span>
          </div>
        )}
      </div>
    </main>
  );
}
