"use client";

import { useEffect, useState } from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export default function ScrollProgress() {
  const { data } = usePortfolioData();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(p);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const gradFrom = data.personalInfo.brand?.gradientFrom || "#2563eb";
  const gradTo = data.personalInfo.brand?.gradientTo || "#0d9488";

  return (
    <div
      className="fixed top-0 left-0 right-0 h-0.5 z-50 pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full transition-transform duration-150"
        style={{
          width: "100%",
          background: `linear-gradient(90deg, ${gradFrom}, ${gradTo})`,
          transform: `scaleX(${progress / 100})`,
          transformOrigin: "left",
        }}
      />
    </div>
  );
}
