"use client";

import { useEffect } from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export default function DynamicHead() {
  const { data, isLoading } = usePortfolioData();

  useEffect(() => {
    if (isLoading) return;
    const { personalInfo } = data;
    if (!personalInfo?.name) return;

    const title = `${personalInfo.name} — ${personalInfo.title}`;
    document.title = title;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const setOG = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const description = personalInfo.tagline || personalInfo.bio.slice(0, 160);
    setMeta("description", description);
    setOG("og:title", title);
    setOG("og:description", description);
    setOG("og:type", "profile");

    if (personalInfo.brand?.accent) {
      let themeMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
      if (!themeMeta) {
        themeMeta = document.createElement("meta");
        themeMeta.name = "theme-color";
        document.head.appendChild(themeMeta);
      }
      themeMeta.content = personalInfo.brand.accent;
    }
  }, [data, isLoading]);

  return null;
}
