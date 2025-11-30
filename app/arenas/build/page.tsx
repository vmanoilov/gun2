"use client";

import { FormEvent, useMemo, useState, useEffect } from "react";
import { GitBranch, UsersRound } from "lucide-react";
import { ProviderService } from "../../../lib/database/providers";
import { PersonaService } from "../../../lib/database/personas";
import { ModelProvider, Persona } from "../../../types";
import { useToastStore } from "../../../stores/use-toast-store";

const roles = ["Red", "Blue", "Purple", "Judge"];

export default function ArenaBuilderPage() {
  const { push } = useToastStore();
  const [providers, setProviders] = useState<ModelProvider[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [rounds, setRounds] = useState(2);
  const [temperature, setTemperature] = useState(0.3);
  const [participants, setParticipants] = useState(
    roles.map((role) => ({ role, provider_id: "", persona_id: "" }))
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [providersData, personasData] = await Promise.all([
        ProviderService.getAll(),
        PersonaService.getAll()
      ]);
      setProviders(providersData);
      setPersonas(personasData);

      // Set default selections if data is available
      if (providersData.length > 0 && personasData.length > 0) {
        setParticipants(prev =>
          prev.map(p => ({
            ...p,
            provider_id: providersData[0].id,
            persona_id: personasData[0].id
          }))
        );
      }
    } catch (error) {
      console.error("Error loading data:", error);
      push({ title: "Error loading providers and personas", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const participantSelector = useMemo(
    () =>
      participants.map((participant, index) => (
        <div key={participant.role} className="space-y-2 border-b border-gray-200 pb-4">
          <p className="text-sm font-semibold text-gray-800">{participant.role} role</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <label className="space-y-1">
              <span className="label">Provider</span>
              <select
                className="input"
                value={participant.provider_id}
                onChange={(e) =>
                  setParticipants((prev) => {
                    const updated = [...prev];
                    updated[index] = { ...prev[index], provider_id: e.target.value };
                    return updated;
                  })
                }
              >
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="label">Persona</span>
              <select
                className="input"
                value={participant.persona_id}
                onChange={(e) =>
                  setParticipants((prev) => {
                    const updated = [...prev];
                    updated[index] = { ...prev[index], persona_id: e.target.value };
                    return updated;
                  })
                }
              >
                {personas.map((persona) => (
                  <option key={persona.id} value={persona.id}>
                    {persona.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )),
    [participants, providers, personas]
  );

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      push({ title: "Prompt required", variant: "error" });
      return;
    }

    try {
      // TODO: Create actual arena run when we have the database set up
      push({
        title: "Arena configured",
        description: "Database integration is ready. Set up Supabase to enable run creation.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error creating run:", error);
      push({ title: "Failed to create run", variant: "error" });
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-primary font-semibold">Arena builder</p>
          <h1 className="text-3xl font-bold text-gray-900">Configure debate settings</h1>
        </header>
        <div className="card p-6">
          <p>Loading providers and personas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-primary font-semibold">Arena builder</p>
        <h1 className="text-3xl font-bold text-gray-900">Configure debate settings</h1>
        <p className="text-gray-700">Pick providers, personas, and structured rounds. Keyboard shortcut: Ctrl+Enter to start.</p>
      </header>
      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6 space-y-4">
          <label className="space-y-1 block">
            <span className="label">Input prompt</span>
            <textarea
              className="input h-32"
              placeholder="Design a secure webhook system for fintech payouts."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              required
            />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="space-y-1">
              <span className="label">Rounds</span>
              <input
                className="input"
                type="number"
                min={1}
                max={6}
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
              />
            </label>
            <label className="space-y-1">
              <span className="label">Temperature</span>
              <input
                className="input"
                type="number"
                min={0}
                max={1}
                step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
              />
            </label>
            <label className="space-y-1">
              <span className="label">Phases</span>
              <input className="input" value="initial, critique, defense, fusion" readOnly />
              <p className="text-xs text-gray-600">Editable via metadata in Supabase.</p>
            </label>
          </div>
        </div>
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <UsersRound className="h-5 w-5" /> Participants
          </div>
          {providers.length === 0 || personas.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <p className="text-sm">
                {providers.length === 0 && "No providers available. "}
                {personas.length === 0 && "No personas available. "}
                Create some first to build an arena.
              </p>
            </div>
          ) : (
            <>
              {participantSelector}
              <button type="submit" className="btn-primary w-full">
                <GitBranch className="mr-2 h-4 w-4" /> Start run
              </button>
            </>
          )}
          <p className="text-xs text-gray-600">
            Background orchestration can stream round updates via Supabase real-time. Add Stripe hooks later for quota-bound runs.
          </p>
        </div>
      </form>
    </div>
  );
}
