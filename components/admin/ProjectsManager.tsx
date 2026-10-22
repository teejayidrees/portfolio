"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  Plus,
  Loader2,
  X,
  Save,
  FolderGit2,
  UploadCloud,
} from "lucide-react";
import type { Project, ProjectCategory } from "@/lib/types";
import { useAdmin } from "./AdminContext";

const categories: ProjectCategory[] = [
  "Software Suite",
  "Hardware Garage",
  "Sandbox",
];

const empty = {
  title: "",
  description: "",
  category: "Software Suite" as ProjectCategory,
  techStack: "",
  desktopVideoUrl: "",
  mobileVideoUrl: "",
  liveUrl: "",
  githubUrl: "",
};

export default function ProjectsManager() {
  const { password } = useAdmin();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error();
      setProjects(await res.json());
    } catch {
      toast.error("Could not load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const headers = {
    "Content-Type": "application/json",
    "x-admin-password": password ?? "",
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error();
      toast.success("Project deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-mono text-lg font-semibold">
          <FolderGit2 className="h-5 w-5 text-primary" /> Projects
          <span className="text-xs text-muted-foreground">
            ({projects.length})
          </span>
        </h2>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 font-mono text-xs font-medium text-primary-foreground transition-all hover:glow-primary"
        >
          <Plus className="h-3.5 w-3.5" /> New Project
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((p) => (
          <div
            key={p._id}
            className="flex flex-col gap-3 rounded-lg border border-border/60 bg-card/40 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold">
                  {p.title}
                </span>
                <span className="rounded-full border border-border/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {p.category}
                </span>
              </div>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {p.description}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {p.techStack.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] text-primary/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditing(p);
                  setShowForm(true);
                }}
                className="rounded-md border border-border/60 p-2 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => remove(p._id)}
                className="rounded-md border border-border/60 p-2 text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <ProjectForm
          project={editing}
          password={password ?? ""}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            load();
          }}
        />
      )}
    </div>
  );
}

/* ---------------- Project create/edit form (modal) ---------------- */

function ProjectForm({
  project,
  password,
  onClose,
  onSaved,
}: {
  project: Project | null;
  password: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title: project?.title ?? empty.title,
    description: project?.description ?? empty.description,
    category: project?.category ?? empty.category,
    techStack: (project?.techStack ?? []).join(", "),
    desktopVideoUrl: project?.desktopVideoUrl ?? empty.desktopVideoUrl,
    mobileVideoUrl: project?.mobileVideoUrl ?? empty.mobileVideoUrl,
    liveUrl: project?.liveUrl ?? empty.liveUrl,
    githubUrl: project?.githubUrl ?? empty.githubUrl,
  });

  const [saving, setSaving] = useState(false);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);

  const headers = {
    "Content-Type": "application/json",
    "x-admin-password": password,
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "desktopVideoUrl" | "mobileVideoUrl",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isDesktop = field === "desktopVideoUrl";
    isDesktop ? setUploadingDesktop(true) : setUploadingMobile(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json();

      if (data.secure_url) {
        setForm((prev) => ({ ...prev, [field]: data.secure_url }));
        toast.success("Video uploaded to Cloudinary");
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (err) {
      toast.error("Cloudinary upload failed. Check env variables.");
    } finally {
      isDesktop ? setUploadingDesktop(false) : setUploadingMobile(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);

    const payload = {
      _id: project?._id,
      title: form.title,
      description: form.description,
      category: form.category,
      techStack: form.techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      desktopVideoUrl: form.desktopVideoUrl,
      mobileVideoUrl: form.mobileVideoUrl,
      liveUrl: form.liveUrl,
      githubUrl: form.githubUrl,
    };

    try {
      const isEdit = !!project;
      const res = await fetch("/api/admin/projects", {
        method: isEdit ? "PUT" : "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success(isEdit ? "Project updated" : "Project created");
      onSaved();
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border/60 bg-card p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-mono text-base font-semibold">
            {project ? "Edit Project" : "New Project"}
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={save} className="space-y-4">
          <FormField label="Title">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="adm-input"
              placeholder="Campus Marketplace"
            />
          </FormField>
          <FormField label="Description">
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="adm-input resize-none"
              placeholder="Short description"
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category">
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as ProjectCategory,
                  })
                }
                className="adm-input"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Tech Stack (comma separated)">
              <input
                value={form.techStack}
                onChange={(e) =>
                  setForm({ ...form, techStack: e.target.value })
                }
                className="adm-input"
                placeholder="Next.js, Node.js, MongoDB"
              />
            </FormField>
          </div>

          <FormField label="Desktop Video (Upload or Paste URL)">
            <div className="flex gap-2">
              <input
                value={form.desktopVideoUrl}
                onChange={(e) =>
                  setForm({ ...form, desktopVideoUrl: e.target.value })
                }
                className="adm-input flex-1"
                placeholder="https://res.cloudinary.com/…"
              />
              <label className="flex cursor-pointer items-center justify-center rounded-lg border border-border/60 bg-secondary/40 px-3 transition-colors hover:bg-secondary/60 hover:text-primary">
                {uploadingDesktop ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <UploadCloud className="h-4 w-4 text-muted-foreground" />
                )}
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "desktopVideoUrl")}
                />
              </label>
            </div>
          </FormField>

          <FormField label="Mobile Video (Upload or Paste URL)">
            <div className="flex gap-2">
              <input
                value={form.mobileVideoUrl}
                onChange={(e) =>
                  setForm({ ...form, mobileVideoUrl: e.target.value })
                }
                className="adm-input flex-1"
                placeholder="https://res.cloudinary.com/…"
              />
              <label className="flex cursor-pointer items-center justify-center rounded-lg border border-border/60 bg-secondary/40 px-3 transition-colors hover:bg-secondary/60 hover:text-primary">
                {uploadingMobile ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <UploadCloud className="h-4 w-4 text-muted-foreground" />
                )}
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "mobileVideoUrl")}
                />
              </label>
            </div>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Live URL">
              <input
                value={form.liveUrl}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                className="adm-input"
                placeholder="https://…"
              />
            </FormField>
            <FormField label="GitHub URL">
              <input
                value={form.githubUrl}
                onChange={(e) =>
                  setForm({ ...form, githubUrl: e.target.value })
                }
                className="adm-input"
                placeholder="https://github.com/…"
              />
            </FormField>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 font-mono text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingDesktop || uploadingMobile}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-mono text-xs font-medium text-primary-foreground transition-all hover:glow-primary disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
