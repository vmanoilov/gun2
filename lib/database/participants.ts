import { supabaseBrowserClient } from "../supabase";
import { supabaseServerClient } from "../supabase-server";
import { UserParticipant, ArenaRunParticipant } from "../../types";
import { PGRST_ERROR_CODES } from "../constants";

export class RunParticipantService {
  // Get participants for a specific run
  static async getByRunId(runId: string): Promise<ArenaRunParticipant[]> {
    const { data, error } = await supabaseBrowserClient
      .from("arena_run_participants")
      .select("*")
      .eq("run_id", runId);

    if (error) throw error;
    return data || [];
  }

  static async getByRunIdServer(runId: string): Promise<ArenaRunParticipant[]> {
    const { data, error } = await supabaseServerClient
      .from("arena_run_participants")
      .select("*")
      .eq("run_id", runId);

    if (error) throw error;
    return data || [];
  }

  static async create(participant: Omit<ArenaRunParticipant, "id">): Promise<ArenaRunParticipant> {
    const { data, error } = await supabaseBrowserClient
      .from("arena_run_participants")
      .insert([participant])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export class ParticipantService {
  // Browser client methods
  static async getAll(): Promise<UserParticipant[]> {
    const { data, error } = await supabaseBrowserClient
      .from("user_participants")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getById(id: string): Promise<UserParticipant | null> {
    const { data, error } = await supabaseBrowserClient
      .from("user_participants")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === PGRST_ERROR_CODES.NO_ROWS) return null;
      throw error;
    }
    return data;
  }

  static async create(participant: Omit<UserParticipant, "id" | "created_at">): Promise<UserParticipant> {
    const { data, error } = await supabaseBrowserClient
      .from("user_participants")
      .insert([participant])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id: string, updates: Partial<UserParticipant>): Promise<UserParticipant> {
    const { data, error } = await supabaseBrowserClient
      .from("user_participants")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabaseBrowserClient
      .from("user_participants")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  // Server client methods
  static async getAllServer(): Promise<UserParticipant[]> {
    const { data, error } = await supabaseServerClient
      .from("user_participants")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createServer(participant: Omit<UserParticipant, "id" | "created_at">): Promise<UserParticipant> {
    const { data, error } = await supabaseServerClient
      .from("user_participants")
      .insert([participant])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateServer(id: string, updates: Partial<UserParticipant>): Promise<UserParticipant> {
    const { data, error } = await supabaseServerClient
      .from("user_participants")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteServer(id: string): Promise<void> {
    const { error } = await supabaseServerClient
      .from("user_participants")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}