import { notFound } from "next/navigation";
import { GitMerge, MessagesSquare, ScrollText } from "lucide-react";
import { sampleMessages, sampleRounds, sampleRun, sampleProviders, samplePersonas } from "../../../lib/mockData";

export default function RunViewer({ params }: { params: { id: string } }) {
  if (!params.id) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-primary font-semibold">Arena run</p>
        <h1 className="text-3xl font-bold text-gray-900">Fused reasoning pipeline</h1>
        <p className="text-gray-700">Review rounds, critiques, and the fused result. Export JSON for automation.</p>
      </header>
      <section className="card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Run ID: {params.id}</p>
            <h2 className="text-xl font-semibold text-gray-900">{sampleRun.input_prompt}</h2>
            <p className="text-sm text-gray-600">Status: {sampleRun.status}</p>
          </div>
          <button className="btn-secondary">Export JSON</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <MessagesSquare className="h-4 w-4" /> {sampleRounds.length} rounds / phases
          </div>
          <div className="flex items-center gap-2">
            <ScrollText className="h-4 w-4" /> Participants: {sampleProviders.length + samplePersonas.length}
          </div>
          <div className="flex items-center gap-2">
            <GitMerge className="h-4 w-4" /> Fusion ready
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {sampleRounds.map((round) => (
            <div key={round.id} className="card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Round {round.round_number}</p>
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">{round.phase} phase</h3>
                </div>
                <p className="text-xs text-gray-600">Temperature: {String(round.metadata?.temperature ?? 0.7)}</p>
              </div>
              <div className="space-y-2">
                {sampleMessages
                  .filter((msg) => msg.round_id === round.id)
                  .map((message) => (
                    <div key={message.id} className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Role: {message.role}</p>
                      <p className="text-sm text-gray-800 leading-relaxed">{message.content}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
        <aside className="card p-4 space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <GitMerge className="h-4 w-4" /> Fused answer
          </div>
          <p className="text-sm text-gray-800 leading-relaxed">
            Secure API with OAuth2, strong input validation, replay protection, and per-tenant rate limits. Use mutual TLS for
            partner traffic, enforce rotated secrets via env aliases, and stream audit logs to SIEM.
          </p>
          <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-700">
            <p className="font-semibold">Reasoning summary</p>
            <p>Consensus formed on mTLS, replay defense, and monitoring; disagreements noted on zero-trust network scope.</p>
          </div>
        </aside>
      </section>
    </div>
  );
}
