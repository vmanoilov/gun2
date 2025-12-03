import { supabaseBrowserClient } from "../supabase";
import { supabaseServerClient } from "../supabase-server";
import { ArenaRunMessage } from "../../types";

export class MessageService {
  static async getByRoundId(roundId: string): Promise<ArenaRunMessage[]> {
    const { data, error } = await supabaseBrowserClient
      .from("arena_run_messages")
      .select("*")
      .eq("round_id", roundId)
      .order("created_at", { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  static async getByRoundIdServer(roundId: string): Promise<ArenaRunMessage[]> {
    const { data, error } = await supabaseServerClient
      .from("arena_run_messages")
      .select("*")
      .eq("round_id", roundId)
      .order("created_at", { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  static async getByRunId(runId: string): Promise<ArenaRunMessage[]> {
    const { data, error } = await supabaseBrowserClient
      .from("arena_run_messages")
      .select(`
        *,
        arena_run_rounds!inner(run_id)
      `)
      .eq("arena_run_rounds.run_id", runId)
      .order("created_at", { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  static async getByRunIdServer(runId: string): Promise<ArenaRunMessage[]> {
    const { data, error } = await supabaseServerClient
      .from("arena_run_messages")
      .select(`
        *,
        arena_run_rounds!inner(run_id)
      `)
      .eq("arena_run_rounds.run_id", runId)
      .order("created_at", { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  static async create(message: Omit<ArenaRunMessage, "id" | "created_at">): Promise<ArenaRunMessage> {
    const { data, error } = await supabaseBrowserClient
      .from("arena_run_messages")
      .insert([message])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}
