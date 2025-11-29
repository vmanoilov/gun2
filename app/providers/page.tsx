"use client";

import { FormEvent, useState, useEffect } from "react";
import { Shield, ToggleLeft } from "lucide-react";
import { ProviderService } from "../../lib/database/providers";
import { ModelProvider } from "../../types";
import { useToastStore } from "../../stores/use-toast-store";

export default function ProvidersPage() {
  const { push } = useToastStore();
  const [providers, setProviders] = useState<ModelProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", api_base_url: "", api_key_alias: "" });

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await ProviderService.getAll();
      setProviders(data);
    } catch (error) {
      console.error("Error loading providers:", error);
      push({ title: "Error loading providers", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim()) {
      push({ title: "Provider name required", variant: "error" });
      return;
    }

    try {
      await ProviderService.create({
        owner_id: null, // Demo mode - no authentication required
        name: form.name,
        api_base_url: form.api_base_url || undefined,
        api_key_alias: form.api_key_alias,
        is_shared: true
      });

      push({ title: "Provider saved", variant: "success" });
      setForm({ name: "", api_base_url: "", api_key_alias: "" });
      await loadProviders(); // Reload the list
    } catch (error) {
      console.error("Error creating provider:", error);
      push({ title: "Failed to save provider", variant: "error" });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-primary font-semibold">Model providers</p>
          <h1 className="text-3xl font-bold text-gray-900">Manage providers securely</h1>
        </header>
        <div className="card p-6">
          <p>Loading providers...</p>
        </div>
      </div>
    );
  }

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
            <h3 className="text-xl font-semibold text-gray-900">Saved providers ({providers.length})</h3>
            <ToggleLeft className="h-5 w-5 text-gray-500" />
          </div>
          {providers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No providers found. Create your first provider to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.map((provider) => (
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
          )}
        </div>
      </div>
    </div>
  );
}
