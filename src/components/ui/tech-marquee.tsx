"use client";

import { Skill } from "@/types/portfolio";

interface TechMarqueeProps {
  skills: Skill[];
  speed?: number; // seconds per loop
}

export default function TechMarquee({ skills, speed = 40 }: TechMarqueeProps) {
  if (!skills || skills.length === 0) return null;

  // Duplicate the list for seamless loop
  const items = [...skills, ...skills];

  return (
    <div className="relative overflow-hidden py-4">
      <div
        className="flex gap-8 whitespace-nowrap animate-marquee"
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {items.map((skill, idx) => (
          <span
            key={`${skill.id}-${idx}`}
            className="inline-flex items-center px-5 py-2 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700 font-medium text-sm flex-shrink-0"
          >
            <span className="mr-2 inline-flex w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-brand-500" />
            {skill.name}
          </span>
        ))}
      </div>
      {/* Edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent" />

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation-name: marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
