import { supabaseBrowserClient } from "../supabase";
import { supabaseServerClient } from "../supabase-server";
import { ArenaRunRound } from "../../types";

export class RoundService {
  static async getByRunId(runId: string): Promise<ArenaRunRound[]> {
    const { data, error } = await supabaseBrowserClient
      .from("arena_run_rounds")
      .select("*")
      .eq("run_id", runId)
      .order("round_number", { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  static async getByRunIdServer(runId: string): Promise<ArenaRunRound[]> {
    const { data, error } = await supabaseServerClient
      .from("arena_run_rounds")
      .select("*")
      .eq("run_id", runId)
      .order("round_number", { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  static async create(round: Omit<ArenaRunRound, "id" | "created_at">): Promise<ArenaRunRound> {
    const { data, error } = await supabaseBrowserClient
      .from("arena_run_rounds")
      .insert([round])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}
