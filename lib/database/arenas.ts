import { supabaseBrowserClient } from "../supabase";
import { supabaseServerClient } from "../supabase-server";
import { Arena } from "../../types";

export class ArenaService {
  static async getAll(): Promise<Arena[]> {
    const { data, error } = await supabaseBrowserClient
      .from("arenas")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getById(id: string): Promise<Arena | null> {
    const { data, error } = await supabaseBrowserClient
      .from("arenas")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data;
  }

  static async create(arena: Omit<Arena, "id" | "created_at">): Promise<Arena> {
    const { data, error } = await supabaseBrowserClient
      .from("arenas")
      .insert([arena])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async update(id: string, updates: Partial<Arena>): Promise<Arena> {
    const { data, error } = await supabaseBrowserClient
      .from("arenas")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabaseBrowserClient
      .from("arenas")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  }

  // Server-side operations for API routes
  static async getAllServer(): Promise<Arena[]> {
    const { data, error } = await supabaseServerClient
      .from("arenas")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createServer(arena: Omit<Arena, "id" | "created_at">): Promise<Arena> {
    const { data, error } = await supabaseServerClient
      .from("arenas")
      .insert([arena])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}
