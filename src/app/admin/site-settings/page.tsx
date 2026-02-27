"use client";

import { useState, useEffect, useRef } from "react";
import { btnPrimary, btnImageRemove, card, statusSuccess, statusError } from "@/app/admin/styles";

export default function SiteSettingsPage() {
  const [heroImage, setHeroImage] = useState<string | undefined>(undefined);
  const [heroTitle, setHeroTitle] = useState<string>("");
  const [heroSubtitle, setHeroSubtitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setHeroImage(data.heroImage);
        setHeroTitle(data.heroTitle || "");
        setHeroSubtitle(data.heroSubtitle || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function uploadHeroImage(file: File) {
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "site");
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    setUploading(false);
    if (!res.ok) {
      setError("Upload failed");
      return;
    }
    const { path } = await res.json();
    setHeroImage(path);
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heroImage, heroTitle, heroSubtitle }),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Failed to save settings");
      return;
    }
    setSaved(true);
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl">Site Settings</h1>
        <div className="flex items-center gap-3">
          {saved && <span className={statusSuccess}>Saved</span>}
          {error && <span className={statusError}>{error}</span>}
          <button
            onClick={save}
            disabled={saving}
            className={btnPrimary}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <section className={card}>
        <h2 className="font-semibold mb-4">Homepage Hero Image</h2>
        <p className="text-sm text-muted mb-4">
          This image appears as the full-width background behind the hero text on the homepage.
          Use a wide, high-resolution photo (recommended: at least 1600×600px).
        </p>

        {heroImage ? (
          <div className="mb-4">
            <div className="relative inline-block">
              <img
                src={heroImage}
                alt="Hero preview"
                className="w-full max-w-2xl h-48 object-cover rounded border border-border"
              />
              <button
                onClick={() => { setHeroImage(undefined); setSaved(false); }}
                className={btnImageRemove}
              >
                &times;
              </button>
            </div>
            <p className="text-xs text-muted mt-2">Current hero image</p>
          </div>
        ) : (
          <div className="mb-4 w-full max-w-2xl h-32 bg-background rounded border-2 border-dashed border-border flex items-center justify-center">
            <span className="text-sm text-muted">No hero image set</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadHeroImage(file);
            }}
            className="text-sm"
          />
          {uploading && (
            <span className="text-sm text-muted">Uploading...</span>
          )}
        </div>
      </section>

      <section className="bg-surface border border-border rounded-lg p-6">
        <h2 className="font-semibold mb-4">Homepage Hero Text</h2>
        <p className="text-sm text-muted mb-6">
          Edit the main heading and description that appear on the homepage hero section.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Hero Title</label>
            <textarea
              value={heroTitle}
              onChange={(e) => {
                setHeroTitle(e.target.value);
                setSaved(false);
              }}
              placeholder="Learn to bake from scratch."
              className="w-full px-3 py-2 border border-border rounded bg-background text-sm resize-none"
              rows={2}
            />
            <p className="text-xs text-muted mt-1">
              The main heading on the homepage. Use line breaks for multi-line text.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
            <textarea
              value={heroSubtitle}
              onChange={(e) => {
                setHeroSubtitle(e.target.value);
                setSaved(false);
              }}
              placeholder="A guided curriculum that teaches you the principles of dough and baking, one concept at a time. Start with simple doughs and build up to sourdough boules."
              className="w-full px-3 py-2 border border-border rounded bg-background text-sm resize-none"
              rows={3}
            />
            <p className="text-xs text-muted mt-1">
              The description text below the main heading.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
