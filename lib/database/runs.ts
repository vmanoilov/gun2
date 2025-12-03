import { supabaseBrowserClient } from "../supabase";
import { supabaseServerClient } from "../supabase-server";
import { ArenaRun } from "../../types";
import { PGRST_ERROR_CODES } from "../constants";

export class RunService {
  static async getAll(): Promise<ArenaRun[]> {
    const { data, error } = await supabaseBrowserClient
      .from("arena_runs")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getAllServer(): Promise<ArenaRun[]> {
    const { data, error } = await supabaseServerClient
      .from("arena_runs")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getById(id: string): Promise<ArenaRun | null> {
    const { data, error } = await supabaseBrowserClient
      .from("arena_runs")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      if (error.code === PGRST_ERROR_CODES.NO_ROWS) return null;
      throw error;
    }
    return data;
  }

  static async getByIdServer(id: string): Promise<ArenaRun | null> {
    const { data, error } = await supabaseServerClient
      .from("arena_runs")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      if (error.code === PGRST_ERROR_CODES.NO_ROWS) return null;
      throw error;
    }
    return data;
  }

  static async create(run: Omit<ArenaRun, "id" | "created_at" | "completed_at">): Promise<ArenaRun> {
    const { data, error } = await supabaseBrowserClient
      .from("arena_runs")
      .insert([run])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async update(id: string, updates: Partial<ArenaRun>): Promise<ArenaRun> {
    const { data, error } = await supabaseBrowserClient
      .from("arena_runs")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabaseBrowserClient
      .from("arena_runs")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  }
}
