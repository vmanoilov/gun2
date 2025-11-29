import { supabaseBrowserClient } from "../supabase";
import { Persona } from "../../types";

export class PersonaService {
  static async getAll(): Promise<Persona[]> {
    const { data, error } = await supabaseBrowserClient
      .from("personas")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getById(id: string): Promise<Persona | null> {
    const { data, error } = await supabaseBrowserClient
      .from("personas")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data;
  }

  static async create(persona: Omit<Persona, "id" | "created_at">): Promise<Persona> {
    const { data, error } = await supabaseBrowserClient
      .from("personas")
      .insert([persona])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async update(id: string, updates: Partial<Persona>): Promise<Persona> {
    const { data, error } = await supabaseBrowserClient
      .from("personas")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabaseBrowserClient
      .from("personas")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  }
}
