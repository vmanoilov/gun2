# Copilot Instructions for GauntletFuse

## Project Overview

GauntletFuse is a Next.js + TypeScript multi-LLM orchestration engine where multiple providers and personas debate, critique, and fuse responses. The application includes landing, dashboard, providers/personas management, arena builder, run viewer, and profile settings screens.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Zustand for client-side state
- **Authentication**: Supabase Auth with Row Level Security
- **Icons**: Lucide React
- **UI Components**: Headless UI, custom components

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (arenas, personas, providers, runs)
│   ├── arenas/            # Arena-related pages
│   ├── dashboard/         # Dashboard page
│   ├── personas/          # Persona management pages
│   ├── providers/         # Provider management pages
│   ├── runs/              # Run viewer pages
│   ├── settings/          # User settings pages
│   ├── globals.css        # Global styles and Tailwind utilities
│   ├── layout.tsx         # Root layout with Navbar and Toasts
│   └── page.tsx           # Landing page
├── components/            # Reusable React components
│   ├── sections/          # Page section components
│   ├── navbar.tsx         # Navigation component
│   └── toast.tsx          # Toast notification component
├── lib/                   # Utility functions and clients
│   ├── database/          # Service classes for data operations
│   │   ├── arenas.ts      # Arena CRUD operations
│   │   ├── personas.ts    # Persona CRUD operations
│   │   ├── providers.ts   # Provider CRUD operations
│   │   └── runs.ts        # Run CRUD operations
│   ├── mockData.ts        # Sample data for development
│   ├── supabase.ts        # Browser Supabase client
│   └── supabase-server.ts # Server Supabase client
├── stores/                # Zustand stores
│   └── use-toast-store.ts # Toast notification state
└── types/                 # TypeScript type definitions
    └── index.ts           # Domain types (Profile, Arena, etc.)
```

## Arena Orchestration Flow

### The Multi-LLM Debate Pipeline

GauntletFuse executes arena runs through a structured multi-phase debate system:

**1. Arena Setup**
- User creates an **Arena** with a title and description
- User selects multiple **Model Providers** (OpenAI, Claude, Mistral, etc.)
- User assigns **Personas** (Logic Auditor, Red Team, etc.) to participants
- Each provider+persona combination becomes a **Participant**

**2. Run Lifecycle** (`ArenaRun`)
- Status progression: `pending` → `running` → `completed` | `failed`
- Contains `input_prompt` that all participants will process
- Links to parent `arena_id` and `owner_id`

**3. Round Phases** (`ArenaRunRound`)
Each run executes through 4 distinct phases:

```typescript
phase: "initial" | "critique" | "defense" | "fusion"
```

- **Initial**: Each participant generates their first response to the input prompt
- **Critique**: Participants review and critique other participants' responses
- **Defense**: Original participants defend their positions against critiques
- **Fusion**: A judge/fusion agent synthesizes all responses into a final answer

**4. Message Flow** (`ArenaRunMessage`)
- Each round contains multiple messages from participants
- Message roles: `system`, `assistant`, `user`, `critic`, `judge`
- Messages are linked to both `round_id` and `participant_id`

**5. Fused Output** (`FusedOutput`)
- Final synthesized answer combining all participant responses
- Includes `reasoning_summary` explaining consensus and disagreements
- `export_json` contains structured data for automation

### Example Flow

```
Arena Run: "How to secure a financial API?"
  
Round 1 (initial):
  - OpenAI + Logic Auditor → "Use OAuth2, rate limiting, mTLS..."
  - Claude + Red Team → "Focus on replay attack prevention..."
  - Mistral + Logic Auditor → "Implement JWT with short expiration..."

Round 2 (critique):
  - Red Team critiques OpenAI: "Missing replay attack defense"
  - Logic Auditor critiques Claude: "Need specific implementation details"

Round 3 (defense):
  - OpenAI responds: "Add nonce-based replay protection..."
  
Round 4 (fusion):
  - Judge synthesizes: "Secure API with OAuth2, strong input validation, 
    replay protection via nonces, per-tenant rate limits, mTLS for partners..."
```

## Database Schema & Relationships

### Key Tables and Foreign Keys

```sql
arenas
  ↓ (one-to-many)
arena_runs
  ↓ (one-to-many)
  ├─→ arena_run_participants (links to model_providers, personas)
  ├─→ arena_run_rounds
  │     ↓ (one-to-many)
  │     └─→ arena_run_messages (links to participants)
  └─→ arena_run_fused_outputs
```

### Critical Relationships

1. **Cascading Deletes**: Deleting an arena deletes all its runs, rounds, and messages
2. **Participant Links**: Participants reference both `provider_id` and `persona_id` (can be nullable)
3. **Message Attribution**: Messages must link to `round_id` and optionally `participant_id`

### Database Service Pattern

Use the service classes in `lib/database/` for all data operations:

```typescript
// Browser context (client components)
import { ArenaService } from "@/lib/database/arenas";
const arenas = await ArenaService.getAll();

// Server context (API routes, server actions)
import { ArenaService } from "@/lib/database/arenas";
const arenas = await ArenaService.getAllServer();
```

**Important**: 
- `*Service.method()` uses browser client (`supabaseBrowserClient`)
- `*Service.methodServer()` uses server client (`supabaseServerClient`)
- Always use server methods in API routes to respect RLS policies

### Query Patterns for Related Data

```typescript
// Get run with all rounds and messages
const { data } = await supabase
  .from("arena_runs")
  .select(`
    *,
    arena_run_rounds (
      *,
      arena_run_messages (*)
    ),
    arena_run_fused_outputs (*)
  `)
  .eq("id", runId)
  .single();

// Get participants with provider and persona details
const { data } = await supabase
  .from("arena_run_participants")
  .select(`
    *,
    model_providers (*),
    personas (*)
  `)
  .eq("run_id", runId);
```

## Mock Data vs. Production Data

### Current Development Phase

The codebase is in **transition** from mock data to Supabase:

**Mock Data** (`lib/mockData.ts`):
- Currently used in UI components for demo purposes
- Provides realistic sample data: providers, personas, runs, rounds, messages
- Contains 4 sample providers (OpenAI, Claude, ZhipuAI, Mistral)
- Contains 2 sample personas (Logic Auditor, Red Team)

**Production Data** (`lib/database/*.ts`):
- Service classes are ready for Supabase integration
- CRUD operations implemented but not yet wired to UI
- API routes in `app/api/*` use service classes

### Migration Strategy

When converting a component from mock to real data:

1. **Check for environment variables** in `.env.local`:
   ```typescript
   if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
     // Fall back to mock data
     return sampleProviders;
   }
   ```

2. **Replace mock imports** with service calls:
   ```typescript
   // Before
   import { sampleProviders } from "@/lib/mockData";
   
   // After
   import { ProviderService } from "@/lib/database/providers";
   const providers = await ProviderService.getAll();
   ```

3. **Handle loading and error states**:
   ```typescript
   const [providers, setProviders] = useState<ModelProvider[]>([]);
   const [loading, setLoading] = useState(true);
   
   useEffect(() => {
     ProviderService.getAll()
       .then(setProviders)
       .catch(err => push({ title: "Error", variant: "error" }))
       .finally(() => setLoading(false));
   }, []);
   ```

**DO NOT** remove mock data until UI components are fully migrated and tested with Supabase.

## Coding Conventions

### TypeScript

- Use strict TypeScript with explicit type annotations
- Define types in `types/index.ts` for domain entities
- Use `type` over `interface` for consistency
- Prefer optional chaining and nullish coalescing

### React Components

- Use functional components with TypeScript
- Mark client components with `"use client"` directive when needed
- Export named functions for components (not default exports for non-page components)
- Keep components focused and composable

### Styling

- Use Tailwind CSS utility classes
- Custom utility classes defined in `globals.css`:
  - `.container-layout` - Page container with max-width and padding
  - `.card` - Rounded card with border and shadow
  - `.btn-primary` - Primary purple button
  - `.btn-secondary` - Secondary blue button
  - `.input` - Form input styling
  - `.label` - Form label styling
- Custom colors in `tailwind.config.ts`:
  - `primary`: #6D28D9 (purple)
  - `secondary`: #0EA5E9 (blue)
  - `accent`: #22C55E (green)

### State Management

- Use Zustand for global client state
- Store files follow pattern: `use-{name}-store.ts`
- Keep stores minimal and focused

### File Naming

- Use kebab-case for file names
- React components: `component-name.tsx`
- Utility files: `utility-name.ts`
- Type files: `index.ts` in types directory

## Development Commands

```bash
npm install      # Install dependencies
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Debugging Workflows

### VS Code Debugger

Use the `.vscode/launch.json` configurations:

1. **Next.js: debug server-side** - Debug API routes and server components
   - Set breakpoints in `app/api/*` files
   - Inspect request/response objects
   - Step through service class methods

2. **Next.js: debug client-side** - Debug React components in Chrome
   - Set breakpoints in component files
   - Inspect React state and props

3. **Next.js: debug full stack** - Debug both simultaneously

### Tracing an Arena Run

To debug the multi-phase orchestration:

1. **Start point**: `app/arenas/build/page.tsx` - where user submits input
2. **API entry**: `app/api/runs/route.ts` - creates the run
3. **Service layer**: `lib/database/runs.ts` - database operations
4. **Execution logic**: (Future implementation) will orchestrate rounds/phases
5. **Result viewer**: `app/runs/[id]/page.tsx` - displays completed run

Add `console.log` statements at each phase transition:

```typescript
console.log(`[Run ${runId}] Starting ${phase} phase`, { participants });
console.log(`[Round ${roundId}] Messages generated`, { messageCount });
console.log(`[Fusion] Synthesizing ${messageCount} responses`);
```

## Key Patterns

### Supabase Client Usage

```typescript
// Browser client (client components)
import { supabaseBrowserClient } from "@/lib/supabase";
const supabase = supabaseBrowserClient();

// Server client (server components/actions)
import { supabaseServerClient } from "@/lib/supabase-server";
const supabase = supabaseServerClient();
```

### Toast Notifications

```typescript
import { useToastStore } from "@/stores/use-toast-store";

const { push } = useToastStore();
push({ title: "Success!", variant: "success" });
push({ title: "Error", description: "Details", variant: "error" });
```

### Component Structure

```typescript
// components/example.tsx
import { SomeIcon } from "lucide-react";

type ExampleProps = {
  title: string;
  description?: string;
};

export function Example({ title, description }: ExampleProps) {
  return (
    <div className="card p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  );
}
```

### API Route Pattern

```typescript
// app/api/resource/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ResourceService } from "@/lib/database/resource";

export async function GET(request: NextRequest) {
  try {
    const data = await ResourceService.getAllServer();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await ResourceService.createServer(body);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}
```

## Environment Variables

Required environment variables (see `.env.example`):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Provider API Keys (aliased for security)
OPENAI_KEY=your_openai_api_key
ANTHROPIC_KEY=your_anthropic_api_key
BIGMODEL_API_KEY=your_bigmodel_api_key
MISTRAL_API_KEY=your_mistral_api_key

# Payment Processing (Optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

**Security Note**: API keys are referenced by alias (e.g., `OPENAI_KEY`) in the `model_providers` table to avoid exposing raw keys in the frontend.

## Domain Types

Key domain entities are defined in `types/index.ts`:

- `Profile` - User profile data
- `ModelProvider` - LLM provider configuration (OpenAI, Claude, etc.)
- `Persona` - AI persona with system prompts (Logic Auditor, Red Team, etc.)
- `Arena` - Debate arena configuration
- `ArenaRun` - Individual arena execution
- `ArenaRunParticipant` - Links providers + personas to a run
- `ArenaRunRound` - Round within a run (initial, critique, defense, fusion)
- `ArenaRunMessage` - Messages from participants in each round
- `FusedOutput` - Final fused response from a run

## Best Practices

1. **Type Safety**: Always define proper types, avoid `any`
2. **Component Composition**: Build small, reusable components
3. **Consistent Styling**: Use existing Tailwind utilities and custom classes
4. **Error Handling**: Use toast notifications for user feedback
5. **Mock Data**: Use `lib/mockData.ts` for development until Supabase is fully wired
6. **Accessibility**: Include proper ARIA labels and semantic HTML
7. **Performance**: Use Next.js App Router features (Server Components, streaming)
8. **Database Patterns**: Always use service classes, never raw Supabase calls in components
9. **RLS Respect**: Use `*Server()` methods in API routes to enforce Row Level Security
10. **Debugging**: Add descriptive console logs at phase transitions for run orchestration
