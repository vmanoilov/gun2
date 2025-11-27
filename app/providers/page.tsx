"use client";

import { FormEvent, useState } from "react";
import { Shield, ToggleLeft } from "lucide-react";
import { sampleProviders } from "../../lib/mockData";
import { useToastStore } from "../../stores/use-toast-store";

export default function ProvidersPage() {
  const { push } = useToastStore();
  const [form, setForm] = useState({ name: "", api_base_url: "", api_key_alias: "" });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim()) {
      push({ title: "Provider name required", variant: "error" });
      return;
    }
    push({ title: "Provider saved", description: "Securely store raw keys via environment aliases.", variant: "success" });
    setForm({ name: "", api_base_url: "", api_key_alias: "" });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-primary font-semibold">Model providers</p>
        <h1 className="text-3xl font-bold text-gray-900">Manage providers securely</h1>
        <p className="text-gray-700">Store aliases for API keys and toggle shared access without exposing secrets to clients.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={onSubmit} className="card p-5 space-y-4 lg:col-span-1">
          <div className="space-y-1">
            <label className="label">Provider name</label>
            <input
              className="input"
              placeholder="OpenAI GPT-4.1"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="label">API base URL</label>
            <input
              className="input"
              placeholder="https://api.openai.com/v1"
              value={form.api_base_url}
              onChange={(e) => setForm((prev) => ({ ...prev, api_base_url: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="label">API key alias (env)</label>
            <input
              className="input"
              placeholder="OPENAI_KEY"
              value={form.api_key_alias}
              onChange={(e) => setForm((prev) => ({ ...prev, api_key_alias: e.target.value }))}
              required
            />
            <p className="text-xs text-gray-600">Store real keys in server-side env vars; clients only see alias.</p>
          </div>
          <button className="btn-primary w-full" type="submit">
            Save provider
          </button>
        </form>
        <div className="lg:col-span-2 card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Saved providers</h3>
            <ToggleLeft className="h-5 w-5 text-gray-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleProviders.map((provider) => (
              <div key={provider.id} className="rounded-lg border border-gray-200 p-4 space-y-2 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{provider.api_base_url}</p>
                    <h4 className="text-lg font-semibold text-gray-900">{provider.name}</h4>
                  </div>
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-gray-700">Key alias: {provider.api_key_alias}</p>
                <p className="text-xs text-gray-600">Shared: {provider.is_shared ? "Yes" : "No"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
