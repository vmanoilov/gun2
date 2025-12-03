import { notFound } from "next/navigation";
import { GitMerge, MessagesSquare, ScrollText } from "lucide-react";
import { RunService } from "../../../lib/database/runs";
import { RoundService } from "../../../lib/database/rounds";
import { MessageService } from "../../../lib/database/messages";
import { FusedOutputService } from "../../../lib/database/fused-outputs";
import { RunParticipantService } from "../../../lib/database/participants";
import { ArenaRun, ArenaRunRound, ArenaRunMessage, FusedOutput, ArenaRunParticipant } from "../../../types";

// Force dynamic rendering to avoid static generation at build time
export const dynamic = 'force-dynamic';

export default async function RunViewer({ params }: { params: { id: string } }) {
  if (!params.id) {
    notFound();
  }

  let run: ArenaRun | null = null;
  let rounds: ArenaRunRound[] = [];
  let messages: ArenaRunMessage[] = [];
  let fusedOutput: FusedOutput | null = null;
  let participants: ArenaRunParticipant[] = [];
  let error: string | null = null;

  try {
    // Fetch all data for the run using server methods
    run = await RunService.getByIdServer(params.id);
    
    if (!run) {
      notFound();
    }

    // Fetch related data in parallel using server methods
    [rounds, messages, fusedOutput, participants] = await Promise.all([
      RoundService.getByRunIdServer(params.id),
      MessageService.getByRunIdServer(params.id),
      FusedOutputService.getByRunIdServer(params.id),
      RunParticipantService.getByRunIdServer(params.id)
    ]);
  } catch (err) {
    console.error("Error loading run data:", err);
    error = "Failed to load run data. Please check your database connection.";
  }

  if (error) {
    return (
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-primary font-semibold">Arena run</p>
          <h1 className="text-3xl font-bold text-gray-900">Error loading run</h1>
        </header>
        <div className="card p-6">
          <div className="text-center py-8">
            <p className="text-red-600 mb-2">⚠️ {error}</p>
            <p className="text-gray-600">This is expected if you have not set up your Supabase database yet.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!run) {
    notFound();
  }

  // If no data exists yet, show empty state
  const hasNoData = rounds.length === 0 && !fusedOutput;

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
            <h2 className="text-xl font-semibold text-gray-900">{run.input_prompt}</h2>
            <p className="text-sm text-gray-600">Status: {run.status}</p>
          </div>
          <button className="btn-secondary">Export JSON</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <MessagesSquare className="h-4 w-4" /> {rounds.length} rounds / phases
          </div>
          <div className="flex items-center gap-2">
            <ScrollText className="h-4 w-4" /> Participants: {participants.length}
          </div>
          <div className="flex items-center gap-2">
            <GitMerge className="h-4 w-4" /> {fusedOutput ? "Fusion complete" : "Fusion pending"}
          </div>
        </div>
      </section>

      {hasNoData ? (
        <div className="card p-6">
          <div className="text-center py-8">
            <p className="text-gray-600 mb-2">No execution data available yet.</p>
            <p className="text-gray-600">This run has been created but has not started executing.</p>
          </div>
        </div>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            {rounds.length === 0 ? (
              <div className="card p-6 text-center text-gray-600">
                No rounds have been executed yet.
              </div>
            ) : (
              rounds.map((round) => {
                const roundMessages = messages.filter((msg) => msg.round_id === round.id);
                return (
                  <div key={round.id} className="card p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Round {round.round_number}</p>
                        <h3 className="text-lg font-semibold text-gray-900 capitalize">{round.phase} phase</h3>
                      </div>
                      <p className="text-xs text-gray-600">
                        Temperature: {String(round.metadata?.temperature ?? 0.7)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {roundMessages.length === 0 ? (
                        <p className="text-sm text-gray-500">No messages in this round yet.</p>
                      ) : (
                        roundMessages.map((message) => (
                          <div key={message.id} className="rounded-lg bg-gray-50 p-3">
                            <p className="text-xs text-gray-500">Role: {message.role}</p>
                            <p className="text-sm text-gray-800 leading-relaxed">{message.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <aside className="card p-4 space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <GitMerge className="h-4 w-4" /> Fused answer
            </div>
            {fusedOutput ? (
              <>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {fusedOutput.fused_answer}
                </p>
                {fusedOutput.reasoning_summary && (
                  <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-700">
                    <p className="font-semibold">Reasoning summary</p>
                    <p>{fusedOutput.reasoning_summary}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-600 italic">
                Fusion process has not completed yet. Check back when all rounds are finished.
              </p>
            )}
          </aside>
        </section>
      )}
    </div>
  );
}
