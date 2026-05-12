"use client";

import { useState } from "react";
import { Quote, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Testimonial } from "@/types/portfolio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface TestimonialsManagerProps {
  testimonials: Testimonial[];
  onUpdate: (next: Testimonial[]) => void;
}

const empty: Testimonial = {
  id: "",
  name: "",
  role: "",
  company: "",
  quote: "",
  avatar: "",
  linkedin: "",
  rating: 5,
};

export default function TestimonialsManager({ testimonials, onUpdate }: TestimonialsManagerProps) {
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isNew, setIsNew] = useState(false);

  const startAdd = () => {
    setEditing({ ...empty, id: `tst-${Date.now()}` });
    setIsNew(true);
  };

  const cancel = () => {
    setEditing(null);
    setIsNew(false);
  };

  const save = () => {
    if (!editing || !editing.name.trim() || !editing.quote.trim()) return;
    onUpdate(isNew ? [...testimonials, editing] : testimonials.map(t => (t.id === editing.id ? editing : t)));
    cancel();
  };

  const remove = (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    onUpdate(testimonials.filter(t => t.id !== id));
  };

  const update = <K extends keyof Testimonial>(key: K, value: Testimonial[K]) => {
    setEditing(prev => (prev ? { ...prev, [key]: value } : prev));
  };

  if (editing) {
    return (
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-xl font-bold flex items-center">
            <Quote className="mr-2" />
            {isNew ? "Add Testimonial" : "Edit Testimonial"}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                value={editing.name}
                onChange={e => update("name", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <input
                type="text"
                value={editing.role}
                onChange={e => update("role", e.target.value)}
                placeholder="e.g. Engineering Manager"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
              <input
                type="text"
                value={editing.company}
                onChange={e => update("company", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quote *</label>
            <textarea
              value={editing.quote}
              onChange={e => update("quote", e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="What did they say about working with you?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
              <input
                type="url"
                value={editing.avatar || ""}
                onChange={e => update("avatar", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="https://"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
              <input
                type="url"
                value={editing.linkedin || ""}
                onChange={e => update("linkedin", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="text-xl font-bold flex items-center">
          <Quote className="mr-2" />
          Testimonials ({testimonials.length})
        </h3>
        <Button onClick={startAdd} size="sm">
          <Plus size={16} className="mr-1" />
          Add Testimonial
        </Button>
      </CardHeader>
      <CardContent>
        {testimonials.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No testimonials yet. Recruiters love social proof — ask a manager, mentor, or colleague for one.
          </p>
        ) : (
          <div className="space-y-3">
            {testimonials.map(t => (
              <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{t.name}</p>
                  <p className="text-sm text-gray-500 truncate">{t.role} · {t.company}</p>
                  <p className="text-xs text-gray-400 italic truncate mt-1">&ldquo;{t.quote.slice(0, 100)}{t.quote.length > 100 ? "…" : ""}&rdquo;</p>
                </div>
                <div className="flex gap-2 ml-3">
                  <Button onClick={() => { setEditing({ ...t }); setIsNew(false); }} size="sm" variant="outline">
                    <Edit size={14} />
                  </Button>
                  <Button onClick={() => remove(t.id)} size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
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
