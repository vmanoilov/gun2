import { Bot, GitMerge, Logs, Shield, Sparkles, Waypoints } from "lucide-react";

const features = [
  {
    title: "Side-by-side comparison",
    description: "Inspect each model's claim, critique, and defense with structured rounds and phases.",
    icon: Waypoints
  },
  {
    title: "Fusion pipeline",
    description: "Automated fusion summarizes consensus and highlights disagreements for quick export.",
    icon: GitMerge
  },
  {
    title: "Personas & roles",
    description: "Attach red/blue team personas or judges to pressure-test prompts and outputs.",
    icon: Shield
  },
  {
    title: "Provider switching",
    description: "Swap between OpenAI, Anthropic, or local providers with environment-based key aliases.",
    icon: Bot
  },
  {
    title: "Full audit log",
    description: "Trace every message, critique, and vote with searchable metadata for QA flows.",
    icon: Logs
  },
  {
    title: "Ready for automations",
    description: "Export clean JSON, trigger webhooks, and connect to n8n, Zapier, or custom code.",
    icon: Sparkles
  }
];

export function FeatureGrid() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-primary font-semibold">Why GauntletFuse</p>
        <h2 className="text-3xl font-bold text-gray-900">High-trust orchestration for every model stack.</h2>
        <p className="text-gray-700 max-w-3xl">
          Built for prompt engineers, researchers, and teams that need transparent, reproducible reasoning. Run multi-model arenas
          with clear status, RLS-backed Supabase storage, and ready-to-ship UI patterns.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <div key={feature.title} className="card p-5 space-y-3">
            <feature.icon className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
