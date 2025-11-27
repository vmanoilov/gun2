"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { GitBranch, UsersRound } from "lucide-react";
import { samplePersonas, sampleProviders } from "../../../lib/mockData";
import { useToastStore } from "../../../stores/use-toast-store";

const roles = ["Red", "Blue", "Purple", "Judge"];

export default function ArenaBuilderPage() {
  const { push } = useToastStore();
  const formRef = useRef<HTMLFormElement>(null);
  const defaultProviderId = sampleProviders[0]?.id ?? "";
  const defaultPersonaId = samplePersonas[0]?.id ?? "";
  const [prompt, setPrompt] = useState("");
  const [rounds, setRounds] = useState(2);
  const [temperature, setTemperature] = useState(0.3);
  const [participants, setParticipants] = useState(
    roles.map((role) => ({ role, provider_id: defaultProviderId, persona_id: defaultPersonaId }))
  );

  const handleSubmit = () => {
    if (!prompt.trim()) {
      push({ title: "Prompt required", variant: "error" });
      return;
    }
    push({
      title: "Arena configured",
      description: "Supabase functions can start background jobs and stream statuses.",
      variant: "success"
    });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  const participantSelector = useMemo(
    () =>
      participants.map((participant, index) => (
        <div key={participant.role} className="space-y-2 border-b border-gray-200 pb-4">
          <p className="text-sm font-semibold text-gray-800">{participant.role} role</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <label htmlFor={`provider-${participant.role}`} className="label">Provider</label>
              <select
                id={`provider-${participant.role}`}
                className="input"
                value={participant.provider_id}
                onChange={(e) =>
                  setParticipants((prev) => {
                    const updated = [...prev];
                    updated[index] = { ...prev[index], provider_id: e.target.value };
                    return updated;
                  })
                }
                disabled={sampleProviders.length === 0}
              >
                <option value="">
                  {sampleProviders.length === 0 ? "No providers available" : "Select a provider"}
                </option>
                {sampleProviders.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label htmlFor={`persona-${participant.role}`} className="label">Persona</label>
              <select
                id={`persona-${participant.role}`}
                className="input"
                value={participant.persona_id}
                onChange={(e) =>
                  setParticipants((prev) => {
                    const updated = [...prev];
                    updated[index] = { ...prev[index], persona_id: e.target.value };
                    return updated;
                  })
                }
                disabled={samplePersonas.length === 0}
              >
                <option value="">
                  {samplePersonas.length === 0 ? "No personas available" : "Select a persona"}
                </option>
                {samplePersonas.map((persona) => (
                  <option key={persona.id} value={persona.id}>
                    {persona.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )),
    [participants]
  );

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-primary font-semibold">Arena builder</p>
        <h1 className="text-3xl font-bold text-gray-900">Configure debate settings</h1>
        <p className="text-gray-700">Pick providers, personas, and structured rounds. Keyboard shortcut: Ctrl+Enter to start.</p>
      </header>
      <form ref={formRef} onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6 space-y-4">
          <div className="space-y-1 block">
            <label htmlFor="arena-prompt" className="label">Input prompt</label>
            <textarea
              id="arena-prompt"
              className="input h-32"
              placeholder="Design a secure webhook system for fintech payouts."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  e.preventDefault();
                  formRef.current?.requestSubmit();
                }
              }}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label htmlFor="arena-rounds" className="label">Rounds</label>
              <input
                id="arena-rounds"
                className="input"
                type="number"
                min={1}
                max={6}
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="arena-temperature" className="label">Temperature</label>
              <input
                id="arena-temperature"
                className="input"
                type="number"
                min={0}
                max={1}
                step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="arena-phases" className="label">Phases</label>
              <input id="arena-phases" className="input" value="initial, critique, defense, fusion" readOnly />
              <p className="text-xs text-gray-600">Editable via metadata in Supabase.</p>
            </div>
          </div>
        </div>
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <UsersRound className="h-5 w-5" /> Participants
          </div>
          {participantSelector}
          <button type="submit" className="btn-primary w-full">
            <GitBranch className="mr-2 h-4 w-4" /> Start run
          </button>
          <p className="text-xs text-gray-600">
            Background orchestration can stream round updates via Supabase real-time. Add Stripe hooks later for quota-bound runs.
          </p>
        </div>
      </form>
    </div>
  );
}
