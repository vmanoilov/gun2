"use client";

import { FormEvent, useState, useEffect } from "react";
import { Users, Settings } from "lucide-react";
import { ParticipantService } from "../../lib/database/participants";
import { ProviderService } from "../../lib/database/providers";
import { PersonaService } from "../../lib/database/personas";
import { UserParticipant, ModelProvider, Persona } from "../../types";
import { useToastStore } from "../../stores/use-toast-store";

export default function ParticipantsPage() {
  const { push } = useToastStore();
  const [participants, setParticipants] = useState<UserParticipant[]>([]);
  const [providers, setProviders] = useState<ModelProvider[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    provider_id: "",
    persona_id: "",
    settings: "{}"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [participantsData, providersData, personasData] = await Promise.all([
        ParticipantService.getAll(),
        ProviderService.getAll(),
        PersonaService.getAll()
      ]);
      setParticipants(participantsData);
      setProviders(providersData);
      setPersonas(personasData);
    } catch (error) {
      console.error("Error loading data:", error);
      push({ title: "Error loading data", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.provider_id || !form.persona_id) {
      push({ title: "Provider and persona required", variant: "error" });
      return;
    }

    try {
      let settings = {};
      try {
        settings = JSON.parse(form.settings);
      } catch {
        push({ title: "Invalid JSON in settings", variant: "error" });
        return;
      }

      await ParticipantService.create({
        owner_id: "", // Will be set by API
        provider_id: form.provider_id,
        persona_id: form.persona_id,
        settings
      });

      push({ title: "Participant saved", variant: "success" });
      setForm({ provider_id: "", persona_id: "", settings: "{}" });
      await loadData(); // Reload the list
    } catch (error) {
      console.error("Error creating participant:", error);
      push({ title: "Failed to save participant", variant: "error" });
    }
  };

  const deleteParticipant = async (id: string) => {
    if (!confirm("Are you sure you want to delete this participant?")) return;

    try {
      await ParticipantService.delete(id);
      push({ title: "Participant deleted", variant: "success" });
      await loadData();
    } catch (error) {
      console.error("Error deleting participant:", error);
      push({ title: "Failed to delete participant", variant: "error" });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-primary font-semibold">Participants</p>
          <h1 className="text-3xl font-bold text-gray-900">Manage custom participants</h1>
        </header>
        <div className="card p-6">
          <p>Loading participants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-primary font-semibold">Participants</p>
        <h1 className="text-3xl font-bold text-gray-900">Manage custom participants</h1>
        <p className="text-gray-700">Create reusable participant configurations combining providers and personas with custom settings.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={onSubmit} className="card p-5 space-y-4 lg:col-span-1">
          <div className="space-y-1">
            <label className="label">Provider</label>
            <select
              className="input"
              value={form.provider_id}
              onChange={(e) => setForm((prev) => ({ ...prev, provider_id: e.target.value }))}
              required
            >
              <option value="">Select a provider</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="label">Persona</label>
            <select
              className="input"
              value={form.persona_id}
              onChange={(e) => setForm((prev) => ({ ...prev, persona_id: e.target.value }))}
              required
            >
              <option value="">Select a persona</option>
              {personas.map((persona) => (
                <option key={persona.id} value={persona.id}>
                  {persona.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="label">Settings (JSON)</label>
            <textarea
              className="input h-32 font-mono text-sm"
              placeholder='{"temperature": 0.7, "max_tokens": 1000}'
              value={form.settings}
              onChange={(e) => setForm((prev) => ({ ...prev, settings: e.target.value }))}
            />
            <p className="text-xs text-gray-600">Custom settings for this participant configuration.</p>
          </div>
          <button className="btn-primary w-full" type="submit">
            Save participant
          </button>
        </form>
        <div className="lg:col-span-2 card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Saved participants ({participants.length})</h3>
            <Users className="h-5 w-5 text-gray-500" />
          </div>
          {participants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No participants found. Create your first participant to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {participants.map((participant) => {
                const provider = providers.find(p => p.id === participant.provider_id);
                const persona = personas.find(p => p.id === participant.persona_id);
                return (
                  <div key={participant.id} className="rounded-lg border border-gray-200 p-4 space-y-2 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{provider?.name} + {persona?.name}</p>
                        <h4 className="text-lg font-semibold text-gray-900">Participant</h4>
                      </div>
                      <button
                        onClick={() => deleteParticipant(participant.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Settings className="h-4 w-4" />
                      <span className="text-sm">Settings</span>
                    </div>
                    <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                      {JSON.stringify(participant.settings, null, 2)}
                    </pre>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}