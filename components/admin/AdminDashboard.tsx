"use client";

import { useState } from "react";
import {
  FolderGit2,
  FileText,
  GraduationCap,
  Mail,
  Users,
  Send,
  LogOut,
  Terminal,
  ExternalLink,
} from "lucide-react";
import { useAdmin } from "./AdminContext";
import ProjectsManager from "./ProjectsManager";
import MessagesTable from "./MessagesTable";
import SubscribersTable from "./SubscribersTable";
import NewsletterComposer from "./NewsletterComposer";
import CVManager from "./CVManager";
import JourneyManager from "./JourneyManager";

type Tab =
  | "projects"
  | "messages"
  | "subscribers"
  | "newsletter"
  | "cv"
  | "journey";

const tabs: { id: Tab; label: string; icon: typeof FolderGit2 }[] = [
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "messages", label: "Messages", icon: Mail },
  { id: "subscribers", label: "Subscribers", icon: Users },
  { id: "journey", label: "Timeline", icon: GraduationCap },
  { id: "cv", label: "Resume", icon: FileText },
  { id: "newsletter", label: "Newsletter", icon: Send },
];

export default function AdminDashboard() {
  const { logout } = useAdmin();
  const [tab, setTab] = useState<Tab>("projects");

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="flex shrink-0 flex-col border-b border-border/60 bg-card/40 md:w-60 md:border-b-0 md:border-r">
        <div className="flex items-center gap-2 border-b border-border/60 px-5 py-4 font-mono text-sm font-semibold">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="text-primary">admin</span>
          <span className="text-muted-foreground">.panel</span>
        </div>

        <nav className="flex flex-row flex-nowrap gap-2 overflow-x-auto p-3 scrollbar-hide md:flex-col md:overflow-visible">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 font-mono text-xs transition-colors md:w-full ${
                tab === t.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">{t.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto hidden border-t border-border/60 p-3 md:block">
          <a
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" /> View Site
          </a>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden p-5 md:p-8">
        <div className="mx-auto max-w-3xl">
          {tab === "projects" && <ProjectsManager />}
          {tab === "messages" && <MessagesTable />}
          {tab === "subscribers" && <SubscribersTable />}
          {tab === "newsletter" && <NewsletterComposer />}
          {tab === "cv" && <CVManager />}
          {tab === "journey" && <JourneyManager />}
        </div>
      </main>
    </div>
  );
}
