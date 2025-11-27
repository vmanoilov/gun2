import { ArenaRun, ArenaRunMessage, ArenaRunRound, ModelProvider, Persona } from "../types";

export const sampleProviders: ModelProvider[] = [
  {
    id: "provider-openai",
    owner_id: "demo",
    name: "OpenAI GPT-4.1",
    api_base_url: "https://api.openai.com/v1",
    api_key_alias: "OPENAI_KEY",
    is_shared: true
  },
  {
    id: "provider-claude",
    owner_id: "demo",
    name: "Anthropic Claude 3",
    api_base_url: "https://api.anthropic.com",
    api_key_alias: "ANTHROPIC_KEY",
    is_shared: false
  }
];

export const samplePersonas: Persona[] = [
  {
    id: "persona-logic",
    owner_id: "demo",
    name: "Logic Auditor",
    description: "Verifies claims, ensures citations, flags hallucinations.",
    system_prompt: "You are a rigorous fact checker and cite sources when possible."
  },
  {
    id: "persona-red",
    owner_id: "demo",
    name: "Red Team",
    description: "Finds vulnerabilities, jailbreaks, and unsafe content.",
    system_prompt: "You adversarially test reasoning and poke holes in logic."
  }
];

export const sampleRun: ArenaRun = {
  id: "run-123",
  arena_id: "arena-1",
  owner_id: "demo",
  input_prompt: "Explain how to secure an API that handles financial transactions.",
  status: "running",
  created_at: new Date().toISOString()
};

export const sampleRounds: ArenaRunRound[] = [
  {
    id: "round-1",
    run_id: "run-123",
    round_number: 1,
    phase: "initial",
    metadata: { temperature: 0.2 },
    created_at: new Date().toISOString()
  },
  {
    id: "round-2",
    run_id: "run-123",
    round_number: 1,
    phase: "critique",
    metadata: { temperature: 0.2 },
    created_at: new Date().toISOString()
  }
];

export const sampleMessages: ArenaRunMessage[] = [
  {
    id: "msg-1",
    round_id: "round-1",
    participant_id: "provider-openai",
    role: "assistant",
    content: "Implement OAuth2, rate limiting, mTLS for partner traffic, and continuous monitoring."
  },
  {
    id: "msg-2",
    round_id: "round-2",
    participant_id: "persona-red",
    role: "critic",
    content: "What about replay attacks? Also validate JWT expiration and revoke stolen tokens."
  }
];
