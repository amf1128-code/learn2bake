"use client";

import { useState, useEffect, useRef } from "react";

export default function SiteSettingsPage() {
  const [heroImage, setHeroImage] = useState<string | undefined>(undefined);
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
      body: JSON.stringify({ heroImage }),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Failed to save settings");
      return;
    }
    setSaved(true);
  }

  if (loading) {
    return <p className="text-sm text-gray-400">Loading...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-600">Saved</span>}
          {error && <span className="text-sm text-red-600">{error}</span>}
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 bg-orange-700 text-white rounded-lg text-sm font-medium hover:bg-orange-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="font-semibold mb-4">Homepage Hero Image</h2>
        <p className="text-sm text-gray-500 mb-4">
          This image appears as the full-width background behind the hero text on the homepage.
          Use a wide, high-resolution photo (recommended: at least 1600×600px).
        </p>

        {heroImage ? (
          <div className="mb-4">
            <div className="relative inline-block">
              <img
                src={heroImage}
                alt="Hero preview"
                className="w-full max-w-2xl h-48 object-cover rounded border"
              />
              <button
                onClick={() => { setHeroImage(undefined); setSaved(false); }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
              >
                &times;
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Current hero image</p>
          </div>
        ) : (
          <div className="mb-4 w-full max-w-2xl h-32 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
            <span className="text-sm text-gray-400">No hero image set</span>
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
            <span className="text-sm text-gray-400">Uploading...</span>
          )}
        </div>
      </section>
    </div>
  );
}
