"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, AlertCircle } from "lucide-react";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  // Called with the appended text on stop; if false, replaces value.
  append?: boolean;
  className?: string;
  // Optional language hint, e.g. "en-US"
  lang?: string;
}

// Lightweight wrapper over the browser's Web Speech API. Zero deps, zero cost.
// Falls back to a disabled state with an unobtrusive note on browsers that
// don't support it (Firefox, older Safari).
export default function VoiceInput({
  onTranscript,
  append = true,
  className = "",
  lang = "en-US",
}: VoiceInputProps) {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<any>(null);
  const interimRef = useRef<string>("");
  const finalRef = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = lang;

    rec.onresult = (event: any) => {
      let interim = "";
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      if (finalText) {
        finalRef.current += finalText;
        onTranscript(append ? finalRef.current + interim : finalText);
      } else if (interim) {
        interimRef.current = interim;
        onTranscript(append ? finalRef.current + interim : interim);
      }
    };

    rec.onerror = (e: any) => {
      const code = e?.error || "error";
      const friendly: Record<string, string> = {
        "not-allowed": "Mic permission denied. Allow it in your browser settings.",
        "no-speech": "No speech detected. Try again.",
        "audio-capture": "No microphone found.",
        network: "Network error contacting the speech service.",
      };
      setError(friendly[code] || `Voice error: ${code}`);
      setRecording(false);
    };

    rec.onend = () => setRecording(false);
    recRef.current = rec;
    return () => {
      try { rec.stop(); } catch {}
      recRef.current = null;
    };
  }, [lang, append, onTranscript]);

  const start = () => {
    if (!recRef.current) return;
    setError(null);
    finalRef.current = "";
    interimRef.current = "";
    try {
      recRef.current.start();
      setRecording(true);
    } catch (e: any) {
      // Recognition may already be running — ignore InvalidStateError
      if (e?.name !== "InvalidStateError") {
        setError(e?.message || "Could not start mic.");
      }
    }
  };

  const stop = () => {
    if (!recRef.current) return;
    try { recRef.current.stop(); } catch {}
    setRecording(false);
  };

  if (!supported) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 ${className}`}
        title="Voice input not supported in this browser"
      >
        <MicOff size={12} />
        Voice not supported
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={recording ? stop : start}
        aria-label={recording ? "Stop recording" : "Start voice input"}
        title={recording ? "Stop recording" : "Speak your answer"}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
          recording
            ? "bg-red-500 text-white hover:bg-red-600 animate-pulse"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/[0.06] dark:text-gray-200 dark:hover:bg-white/[0.10]"
        }`}
      >
        <Mic size={12} />
        {recording ? "Listening…" : "Voice"}
      </button>
      {error && (
        <span className="inline-flex items-center gap-1 text-[11px] text-red-600 dark:text-red-400">
          <AlertCircle size={11} />
          {error}
        </span>
      )}
    </div>
  );
}
