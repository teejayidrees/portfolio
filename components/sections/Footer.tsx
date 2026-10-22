import { Terminal } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <Terminal className="h-3.5 w-3.5 text-primary" />
          <span className="text-primary">ahmad</span>@idris — built with Next.js
          and Tailwind CSS
        </div>
        <p className="font-mono text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} Ahmad Idris. All rights reserved.
          ahmad.com.ng
        </p>
      </div>
    </footer>
  );
}
