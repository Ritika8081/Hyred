"use client";

import { Palette, Check } from "lucide-react";
import { BrandTheme } from "@/types/portfolio";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ThemePickerProps {
  value: BrandTheme | undefined;
  onChange: (theme: BrandTheme) => void;
}

interface Preset {
  id: string;
  name: string;
  description: string;
  theme: BrandTheme;
}

const PRESETS: Preset[] = [
  {
    id: "classic-blue",
    name: "Classic Blue",
    description: "Trusted, recruiter-safe",
    theme: { accent: "#2563eb", gradientFrom: "#2563eb", gradientTo: "#7c3aed" },
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm, creative",
    theme: { accent: "#f59e0b", gradientFrom: "#f97316", gradientTo: "#ec4899" },
  },
  {
    id: "forest",
    name: "Forest",
    description: "Calm, grounded",
    theme: { accent: "#059669", gradientFrom: "#10b981", gradientTo: "#0d9488" },
  },
  {
    id: "slate",
    name: "Slate",
    description: "Minimal, senior-feel",
    theme: { accent: "#475569", gradientFrom: "#475569", gradientTo: "#1e293b" },
  },
  {
    id: "rose",
    name: "Rose",
    description: "Bold, memorable",
    theme: { accent: "#e11d48", gradientFrom: "#e11d48", gradientTo: "#a21caf" },
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Premium, cinematic",
    theme: { accent: "#6366f1", gradientFrom: "#6366f1", gradientTo: "#0ea5e9" },
  },
];

function isActive(current: BrandTheme | undefined, preset: BrandTheme): boolean {
  if (!current) return false;
  return (
    current.gradientFrom === preset.gradientFrom &&
    current.gradientTo === preset.gradientTo
  );
}

export default function ThemePicker({ value, onChange }: ThemePickerProps) {
  return (
    <Card className="mb-8" hover={false}>
      <CardHeader>
        <h3 className="text-xl font-bold flex items-center">
          <Palette className="mr-2" />
          Theme
        </h3>
        <p className="text-sm text-gray-500 mt-1">One click to apply a recruiter-tested palette.</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PRESETS.map(p => {
            const active = isActive(value, p.theme);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onChange(p.theme)}
                className={`group relative p-4 rounded-xl border-2 transition text-left ${
                  active ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className="h-12 rounded-lg mb-3"
                  style={{
                    background: `linear-gradient(135deg, ${p.theme.gradientFrom}, ${p.theme.gradientTo})`,
                  }}
                />
                <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                <p className="text-xs text-gray-500">{p.description}</p>
                {active && (
                  <span className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
