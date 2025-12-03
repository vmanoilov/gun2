import { supabaseBrowserClient } from "../supabase";
import { supabaseServerClient } from "../supabase-server";
import { FusedOutput } from "../../types";

export class FusedOutputService {
  static async getByRunId(runId: string): Promise<FusedOutput | null> {
    const { data, error } = await supabaseBrowserClient
      .from("arena_run_fused_outputs")
      .select("*")
      .eq("run_id", runId)
      .single();
    
    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data;
  }

  static async getByRunIdServer(runId: string): Promise<FusedOutput | null> {
    const { data, error } = await supabaseServerClient
      .from("arena_run_fused_outputs")
      .select("*")
      .eq("run_id", runId)
      .single();
    
    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data;
  }

  static async create(output: Omit<FusedOutput, "id" | "created_at">): Promise<FusedOutput> {
    const { data, error } = await supabaseBrowserClient
      .from("arena_run_fused_outputs")
      .insert([output])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}
