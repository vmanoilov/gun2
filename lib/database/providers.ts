import { supabaseBrowserClient } from "../supabase";
import { ModelProvider } from "../../types";
import { PGRST_ERROR_CODES } from "../constants";

export class ProviderService {
  static async getAll(): Promise<ModelProvider[]> {
    const { data, error } = await supabaseBrowserClient
      .from("model_providers")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getById(id: string): Promise<ModelProvider | null> {
    const { data, error } = await supabaseBrowserClient
      .from("model_providers")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      if (error.code === PGRST_ERROR_CODES.NO_ROWS) return null;
      throw error;
    }
    return data;
  }

  static async create(provider: Omit<ModelProvider, "id" | "created_at">): Promise<ModelProvider> {
    const { data, error } = await supabaseBrowserClient
      .from("model_providers")
      .insert([provider])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async update(id: string, updates: Partial<ModelProvider>): Promise<ModelProvider> {
    const { data, error } = await supabaseBrowserClient
      .from("model_providers")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabaseBrowserClient
      .from("model_providers")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  }
}
