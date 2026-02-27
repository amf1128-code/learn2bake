"use client";

import { useRef, useState, useCallback } from "react";

interface CameraCaptureProps {
  onCapture: (base64: string, mediaType: string) => void;
  disabled?: boolean;
}

export function CameraCapture({ onCapture, disabled }: CameraCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        // dataUrl is like "data:image/jpeg;base64,/9j/4AAQ..."
        setPreview(dataUrl);
        const [header, base64] = dataUrl.split(",");
        const mediaType = header.match(/data:(.*?);/)?.[1] || "image/jpeg";
        onCapture(base64, mediaType);
      };
      reader.readAsDataURL(file);
    },
    [onCapture],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Your dough"
            className="w-full max-h-48 object-cover rounded-lg border border-border"
          />
          <button
            onClick={clearPreview}
            className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-white rounded-full text-xs flex items-center justify-center hover:bg-black/80"
            aria-label="Remove photo"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="w-full py-3 border-2 border-dashed border-border rounded-lg text-sm text-muted hover:border-accent hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="block text-lg mb-1">📷</span>
          Take a photo or choose from gallery
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
