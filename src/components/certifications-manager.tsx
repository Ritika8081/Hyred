"use client";

import { useState } from "react";
import { BadgeCheck, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Certification } from "@/types/portfolio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CertificationsManagerProps {
  certifications: Certification[];
  onUpdate: (next: Certification[]) => void;
}

const empty: Certification = {
  id: "",
  name: "",
  issuer: "",
  issueDate: "",
  expiryDate: "",
  credentialId: "",
  credentialUrl: "",
};

export default function CertificationsManager({ certifications, onUpdate }: CertificationsManagerProps) {
  const [editing, setEditing] = useState<Certification | null>(null);
  const [isNew, setIsNew] = useState(false);

  const startAdd = () => {
    setEditing({ ...empty, id: `cert-${Date.now()}` });
    setIsNew(true);
  };

  const cancel = () => {
    setEditing(null);
    setIsNew(false);
  };

  const save = () => {
    if (!editing || !editing.name.trim() || !editing.issuer.trim()) return;
    const cleaned: Certification = { ...editing };
    if (cleaned.expiryDate === "") cleaned.expiryDate = undefined;
    if (cleaned.credentialId === "") cleaned.credentialId = undefined;
    if (cleaned.credentialUrl === "") cleaned.credentialUrl = undefined;
    onUpdate(isNew ? [...certifications, cleaned] : certifications.map(c => (c.id === cleaned.id ? cleaned : c)));
    cancel();
  };

  const remove = (id: string) => {
    if (!confirm("Delete this certification?")) return;
    onUpdate(certifications.filter(c => c.id !== id));
  };

  const update = <K extends keyof Certification>(key: K, value: Certification[K]) => {
    setEditing(prev => (prev ? { ...prev, [key]: value } : prev));
  };

  if (editing) {
    return (
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-xl font-bold flex items-center">
            <BadgeCheck className="mr-2" />
            {isNew ? "Add Certification" : "Edit Certification"}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                value={editing.name}
                onChange={e => update("name", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="e.g. AWS Solutions Architect Associate"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Issuer *</label>
              <input
                type="text"
                value={editing.issuer}
                onChange={e => update("issuer", e.target.value)}
                placeholder="e.g. Amazon Web Services"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date *</label>
              <input
                type="date"
                value={editing.issueDate}
                onChange={e => update("issueDate", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input
                type="date"
                value={editing.expiryDate || ""}
                onChange={e => update("expiryDate", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Credential ID</label>
              <input
                type="text"
                value={editing.credentialId || ""}
                onChange={e => update("credentialId", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Verification URL</label>
              <input
                type="url"
                value={editing.credentialUrl || ""}
                onChange={e => update("credentialUrl", e.target.value)}
                placeholder="https://..."
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
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="text-xl font-bold flex items-center">
          <BadgeCheck className="mr-2" />
          Certifications ({certifications.length})
        </h3>
        <Button onClick={startAdd} size="sm">
          <Plus size={16} className="mr-1" />
          Add Certification
        </Button>
      </CardHeader>
      <CardContent>
        {certifications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No certifications yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {certifications.map(c => (
              <div key={c.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{c.name}</p>
                  <p className="text-sm text-gray-500 truncate">{c.issuer}</p>
                </div>
                <div className="flex gap-2 ml-3">
                  <Button onClick={() => { setEditing({ ...c }); setIsNew(false); }} size="sm" variant="outline">
                    <Edit size={14} />
                  </Button>
                  <Button onClick={() => remove(c.id)} size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
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
