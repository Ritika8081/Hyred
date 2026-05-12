"use client";

import { useState } from "react";
import { Briefcase, Plus, Edit, Trash2, Save, X, Video } from "lucide-react";
import { Experience } from "@/types/portfolio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StringListInput from "@/components/ui/string-list-input";
import AIRewriteButton from "@/components/ui/ai-rewrite-button";

interface ExperienceManagerProps {
  experiences: Experience[];
  onUpdate: (next: Experience[]) => void;
}

const empty: Experience = {
  id: "",
  company: "",
  position: "",
  location: "",
  companyUrl: "",
  startDate: "",
  endDate: "",
  description: "",
  achievements: [],
  technologies: [],
  type: "full-time",
  videoUrl: "",
};

export default function ExperienceManager({ experiences, onUpdate }: ExperienceManagerProps) {
  const [editing, setEditing] = useState<Experience | null>(null);
  const [isNew, setIsNew] = useState(false);

  const startAdd = () => {
    setEditing({ ...empty, id: `exp-${Date.now()}` });
    setIsNew(true);
  };

  const startEdit = (e: Experience) => {
    setEditing({ ...e });
    setIsNew(false);
  };

  const cancel = () => {
    setEditing(null);
    setIsNew(false);
  };

  const save = () => {
    if (!editing) return;
    const cleaned: Experience = { ...editing };
    if (cleaned.endDate === "") cleaned.endDate = undefined;
    const next = isNew
      ? [...experiences, cleaned]
      : experiences.map(e => (e.id === cleaned.id ? cleaned : e));
    onUpdate(next);
    cancel();
  };

  const remove = (id: string) => {
    if (!confirm("Delete this experience?")) return;
    onUpdate(experiences.filter(e => e.id !== id));
  };

  const update = <K extends keyof Experience>(key: K, value: Experience[K]) => {
    setEditing(prev => (prev ? { ...prev, [key]: value } : prev));
  };

  if (editing) {
    return (
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-xl font-bold flex items-center">
            <Briefcase className="mr-2" />
            {isNew ? "Add Experience" : "Edit Experience"}
          </h3>
          <div className="flex gap-2">
            <Button onClick={save} size="sm">
              <Save size={16} className="mr-1" />
              Save
            </Button>
            <Button onClick={cancel} variant="outline" size="sm">
              <X size={16} className="mr-1" />
              Cancel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
              <input
                type="text"
                value={editing.company}
                onChange={e => update("company", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
              <input
                type="text"
                value={editing.position}
                onChange={e => update("position", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Job title"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={editing.type}
                onChange={e => update("type", e.target.value as Experience["type"])}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={editing.location || ""}
                onChange={e => update("location", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Remote / City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company URL</label>
              <input
                type="url"
                value={editing.companyUrl || ""}
                onChange={e => update("companyUrl", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="https://"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input
                type="date"
                value={editing.startDate}
                onChange={e => update("startDate", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date <span className="text-xs text-gray-500">(empty = current)</span>
              </label>
              <input
                type="date"
                value={editing.endDate || ""}
                onChange={e => update("endDate", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Description *</label>
              <AIRewriteButton
                value={editing.description}
                onResult={(v) => update("description", v)}
                context={`Experience description for role: ${editing.position} at ${editing.company}.`}
              />
            </div>
            <textarea
              value={editing.description}
              onChange={e => update("description", e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="What did you do in this role?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Video size={16} />
              Walkthrough Video URL <span className="text-xs text-gray-500 font-normal">(YouTube, Vimeo, Drive, Loom)</span>
            </label>
            <input
              type="url"
              value={editing.videoUrl || ""}
              onChange={e => update("videoUrl", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="https://youtu.be/..."
            />
          </div>

          <StringListInput
            label="Key Achievements"
            values={editing.achievements}
            onChange={v => update("achievements", v)}
            placeholder="Press Enter to add an achievement"
          />

          <StringListInput
            label="Technologies"
            values={editing.technologies}
            onChange={v => update("technologies", v)}
            placeholder="e.g. React, Node.js"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="text-xl font-bold flex items-center">
          <Briefcase className="mr-2" />
          Work Experience ({experiences.length})
        </h3>
        <Button onClick={startAdd} size="sm">
          <Plus size={16} className="mr-1" />
          Add Experience
        </Button>
      </CardHeader>
      <CardContent>
        {experiences.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No experiences yet. Click &quot;Add Experience&quot; to start.</p>
        ) : (
          <div className="space-y-3">
            {experiences.map(e => (
              <div key={e.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {e.position} {e.company && `@ ${e.company}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {e.startDate} – {e.endDate || "Present"}
                    {e.videoUrl && <span className="ml-2 text-blue-600">· video attached</span>}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => startEdit(e)} size="sm" variant="outline">
                    <Edit size={14} />
                  </Button>
                  <Button onClick={() => remove(e.id)} size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
