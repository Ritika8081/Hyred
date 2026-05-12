"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
  className?: string;
}

export default function Typewriter({
  words,
  typeSpeed = 80,
  deleteSpeed = 40,
  pause = 1400,
  className = "",
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) return;
    const current = words[index % words.length];

    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }

    if (deleting && text === "") {
      setDeleting(false);
      setIndex(i => (i + 1) % words.length);
      return;
    }

    const t = setTimeout(() => {
      setText(prev =>
        deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1)
      );
    }, deleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(t);
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, pause]);

  return (
    <span className={className} aria-live="polite">
      {text}
      <span className="ml-0.5 inline-block w-0.5 animate-pulse bg-current align-middle" style={{ height: "0.9em" }} />
    </span>
  );
}
