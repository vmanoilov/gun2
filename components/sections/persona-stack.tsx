import { Brain, Bug, Gavel, ShieldAlert } from "lucide-react";

const personas = [
  { title: "Logic Auditor", color: "bg-primary/10", icon: Gavel, description: "Validates claims and cites sources." },
  { title: "Red Team", color: "bg-red-100", icon: ShieldAlert, description: "Probes for vulnerabilities and hallucinations." },
  { title: "Creative Brain", color: "bg-secondary/10", icon: Brain, description: "Explores alternatives and creative angles." },
  { title: "Safety Scout", color: "bg-green-100", icon: Bug, description: "Flags unsafe content and compliance gaps." }
];

export function PersonaStack() {
  return (
    <div className="flex-1 grid grid-cols-2 gap-4">
      {personas.map((persona) => (
        <div key={persona.title} className={`card p-4 space-y-2 ${persona.color}`}>
          <div className="flex items-center gap-2">
            <persona.icon className="h-4 w-4 text-gray-700" />
            <span className="text-sm font-semibold text-gray-900">{persona.title}</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">{persona.description}</p>
        </div>
      ))}
    </div>
  );
}
