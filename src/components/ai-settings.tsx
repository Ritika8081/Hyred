"use client";

import { useEffect, useState } from "react";
import { Sparkles, Key, ExternalLink, Save, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AIConfig,
  AIProvider,
  PROVIDER_DEFAULTS,
  clearAIConfig,
  loadAIConfig,
  saveAIConfig,
} from "@/lib/ai";

export default function AISettings() {
  const [config, setConfig] = useState<AIConfig>({
    provider: "groq",
    apiKey: "",
    model: PROVIDER_DEFAULTS.groq.defaultModel,
    baseUrl: "",
  });
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const existing = loadAIConfig();
    if (existing) setConfig(existing);
  }, []);

  const handleProviderChange = (provider: AIProvider) => {
    setConfig({
      ...config,
      provider,
      model: PROVIDER_DEFAULTS[provider].defaultModel,
      baseUrl: provider === "custom" ? config.baseUrl : "",
    });
  };

  const handleSave = () => {
    saveAIConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleClear = () => {
    if (!confirm("Remove the saved AI API key?")) return;
    clearAIConfig();
    setConfig({
      provider: "groq",
      apiKey: "",
      model: PROVIDER_DEFAULTS.groq.defaultModel,
      baseUrl: "",
    });
  };

  const providerInfo = PROVIDER_DEFAULTS[config.provider];

  return (
    <Card className="mb-8" hover={false}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center">
            <Sparkles className="mr-2 text-purple-600" />
            AI Assistant
          </h3>
          {config.apiKey && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
              <CheckCircle2 size={12} />
              Connected
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-900">
          <p className="font-semibold mb-1">🔒 Your key stays in your browser.</p>
          <p>It&apos;s saved only to <code className="bg-white/60 px-1 rounded">localStorage</code> and used to call the AI provider directly. We never see it.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
            <select
              value={config.provider}
              onChange={e => handleProviderChange(e.target.value as AIProvider)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              {(Object.keys(PROVIDER_DEFAULTS) as AIProvider[]).map(p => (
                <option key={p} value={p}>{PROVIDER_DEFAULTS[p].label}</option>
              ))}
            </select>
            {providerInfo.signupUrl && (
              <a
                href={providerInfo.signupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
              >
                Get a free key <ExternalLink size={10} />
              </a>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
            <input
              type="text"
              value={config.model}
              onChange={e => setConfig({ ...config, model: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm"
            />
          </div>
        </div>

        {config.provider === "custom" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Base URL</label>
            <input
              type="url"
              value={config.baseUrl || ""}
              onChange={e => setConfig({ ...config, baseUrl: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm"
              placeholder="https://your-endpoint.com/v1"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Key size={14} />
            API Key
          </label>
          <div className="flex gap-2">
            <input
              type={showKey ? "text" : "password"}
              value={config.apiKey}
              onChange={e => setConfig({ ...config, apiKey: e.target.value })}
              className="flex-1 p-3 border border-gray-300 rounded-lg font-mono text-sm"
              placeholder="sk-... / gsk_... / sk-or-..."
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowKey(s => !s)}
              className="px-3 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
            >
              {showKey ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSave} disabled={!config.apiKey}>
            <Save size={16} className="mr-1" />
            {saved ? "Saved!" : "Save"}
          </Button>
          {config.apiKey && (
            <Button onClick={handleClear} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 size={16} className="mr-1" />
              Remove Key
            </Button>
          )}
        </div>

        {!config.apiKey && (
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <p>
              <strong>Recommended for students:</strong> Groq is fast and has a generous free tier. OpenRouter offers truly free models (Gemini Flash). No credit card needed for either.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
