'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { FileText, Trash2, Loader2, UploadCloud, CheckCircle, Circle } from 'lucide-react';
import { useAdmin } from './AdminContext';
import { EmptyState } from './MessagesTable';

interface CVType {
  _id: string;
  versionName: string;
  url: string;
  isActive: boolean;
  createdAt: string;
}

export default function CVManager() {
  const { password } = useAdmin();
  const [cvs, setCvs] = useState<CVType[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [versionName, setVersionName] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/cv', {
        headers: { 'x-admin-password': password ?? '' },
      });
      if (!res.ok) throw new Error();
      setCvs(await res.json());
    } catch {
      toast.error('Could not load CVs');
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !versionName) {
      toast.error('Please enter a Version Name first');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    try {
      // Use 'auto' to handle PDF files
      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await uploadRes.json();
      
      if (data.secure_url) {
        // Save to DB
        const dbRes = await fetch('/api/admin/cv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-password': password ?? '' },
          body: JSON.stringify({ versionName, url: data.secure_url }),
        });
        
        if (!dbRes.ok) throw new Error('DB Save Failed');
        
        toast.success('CV Uploaded Successfully');
        setVersionName('');
        load();
      } else {
        throw new Error('Cloudinary Upload Failed');
      }
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const setActive = async (id: string) => {
    try {
      const res = await fetch('/api/admin/cv', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password ?? '' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      toast.success('Active CV updated');
      load();
    } catch {
      toast.error('Failed to update active CV');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this CV?')) return;
    try {
      const res = await fetch(`/api/admin/cv?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password ?? '' },
      });
      if (!res.ok) throw new Error();
      toast.success('CV deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="flex h-40 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;

  return (
    <div>
      <h2 className="mb-5 flex items-center gap-2 font-mono text-lg font-semibold">
        <FileText className="h-5 w-5 text-primary" /> Resume / CV Manager
      </h2>

      {/* Upload Form */}
      <div className="mb-8 rounded-xl border border-border/60 bg-card/40 p-5">
        <h3 className="mb-3 font-mono text-sm font-semibold">Upload New CV</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={versionName}
            onChange={(e) => setVersionName(e.target.value)}
            placeholder="e.g. Next.js Dev 2026" 
            className="adm-input flex-1"
          />
          <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-mono text-xs font-medium text-primary-foreground transition-all hover:glow-primary ${!versionName || uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            {uploading ? 'Uploading...' : 'Upload PDF'}
            <input type="file" accept="application/pdf" className="hidden" onChange={handleUpload} disabled={uploading || !versionName} />
          </label>
        </div>
      </div>

      {/* CV List */}
      {cvs.length === 0 ? (
        <EmptyState icon={FileText} text="No CVs uploaded yet" />
      ) : (
        <div className="space-y-3">
          {cvs.map((cv) => (
            <div key={cv._id} className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${cv.isActive ? 'border-primary/50 bg-primary/5' : 'border-border/60 bg-card/40'}`}>
              <div className="flex items-center gap-3">
                <button onClick={() => setActive(cv._id)} className="transition-colors hover:text-primary">
                  {cv.isActive ? <CheckCircle className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                </button>
                <div>
                  <h4 className="font-mono text-sm font-semibold">{cv.versionName}</h4>
                  <span className="font-mono text-[10px] text-muted-foreground">Uploaded: {new Date(cv.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a href={cv.url} target="_blank" rel="noreferrer" className="font-mono text-xs text-primary hover:underline">Preview</a>
                <button onClick={() => remove(cv._id)} className="rounded-md p-2 text-muted-foreground transition-colors hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}