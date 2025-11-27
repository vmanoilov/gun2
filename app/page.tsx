import Link from "next/link";
import { ShieldHalf, GitBranch, Sparkles } from "lucide-react";
import { FeatureGrid } from "../components/sections/feature-grid";
import { PersonaStack } from "../components/sections/persona-stack";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="card p-8 flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            Multi-LLM debate + fusion engine
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            GauntletFuse orchestrates models, personas, and critiques so you can trust the final answer.
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Spin up arenas where multiple LLMs debate, red-team, and self-correct in structured rounds. Inspect every step, export
            JSON, and ship reliable AI experiences faster.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard" className="btn-primary text-base">
              <Sparkles className="mr-2 h-5 w-5" /> Start a run
            </Link>
            <Link href="/arenas/build" className="btn-secondary text-base">
              <GitBranch className="mr-2 h-5 w-5" /> Build arena
            </Link>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
            <li className="flex items-center gap-2"><ShieldHalf className="h-4 w-4 text-primary" /> Structured rounds & phases</li>
            <li className="flex items-center gap-2"><ShieldHalf className="h-4 w-4 text-primary" /> Persona-aware critiques</li>
            <li className="flex items-center gap-2"><ShieldHalf className="h-4 w-4 text-primary" /> JSON exports for automations</li>
            <li className="flex items-center gap-2"><ShieldHalf className="h-4 w-4 text-primary" /> Supabase auth & RLS scaffolding</li>
          </ul>
        </div>
        <PersonaStack />
      </section>
      <FeatureGrid />
    </div>
  );
}
