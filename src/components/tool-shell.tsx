"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { loadAIConfig } from "@/lib/ai";
import { useEffect, useState } from "react";

interface ToolShellProps {
  emoji: string;
  title: string;
  tagline: string;
  children: ReactNode;
}

export default function ToolShell({ emoji, title, tagline, children }: ToolShellProps) {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const config = loadAIConfig();
    setHasKey(!!config?.apiKey);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={16} />
          All tools
        </Link>

        <AnimatedSection>
          <div className="mb-8">
            <div className="text-5xl mb-3">{emoji}</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            <p className="text-xl text-gray-600">{tagline}</p>
          </div>

          {hasKey === false && (
            <Card className="mb-6 border-amber-300 bg-amber-50" hover={false}>
              <CardContent className="p-4 flex items-start gap-3">
                <Sparkles className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-amber-900 mb-1">
                    AI key needed
                  </p>
                  <p className="text-amber-800">
                    This tool runs in your browser using your AI key. Set one up free in{" "}
                    <Link href="/admin" className="font-semibold underline">
                      Admin → AI Setup
                    </Link>
                    . Groq and OpenRouter both offer free tiers.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {children}
        </AnimatedSection>
      </div>
    </div>
  );
}
