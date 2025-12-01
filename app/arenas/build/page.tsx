"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArenaService } from "../../../lib/database/arenas";
import { RunService } from "../../../lib/database/runs";
import { useToastStore } from "../../../stores/use-toast-store";
import { supabaseBrowserClient } from "../../../lib/supabase";

export default function ArenaBuilderPage() {
  const { push } = useToastStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    input_prompt: ""
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title || !form.input_prompt) {
      push({ title: "Title and input prompt required", variant: "error" });
      return;
    }

    setLoading(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabaseBrowserClient.auth.getUser();
      if (userError || !user) {
        push({ title: "User not authenticated", variant: "error" });
        return;
      }

      // Create arena
      const arena = await ArenaService.create({
        owner_id: user.id,
        title: form.title,
        description: form.description || undefined
      });

      // Create run
      const run = await RunService.create({
        arena_id: arena.id,
        owner_id: user.id,
        input_prompt: form.input_prompt,
        status: "pending"
      });

      push({ title: "Arena run created successfully", variant: "success" });
      router.push(`/runs/${run.id}`);
    } catch (error) {
      console.error("Error creating arena run:", error);
      push({ title: "Failed to create arena run", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-primary font-semibold">Arena Builder</p>
        <h1 className="text-3xl font-bold text-gray-900">Create a new arena run</h1>
        <p className="text-gray-700">Set up an arena and start a debate between AI models.</p>
      </header>
      <div className="card p-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="label">Arena Title</label>
            <input
              className="input"
              type="text"
              placeholder="Enter arena title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="label">Description (optional)</label>
            <textarea
              className="input h-24"
              placeholder="Describe the arena setup"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="label">Input Prompt</label>
            <textarea
              className="input h-32"
              placeholder="Enter the initial prompt for the debate"
              value={form.input_prompt}
              onChange={(e) => setForm((prev) => ({ ...prev, input_prompt: e.target.value }))}
              required
            />
            <p className="text-xs text-gray-600">This will be the starting point for the AI debate.</p>
          </div>
          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Arena Run"}
          </button>
        </form>
      </div>
    </div>
  );
}
