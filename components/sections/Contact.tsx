"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Mail,
  Send,
  Github,
  Linkedin,
  Twitter,
  Download,
  Loader2,
  Paperclip,
} from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    mediaUrl: "",
  });
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [subEmail, setSubEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  // Cloudinary Upload Logic for optional media
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
    );

    try {
      // Auto-detect resource type (image or video)
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json();
      if (data.secure_url) {
        setForm((prev) => ({ ...prev, mediaUrl: data.secure_url }));
        toast.success("Media attached successfully");
        alert(`${data.secure_url}`);
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      toast.error("Failed to upload media");
    } finally {
      setUploading(false);
    }
  };

  // Inside Contact.tsx -> submitMessage function

  const submitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSending(true);

    // Clean the payload: only include mediaUrl if it actually contains a link
    const payload: any = {
      name: form.name,
      email: form.email,
      message: form.message,
    };

    if (form.mediaUrl) {
      payload.mediaUrl = form.mediaUrl;
    }

    try {
      const [messageRes] = await Promise.all([
        fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload), // Send the cleaned payload
        }),
        fetch("/api/subscribers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email }),
        }),
      ]);

      if (!messageRes.ok) throw new Error();

      toast.success("Message sent", {
        description: "I'll get back to you soon.",
      });
      setForm({ name: "", email: "", message: "", mediaUrl: "" });
    } catch {
      toast.error("Could not send message. Try again.");
    } finally {
      setSending(false);
    }
  };

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(subEmail)) {
      toast.error("Enter a valid email");
      return;
    }
    setSubscribing(true);
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subEmail }),
      });
      if (!res.ok) throw new Error();
      toast.success("Subscribed", { description: "You're on the list." });
      setSubEmail("");
    } catch {
      toast.error("Could not subscribe. Try again.");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative mx-auto max-w-6xl px-5 py-20 md:py-28"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mb-12"
      >
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-2 font-mono text-xs text-primary"
        >
          <Mail className="h-4 w-4" /> {"// let's.connect"}
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="mt-3 font-mono text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Get in Touch
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mt-3 max-w-xl text-sm text-muted-foreground"
        >
          Have a project, opportunity, or idea? Drop a message below.
        </motion.p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
        {/* Contact form */}
        <motion.form
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          onSubmit={submitMessage}
          className="space-y-4 rounded-xl border border-border/60 bg-card/60 p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name *">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-input bg-background/60 px-3 py-2.5 font-mono text-sm outline-none transition-colors focus:border-primary/50"
                placeholder="Your name"
              />
            </Field>
            <Field label="Email *">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-input bg-background/60 px-3 py-2.5 font-mono text-sm outline-none transition-colors focus:border-primary/50"
                placeholder="you@email.com"
              />
            </Field>
          </div>
          <Field label="Message *">
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              className="w-full resize-none rounded-lg border border-input bg-background/60 px-3 py-2.5 font-mono text-sm outline-none transition-colors focus:border-primary/50"
              placeholder="Tell me about it…"
            />
          </Field>

          <div className="flex items-center justify-between pt-2">
            {/* Optional Media Upload */}
            <label
              className={`flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border/60 px-3 py-2 font-mono text-xs transition-colors hover:border-primary/50 hover:bg-secondary/40 ${form.mediaUrl ? "text-primary border-primary/50" : "text-muted-foreground"}`}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Paperclip className="h-4 w-4" />
              )}
              {uploading
                ? "Uploading..."
                : form.mediaUrl
                  ? "Media Attached"
                  : "Attach Media (Optional)"}
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleMediaUpload}
              />
            </label>

            <button
              type="submit"
              disabled={sending || uploading}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-mono text-sm font-medium text-primary-foreground transition-all hover:glow-primary disabled:opacity-50"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {sending ? "Sending…" : "Send"}
            </button>
          </div>
        </motion.form>

        {/* Newsletter + socials */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="space-y-6"
        >
          <div className="rounded-xl border border-border/60 bg-card/60 p-6">
            <h3 className="font-mono text-sm font-semibold">Newsletter</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Occasional updates on builds and experiments.
            </p>
            <form onSubmit={subscribe} className="mt-4 flex gap-2">
              <input
                type="email"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                className="w-full rounded-lg border border-input bg-background/60 px-3 py-2 font-mono text-sm outline-none transition-colors focus:border-primary/50"
                placeholder="you@email.com"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="rounded-lg border border-border px-3 py-2 font-mono text-xs text-muted-foreground transition-all hover:border-primary/50 hover:text-primary disabled:opacity-50"
              >
                {subscribing ? "…" : "Join"}
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/60 p-6">
            <h3 className="font-mono text-sm font-semibold">Elsewhere</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              <Social
                href="https://github.com/teejayidrees"
                icon={Github}
                label="GitHub"
                colorClass="text-foreground"
              />
              <Social
                href="https://linkedin.com/in/teejayidrees"
                icon={Linkedin}
                label="LinkedIn"
                colorClass="text-[#0077b5] border-[#0077b5]/30 hover:border-[#0077b5] hover:bg-[#0077b5]/10"
              />
              <Social
                href="https://twitter.com/aheeedev"
                icon={Twitter}
                label="Twitter"
                colorClass="text-[#1DA1F2] border-[#1DA1F2]/30 hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/10"
              />
            </div>
            <a
              href="/cv.pdf"
              download
              className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 font-mono text-xs text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
            >
              <Download className="h-4 w-4" /> Download CV
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Field({
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

function Social({
  href,
  icon: Icon,
  label,
  colorClass = "text-muted-foreground hover:border-primary/50 hover:text-primary",
}: {
  href: string;
  icon: typeof Github;
  label: string;
  colorClass?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={`flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 transition-all ${colorClass}`}
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}
