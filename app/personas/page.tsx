"use client";

import { FormEvent, useState, useEffect, useCallback } from "react";
import { NotebookPen, Quote } from "lucide-react";
import { PersonaService } from "../../lib/database/personas";
import { Persona } from "../../types";
import { useToastStore } from "../../stores/use-toast-store";

export default function PersonasPage() {
  const { push } = useToastStore();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", system_prompt: "" });

  const loadPersonas = useCallback(async () => {
    try {
      const data = await PersonaService.getAll();
      setPersonas(data);
    } catch (error) {
      console.error("Error loading personas:", error);
      push({ title: "Error loading personas", variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [push]);

  useEffect(() => {
    loadPersonas();
  }, [loadPersonas]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim()) {
      push({ title: "Persona name required", variant: "error" });
      return;
    }

    try {
      await PersonaService.create({
        owner_id: null, // Demo mode - no authentication required
        name: form.name,
        description: form.description || undefined,
        system_prompt: form.system_prompt || undefined
      });
      
      push({ title: "Persona saved", variant: "success" });
      setForm({ name: "", description: "", system_prompt: "" });
      await loadPersonas(); // Reload the list
    } catch (error) {
      console.error("Error creating persona:", error);
      push({ title: "Failed to save persona", variant: "error" });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-primary font-semibold">Personas</p>
          <h1 className="text-3xl font-bold text-gray-900">Design debate-ready personas</h1>
        </header>
        <div className="card p-6">
          <p>Loading personas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-primary font-semibold">Personas</p>
        <h1 className="text-3xl font-bold text-gray-900">Design debate-ready personas</h1>
        <p className="text-gray-700">Craft system prompts for red/blue teams, logic auditors, or judges.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={onSubmit} className="card p-5 space-y-4 lg:col-span-1">
          <div className="space-y-1">
            <label className="label">Name</label>
            <input
              className="input"
              placeholder="Red Team"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="label">Description</label>
            <textarea
              className="input h-24"
              placeholder="Find jailbreaks, unsafe content, or weak logic."
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="label">System prompt</label>
            <textarea
              className="input h-28"
              placeholder="You adversarially critique outputs with concrete evidence."
              value={form.system_prompt}
              onChange={(e) => setForm((prev) => ({ ...prev, system_prompt: e.target.value }))}
            />
            <p className="text-xs text-gray-600">Prompts are stored server-side and attached to run participants.</p>
          </div>
          <button className="btn-primary w-full" type="submit">
            Save persona
          </button>
        </form>
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {personas.length === 0 ? (
            <div className="text-center py-8 text-gray-500 col-span-2">
              <p>No personas found. Create your first persona to get started.</p>
            </div>
          ) : (
            personas.map((persona) => (
              <div key={persona.id} className="card p-4 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <NotebookPen className="h-4 w-4" />
                  <p className="text-sm font-semibold">{persona.name}</p>
                </div>
                <p className="text-sm text-gray-700">{persona.description}</p>
                <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-800">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Quote className="h-4 w-4" /> System prompt
                  </div>
                  <p>{persona.system_prompt}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
