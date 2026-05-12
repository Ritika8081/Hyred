"use client";

import { useMemo, useState } from "react";
import { Play } from "lucide-react";

interface VideoEmbedProps {
  url: string;
  title?: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
}

function toEmbedUrl(url: string): { embed: string; provider: string } | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    // YouTube
    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = u.searchParams.get("v");
      if (v) return { embed: `https://www.youtube.com/embed/${v}`, provider: "youtube" };
      // /embed/ID or /shorts/ID
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] === "embed" || parts[0] === "shorts") {
        return { embed: `https://www.youtube.com/embed/${parts[1]}`, provider: "youtube" };
      }
    }
    if (host === "youtu.be") {
      const id = u.pathname.replace("/", "").split("?")[0];
      if (id) return { embed: `https://www.youtube.com/embed/${id}`, provider: "youtube" };
    }

    // Vimeo
    if (host === "vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return { embed: `https://player.vimeo.com/video/${id}`, provider: "vimeo" };
    }

    // Google Drive
    if (host === "drive.google.com") {
      // /file/d/<id>/...
      const match = u.pathname.match(/\/file\/d\/([^/]+)/);
      if (match) return { embed: `https://drive.google.com/file/d/${match[1]}/preview`, provider: "drive" };
    }

    // Loom
    if (host === "loom.com" || host === "www.loom.com") {
      const match = u.pathname.match(/\/share\/([^/?]+)/);
      if (match) return { embed: `https://www.loom.com/embed/${match[1]}`, provider: "loom" };
    }

    // Direct mp4/webm
    if (/\.(mp4|webm|ogg)$/i.test(u.pathname)) {
      return { embed: url, provider: "direct" };
    }

    // Fallback — try as-is in iframe
    return { embed: url, provider: "iframe" };
  } catch {
    return null;
  }
}

export default function VideoEmbed({ url, title, poster, className = "", autoPlay = false }: VideoEmbedProps) {
  const parsed = useMemo(() => toEmbedUrl(url), [url]);
  const [activated, setActivated] = useState(autoPlay);

  if (!parsed) return null;

  if (parsed.provider === "direct") {
    return (
      <div className={`relative w-full overflow-hidden rounded-xl bg-black ${className}`} style={{ aspectRatio: "16 / 9" }}>
        <video
          src={parsed.embed}
          poster={poster}
          controls
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }

  // Lite player: show poster + play button until user clicks, to avoid loading iframe upfront
  if (!activated && poster) {
    return (
      <button
        type="button"
        onClick={() => setActivated(true)}
        className={`group relative w-full overflow-hidden rounded-xl bg-black ${className}`}
        style={{ aspectRatio: "16 / 9" }}
        aria-label={title ? `Play ${title}` : "Play video"}
      >
        <img src={poster} alt={title || ""} className="absolute inset-0 h-full w-full object-cover opacity-90 transition group-hover:opacity-100" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-2xl transition group-hover:scale-110">
            <Play className="ml-1 text-blue-600" size={28} fill="currentColor" />
          </span>
        </span>
      </button>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden rounded-xl bg-black shadow-lg ${className}`} style={{ aspectRatio: "16 / 9" }}>
      <iframe
        src={parsed.embed + (parsed.provider === "youtube" ? "?rel=0&modestbranding=1" : "")}
        title={title || "Video"}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
