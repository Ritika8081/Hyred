"use client";

import { useState } from "react";
import { BookOpen, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Education } from "@/types/portfolio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StringListInput from "@/components/ui/string-list-input";

interface EducationManagerProps {
  education: Education[];
  onUpdate: (next: Education[]) => void;
}

const empty: Education = {
  id: "",
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  gpa: "",
  achievements: [],
  coursework: [],
};

export default function EducationManager({ education, onUpdate }: EducationManagerProps) {
  const [editing, setEditing] = useState<Education | null>(null);
  const [isNew, setIsNew] = useState(false);

  const startAdd = () => {
    setEditing({ ...empty, id: `edu-${Date.now()}` });
    setIsNew(true);
  };

  const cancel = () => {
    setEditing(null);
    setIsNew(false);
  };

  const save = () => {
    if (!editing) return;
    const cleaned: Education = { ...editing };
    if (cleaned.endDate === "") cleaned.endDate = undefined;
    if (cleaned.gpa === "") cleaned.gpa = undefined;
    onUpdate(isNew ? [...education, cleaned] : education.map(e => (e.id === cleaned.id ? cleaned : e)));
    cancel();
  };

  const remove = (id: string) => {
    if (!confirm("Delete this education entry?")) return;
    onUpdate(education.filter(e => e.id !== id));
  };

  const update = <K extends keyof Education>(key: K, value: Education[K]) => {
    setEditing(prev => (prev ? { ...prev, [key]: value } : prev));
  };

  if (editing) {
    return (
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-xl font-bold flex items-center">
            <BookOpen className="mr-2" />
            {isNew ? "Add Education" : "Edit Education"}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Institution *</label>
              <input
                type="text"
                value={editing.institution}
                onChange={e => update("institution", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Degree *</label>
              <input
                type="text"
                value={editing.degree}
                onChange={e => update("degree", e.target.value)}
                placeholder="B.Tech / M.Sc / etc."
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Field</label>
              <input
                type="text"
                value={editing.field}
                onChange={e => update("field", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={editing.startDate}
                onChange={e => update("startDate", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={editing.endDate || ""}
                onChange={e => update("endDate", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
            <input
              type="text"
              value={editing.gpa || ""}
              onChange={e => update("gpa", e.target.value)}
              placeholder="Optional"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <StringListInput
            label="Achievements"
            values={editing.achievements}
            onChange={v => update("achievements", v)}
            placeholder="Press Enter to add"
          />

          <StringListInput
            label="Coursework"
            values={editing.coursework}
            onChange={v => update("coursework", v)}
            placeholder="Course name"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="text-xl font-bold flex items-center">
          <BookOpen className="mr-2" />
          Education ({education.length})
        </h3>
        <Button onClick={startAdd} size="sm">
          <Plus size={16} className="mr-1" />
          Add Education
        </Button>
      </CardHeader>
      <CardContent>
        {education.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No education entries yet.</p>
        ) : (
          <div className="space-y-3">
            {education.map(e => (
              <div key={e.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {e.degree} {e.field && `· ${e.field}`}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{e.institution}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => { setEditing({ ...e }); setIsNew(false); }} size="sm" variant="outline">
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
