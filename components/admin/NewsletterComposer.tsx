'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Send, Loader2, Mail, Image as ImageIcon, X } from 'lucide-react';
import { useAdmin } from './AdminContext';

export default function NewsletterComposer() {
  const { password } = useAdmin();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState(''); // Changed from html to plain content
  const [mediaUrl, setMediaUrl] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Cloudinary Upload Logic for Blog/Newsletter Media
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.secure_url) {
        setMediaUrl(data.secure_url);
        toast.success('Media attached to post');
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      toast.error('Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !content) {
      toast.error('Subject and body are required');
      return;
    }
    setSending(true);

    // MAGIC FORMATTER: Converts plain text into clean HTML paragraphs
    const formattedHtml = content
      .trim()
      .split('\n\n')
      .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br />')}</p>`)
      .join('');

    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password ?? '' },
        // Send the formattedHtml to the backend instead of raw text
        body: JSON.stringify({ subject, html: formattedHtml, mediaUrl }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      
      if (data.sent) {
        toast.success(`Post published & sent to ${data.recipients} subscribers`);
      } else {
        toast.success(`Post published. Preview — ${data.recipients} recipients`, {
          description: data.note,
        });
      }
      setSubject('');
      setContent('');
      setMediaUrl('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Send failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <h2 className="mb-5 flex items-center gap-2 font-mono text-lg font-semibold">
        <Mail className="h-5 w-5 text-primary" /> Post & Broadcast
      </h2>

      <form onSubmit={send} className="space-y-4 rounded-xl border border-border/60 bg-card/40 p-6">
        <label className="block">
          <span className="mb-1.5 block font-mono text-[11px] text-muted-foreground">Post Title / Email Subject</span>
          <input value={subject} onChange={(e) => setSubject(e.target.value)}
            className="adm-input" placeholder="New hardware build launched!" />
        </label>
        
        {/* Media Attacher */}
        <div className="block">
           <span className="mb-1.5 block font-mono text-[11px] text-muted-foreground">Featured Media (Optional)</span>
           {mediaUrl ? (
             <div className="relative inline-block overflow-hidden rounded-md border border-border/50">
               {mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={mediaUrl} className="h-32 w-auto object-cover bg-black" />
               ) : (
                  <img src={mediaUrl} alt="Attached" className="h-32 w-auto object-cover" />
               )}
               <button type="button" onClick={() => setMediaUrl('')} className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-destructive">
                 <X className="h-3 w-3" />
               </button>
             </div>
           ) : (
             <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 bg-secondary/40 py-6 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary/60 hover:text-primary">
                {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImageIcon className="h-5 w-5" />}
                <span className="font-mono text-xs">{uploading ? 'Uploading...' : 'Click to attach image or video'}</span>
                <input type="file" accept="image/*,video/*" className="hidden" onChange={handleMediaUpload} />
             </label>
           )}
        </div>

        <label className="block">
          <span className="mb-1.5 block font-mono text-[11px] text-muted-foreground">Message Body</span>
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            rows={10}
            className="adm-input resize-y font-mono text-xs leading-relaxed"
            placeholder="Hello!&#10;&#10;Just wanted to share a quick update on my latest project...&#10;&#10;Best,&#10;Ahmad" 
          />
        </label>
        <div className="flex items-center justify-between">
          <p className="max-w-xs font-mono text-[10px] text-muted-foreground">
            Saves to the Blog and broadcasts to all subscribers via BCC.
          </p>
          <button type="submit" disabled={sending || uploading}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-mono text-xs font-medium text-primary-foreground transition-all hover:glow-primary disabled:opacity-50">
            {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            {sending ? 'Publishing…' : 'Publish & Broadcast'}
          </button>
        </div>
      </form>
    </div>
  );
}