"use client";

import { useEffect, useState } from "react";

// Lightweight CSS-only confetti — no deps. Renders briefly then unmounts.
interface ConfettiProps {
  fire: boolean; // toggle to fire
  count?: number;
  duration?: number; // ms
}

const COLORS = ["#a855f7", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

export default function Confetti({ fire, count = 80, duration = 2200 }: ConfettiProps) {
  const [active, setActive] = useState(false);
  const [pieces] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1.2 + Math.random() * 1.0,
      drift: -30 + Math.random() * 60,
      color: COLORS[i % COLORS.length],
      rotate: Math.random() * 360,
      size: 6 + Math.random() * 6,
    }))
  );

  useEffect(() => {
    if (fire) {
      setActive(true);
      const t = setTimeout(() => setActive(false), duration);
      return () => clearTimeout(t);
    }
  }, [fire, duration]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden" aria-hidden="true">
      {pieces.map(p => (
        <span
          key={p.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            transform: `rotate(${p.rotate}deg)`,
            animation: `confetti-fall ${p.duration}s ${p.delay}s cubic-bezier(0.3, 0.7, 0.5, 1) forwards`,
            // @ts-expect-error CSS var
            "--drift": `${p.drift}vw`,
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes confetti-fall {
          0% { transform: translate(0, -10vh) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--drift), 110vh) rotate(720deg); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
