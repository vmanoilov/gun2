export type Profile = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at?: string;
};

export type ModelProvider = {
  id: string;
  owner_id: string;
  name: string;
  api_base_url?: string;
  api_key_alias?: string;
  is_shared?: boolean;
  created_at?: string;
};

export type Persona = {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  system_prompt?: string;
  created_at?: string;
};

export type Arena = {
  id: string;
  owner_id: string;
  title: string;
  description?: string;
  created_at?: string;
};

export type ArenaRun = {
  id: string;
  arena_id: string;
  owner_id: string;
  input_prompt: string;
  status: "pending" | "running" | "completed" | "failed";
  created_at?: string;
  completed_at?: string | null;
};

export type ArenaRunParticipant = {
  id: string;
  run_id: string;
  provider_id?: string;
  persona_id?: string;
  role?: string;
};

export type ArenaRunRound = {
  id: string;
  run_id: string;
  round_number: number;
  phase: "initial" | "critique" | "defense" | "fusion";
  metadata?: Record<string, unknown>;
  created_at?: string;
};

export type ArenaRunMessage = {
  id: string;
  round_id: string;
  participant_id?: string;
  role: "system" | "assistant" | "user" | "critic" | "judge";
  content: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
};

export type FusedOutput = {
  id: string;
  run_id: string;
  fused_answer: string;
  reasoning_summary?: string;
  export_json?: Record<string, unknown>;
  created_at?: string;
};
