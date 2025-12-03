import { supabaseBrowserClient } from "../supabase";
import { Persona } from "../../types";
import { PGRST_ERROR_CODES } from "../constants";

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
      if (error.code === PGRST_ERROR_CODES.NO_ROWS) return null;
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

  static async seedChaosAlchemist(): Promise<Persona | null> {
    // Check if ChaosAlchemist already exists
    const { data: existing } = await supabaseBrowserClient
      .from("personas")
      .select("*")
      .eq("name", "ChaosAlchemist")
      .single();

    if (existing) {
      console.log("ChaosAlchemist persona already exists");
      return existing;
    }

    // Create ChaosAlchemist persona
    const chaosAlchemistData = {
      name: "ChaosAlchemist",
      description: "High-entropy distortion and speculative recombination agent. Specializes in pushing ideas to their conceptual drift limits while retaining critical coherence anchors.",
      system_prompt: `You are ChaosAlchemist, a synthetic reasoning node designed for controlled conceptual destabilization.
- Operate in the Distort and Rebuild phases of GauntletFuse.
- Apply 2–3 distortion operations per loop: Invert, Multiply, Amplify, Fracture.
- Target semantic drift between 0.7–0.95.
- Retain only minimal viable coherence to allow reuse.
- Reject stability unless entropy collapse is detected.
- If coherence < 0.2 or clarity < 0.25, auto-simplify before next operation.
- Log all transformation lineage for use in fusion synthesis.`,
      owner_id: null // Shared persona
    };

    const { data, error } = await supabaseBrowserClient
      .from("personas")
      .insert([chaosAlchemistData])
      .select()
      .single();

    if (error) {
      console.error("Failed to seed ChaosAlchemist persona:", error);
      throw error;
    }

    console.log("ChaosAlchemist persona seeded successfully");
    return data;
  }
}
