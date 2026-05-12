"use client";

import { useState } from "react";
import { Code2, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Skill } from "@/types/portfolio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface SkillsManagerProps {
  skills: Skill[];
  onUpdate: (next: Skill[]) => void;
}

const empty: Skill = {
  id: "",
  name: "",
  category: "frontend",
  proficiency: 3,
  yearsOfExperience: 1,
  icon: "",
};

const categories: Skill["category"][] = ["frontend", "backend", "database", "tools", "languages", "frameworks", "ai"];

export default function SkillsManager({ skills, onUpdate }: SkillsManagerProps) {
  const [editing, setEditing] = useState<Skill | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const startAdd = () => {
    setEditing({ ...empty, id: `skill-${Date.now()}` });
    setIsNew(true);
  };

  const cancel = () => {
    setEditing(null);
    setIsNew(false);
  };

  const save = () => {
    if (!editing || !editing.name.trim()) return;
    onUpdate(isNew ? [...skills, editing] : skills.map(s => (s.id === editing.id ? editing : s)));
    cancel();
  };

  const remove = (id: string) => {
    if (!confirm("Delete this skill?")) return;
    onUpdate(skills.filter(s => s.id !== id));
  };

  const update = <K extends keyof Skill>(key: K, value: Skill[K]) => {
    setEditing(prev => (prev ? { ...prev, [key]: value } : prev));
  };

  const filtered = filterCategory === "all" ? skills : skills.filter(s => s.category === filterCategory);

  if (editing) {
    return (
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-xl font-bold flex items-center">
            <Code2 className="mr-2" />
            {isNew ? "Add Skill" : "Edit Skill"}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name *</label>
              <input
                type="text"
                value={editing.name}
                onChange={e => update("name", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="e.g. React"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={editing.category}
                onChange={e => update("category", e.target.value as Skill["category"])}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proficiency (1–5): {editing.proficiency}
              </label>
              <input
                type="range"
                min={1}
                max={5}
                value={editing.proficiency}
                onChange={e => update("proficiency", Number(e.target.value) as Skill["proficiency"])}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
              <input
                type="number"
                min={0}
                step={0.5}
                value={editing.yearsOfExperience}
                onChange={e => update("yearsOfExperience", Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <h3 className="text-xl font-bold flex items-center">
          <Code2 className="mr-2" />
          Skills ({skills.length})
        </h3>
        <div className="flex gap-2 items-center">
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="text-sm p-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <Button onClick={startAdd} size="sm">
            <Plus size={16} className="mr-1" />
            Add Skill
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No skills in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{s.name}</p>
                  <p className="text-xs text-gray-500">
                    {s.category} · {s.proficiency}/5 · {s.yearsOfExperience}y
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button onClick={() => { setEditing({ ...s }); setIsNew(false); }} size="sm" variant="outline">
                    <Edit size={12} />
                  </Button>
                  <Button onClick={() => remove(s.id)} size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    <Trash2 size={12} />
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
