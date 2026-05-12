"use client";

import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Link as LinkIcon, AlertCircle } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (next: string) => void;
  label?: string;
  shape?: "square" | "round";
  maxSizeKB?: number;
}

const MAX_DIMENSION = 1024;

async function fileToCompressedDataUrl(file: File, maxKB: number): Promise<string> {
  const dataUrl: string = await new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = () => rej(reader.error);
    reader.readAsDataURL(file);
  });

  // If already small enough, return as-is
  if (Math.round(dataUrl.length / 1.37 / 1024) <= maxKB) return dataUrl;

  // Compress via canvas — resize to MAX_DIMENSION on longest edge, re-encode JPEG at decreasing quality
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(MAX_DIMENSION / img.width, MAX_DIMENSION / img.height, 1);
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return rej(new Error("Canvas 2D context unavailable"));
      ctx.drawImage(img, 0, 0, w, h);
      // Step down quality until under maxKB
      let q = 0.92;
      let out = canvas.toDataURL("image/jpeg", q);
      while (Math.round(out.length / 1.37 / 1024) > maxKB && q > 0.4) {
        q -= 0.1;
        out = canvas.toDataURL("image/jpeg", q);
      }
      res(out);
    };
    img.onerror = () => rej(new Error("Failed to decode image"));
    img.src = dataUrl;
  });
}

export default function ImageUpload({
  value,
  onChange,
  label,
  shape = "square",
  maxSizeKB = 300,
}: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handle = async (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("File must be an image.");
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file, maxSizeKB);
      onChange(dataUrl);
    } catch (e: any) {
      setError(e?.message || "Couldn't process image.");
    } finally {
      setBusy(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handle(file);
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}

      {value ? (
        <div className="flex items-center gap-3">
          <div
            className={`flex-shrink-0 w-20 h-20 overflow-hidden bg-gray-100 ${
              shape === "round" ? "rounded-full" : "rounded-lg"
            }`}
          >
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 text-xs font-medium"
            >
              <Upload size={12} /> Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium"
            >
              <X size={12} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`cursor-pointer flex flex-col items-center justify-center p-5 rounded-lg border-2 border-dashed text-center transition ${
              dragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-50 hover:border-gray-400"
            }`}
            role="button"
            tabIndex={0}
          >
            {busy ? (
              <p className="text-sm text-gray-600">Processing image…</p>
            ) : (
              <>
                <ImageIcon className="text-gray-400 mb-1.5" size={22} />
                <p className="text-sm font-medium text-gray-700">
                  Drop image here or click to upload
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Auto-compressed · stored locally · max {maxSizeKB}KB after compression
                </p>
              </>
            )}
          </div>

          <div className="mt-2 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setUrlMode(m => !m)}
              className="text-xs text-gray-500 hover:text-gray-800 inline-flex items-center gap-1"
            >
              <LinkIcon size={11} />
              {urlMode ? "Hide URL input" : "Or paste a URL"}
            </button>
          </div>

          {urlMode && (
            <div className="mt-2 flex gap-2">
              <input
                type="url"
                value={urlDraft}
                onChange={e => setUrlDraft(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  if (urlDraft.trim()) {
                    onChange(urlDraft.trim());
                    setUrlDraft("");
                    setUrlMode(false);
                  }
                }}
                className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm"
              >
                Use URL
              </button>
            </div>
          )}
        </>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={e => e.target.files?.[0] && handle(e.target.files[0])}
        className="hidden"
      />

      {error && (
        <div className="mt-2 p-2 rounded bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-1">
          <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}
    </div>
  );
}
