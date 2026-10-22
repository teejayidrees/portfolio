"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Mail, Trash2, Loader2, MailOpen, Paperclip } from "lucide-react";
import type { Message } from "@/lib/types";
import { useAdmin } from "./AdminContext";
import Image from "next/image";

export default function MessagesTable() {
  const { password } = useAdmin();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages", {
        headers: { "x-admin-password": password ?? "" },
      });
      if (!res.ok) throw new Error();
      setMessages(await res.json());
    } catch {
      toast.error("Could not load messages");
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-password": password ?? "" },
      });
      if (!res.ok) throw new Error();
      toast.success("Message deleted");
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
      <h2 className="mb-5 flex items-center gap-2 font-mono text-lg font-semibold">
        <Mail className="h-5 w-5 text-primary" /> Messages
        <span className="text-xs text-muted-foreground">
          ({messages.length})
        </span>
      </h2>

      {messages.length === 0 ? (
        <EmptyState icon={MailOpen} text="No messages yet" />
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m._id}
              className="rounded-lg border border-border/60 bg-card/40 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold">
                      {m.name}
                    </span>
                    <a
                      href={`mailto:${m.email}`}
                      className="font-mono text-xs text-primary/70 hover:text-primary"
                    >
                      {m.email}
                    </a>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground whitespace-pre-wrap">
                    {m.message}
                  </p>

                  {/* Media Rendering */}
                  {m.mediaUrl && (
                    <div className="mt-3 overflow-hidden rounded-md border border-border/50 max-w-sm">
                      {m.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video
                          src={m.mediaUrl}
                          controls
                          className="w-full h-auto max-h-48 object-cover bg-black"
                        />
                      ) : (
                        <a
                          href={m.mediaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group relative block"
                        >
                          <Image
                            src={m.mediaUrl}
                            alt="Attached media"
                            width={100}
                            height={100}
                            className="w-full h-auto max-h-48 object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="flex items-center gap-1 font-mono text-xs text-white">
                              <Paperclip className="h-3 w-3" /> View Full Size
                            </span>
                          </div>
                        </a>
                      )}
                    </div>
                  )}

                  <span className="mt-2 block font-mono text-[10px] text-muted-foreground/60">
                    {new Date(m.createdAt).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => remove(m._id)}
                  className="shrink-0 rounded-md border border-border/60 p-2 text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  text,
}: {
  icon: typeof Mail;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 py-16 text-muted-foreground">
      <Icon className="h-8 w-8 opacity-40" />
      <span className="font-mono text-xs">{text}</span>
    </div>
  );
}
