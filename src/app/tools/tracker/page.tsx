"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Calendar, Building2, Link as LinkIcon, X } from "lucide-react";
import ToolShell from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProGate from "@/components/pro-gate";
import { useToast } from "@/components/ui/toast";

type Status = "saved" | "applied" | "interview" | "offer" | "rejected";

interface Application {
  id: string;
  company: string;
  role: string;
  url?: string;
  status: Status;
  appliedAt?: string;
  notes?: string;
  salary?: string;
}

const STATUSES: Array<{ id: Status; label: string; bar: string; bg: string }> = [
  { id: "saved", label: "💭 Saved", bar: "border-t-gray-400", bg: "bg-gray-50" },
  { id: "applied", label: "📨 Applied", bar: "border-t-blue-400", bg: "bg-blue-50" },
  { id: "interview", label: "🎤 Interview", bar: "border-t-purple-400", bg: "bg-purple-50" },
  { id: "offer", label: "🎉 Offer", bar: "border-t-emerald-400", bg: "bg-emerald-50" },
  { id: "rejected", label: "👋 Closed", bar: "border-t-red-300", bg: "bg-red-50" },
];

const STORAGE_KEY = "hyredApplications";

export default function TrackerPage() {
  return (
    <ToolShell
      emoji="📋"
      title="Application Tracker"
      tagline="Every job in one board. Track Applied → Interview → Offer. Never lose context again."
    >
      <ProGate feature="Unlock Application Tracker" variant="block">
        <TrackerInner />
      </ProGate>
    </ToolShell>
  );
}

function TrackerInner() {
  const [apps, setApps] = useState<Application[]>([]);
  const [adding, setAdding] = useState<Status | null>(null);
  const [draft, setDraft] = useState<Application>(blank("saved"));
  const toast = useToast();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setApps(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (next: Application[]) => {
    setApps(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const save = () => {
    if (!draft.company.trim() || !draft.role.trim()) {
      toast.error("Add company and role at minimum.");
      return;
    }
    const next = [...apps, { ...draft, id: `app-${Date.now()}` }];
    persist(next);
    setAdding(null);
    setDraft(blank("saved"));
    toast.success("Added to tracker");
  };

  const move = (id: string, status: Status) => {
    const next = apps.map(a =>
      a.id === id
        ? {
            ...a,
            status,
            appliedAt: status === "applied" && !a.appliedAt
              ? new Date().toISOString().split("T")[0]
              : a.appliedAt,
          }
        : a
    );
    persist(next);
  };

  const remove = (id: string) => {
    if (!confirm("Delete this application?")) return;
    persist(apps.filter(a => a.id !== id));
  };

  // Stats
  const stats = {
    total: apps.length,
    applied: apps.filter(a => a.status === "applied" || a.status === "interview" || a.status === "offer").length,
    interview: apps.filter(a => a.status === "interview").length,
    offer: apps.filter(a => a.status === "offer").length,
    rate: apps.length
      ? Math.round(
          (apps.filter(a => a.status === "interview" || a.status === "offer").length /
            Math.max(1, apps.filter(a => a.status !== "saved").length)) *
            100
        )
      : 0,
  };

  return (
    <>
      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatPill value={stats.total} label="Total" />
        <StatPill value={stats.applied} label="In flight" />
        <StatPill value={stats.interview} label="Interview" />
        <StatPill value={stats.offer} label="Offers" />
        <StatPill value={`${stats.rate}%`} label="Response rate" />
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {STATUSES.map(col => {
          const items = apps.filter(a => a.status === col.id);
          return (
            <div key={col.id} className={`rounded-xl border-t-4 ${col.bar} ${col.bg} flex flex-col`}>
              <div className="p-3 flex items-center justify-between">
                <h3 className="font-bold text-sm text-gray-900">
                  {col.label}{" "}
                  <span className="text-xs text-gray-500 font-normal">({items.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setAdding(col.id);
                    setDraft(blank(col.id));
                  }}
                  className="p-1 rounded-full bg-white shadow-sm hover:shadow text-gray-700"
                  aria-label="Add"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="px-3 pb-3 space-y-2 min-h-[120px]">
                {items.length === 0 && (
                  <p className="text-xs text-gray-400 italic text-center py-4">
                    Drop a {col.id} role here
                  </p>
                )}
                {items.map(a => (
                  <Card key={a.id} hover={false} className="bg-white">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 truncate">{a.role}</p>
                          <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                            <Building2 size={11} />
                            {a.company}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(a.id)}
                          className="text-gray-300 hover:text-red-500"
                          aria-label="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      {a.appliedAt && (
                        <p className="text-[10px] text-gray-500 flex items-center gap-1 mb-1">
                          <Calendar size={10} />
                          {a.appliedAt}
                        </p>
                      )}
                      {a.url && (
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-blue-600 hover:underline inline-flex items-center gap-1 truncate max-w-full"
                        >
                          <LinkIcon size={10} />
                          {a.url.replace(/^https?:\/\//, "").slice(0, 28)}…
                        </a>
                      )}
                      {a.notes && (
                        <p className="text-[11px] text-gray-600 mt-1.5 line-clamp-2">{a.notes}</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {STATUSES.filter(s => s.id !== a.status).map(s => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => move(a.id, s.id)}
                            className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                          >
                            → {s.label.replace(/^\S+\s/, "")}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add modal */}
      {adding && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <Card hover={false} className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">
                  Add to {STATUSES.find(s => s.id === adding)?.label}
                </h3>
                <button onClick={() => setAdding(null)} className="text-gray-400 hover:text-gray-700">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  value={draft.company}
                  onChange={e => setDraft({ ...draft, company: e.target.value })}
                  placeholder="Company *"
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="text"
                  value={draft.role}
                  onChange={e => setDraft({ ...draft, role: e.target.value })}
                  placeholder="Role / position *"
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="url"
                  value={draft.url || ""}
                  onChange={e => setDraft({ ...draft, url: e.target.value })}
                  placeholder="Job posting URL"
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="text"
                  value={draft.salary || ""}
                  onChange={e => setDraft({ ...draft, salary: e.target.value })}
                  placeholder="Salary range (optional)"
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                />
                <textarea
                  value={draft.notes || ""}
                  onChange={e => setDraft({ ...draft, notes: e.target.value })}
                  placeholder="Notes — who referred you, interviewer names, anything..."
                  rows={3}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                />
                <Button onClick={save} className="w-full">
                  Add to tracker
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

function blank(status: Status): Application {
  return { id: "", company: "", role: "", status };
}

function StatPill({ value, label }: { value: number | string; label: string }) {
  return (
    <Card hover={false}>
      <CardContent className="p-3 text-center">
        <div className="text-2xl font-black text-gray-900">{value}</div>
        <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{label}</div>
      </CardContent>
    </Card>
  );
}
