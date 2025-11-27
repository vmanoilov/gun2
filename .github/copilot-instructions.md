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
│   ├── mockData.ts        # Sample data for development
│   └── supabase.ts        # Supabase client configuration
├── stores/                # Zustand stores
│   └── use-toast-store.ts # Toast notification state
└── types/                 # TypeScript type definitions
    └── index.ts           # Domain types (Profile, Arena, etc.)
```

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
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Key Patterns

### Supabase Client Usage

```typescript
// Browser client (client components)
import { supabaseBrowserClient } from "@/lib/supabase";
const supabase = supabaseBrowserClient();

// Server client (server components/actions)
import { supabaseServerClient } from "@/lib/supabase";
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

## Domain Types

Key domain entities are defined in `types/index.ts`:

- `Profile` - User profile data
- `ModelProvider` - LLM provider configuration
- `Persona` - AI persona with system prompts
- `Arena` - Debate arena configuration
- `ArenaRun` - Individual arena execution
- `ArenaRunRound` - Round within a run (initial, critique, defense, fusion)
- `ArenaRunMessage` - Messages from participants
- `FusedOutput` - Final fused response from a run

## Environment Variables

Required environment variables (see `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `OPENAI_KEY` - OpenAI API key alias
- `ANTHROPIC_KEY` - Anthropic API key alias
- `STRIPE_SECRET_KEY` - Stripe secret key (for billing)
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

## Best Practices

1. **Type Safety**: Always define proper types, avoid `any`
2. **Component Composition**: Build small, reusable components
3. **Consistent Styling**: Use existing Tailwind utilities and custom classes
4. **Error Handling**: Use toast notifications for user feedback
5. **Mock Data**: Use `lib/mockData.ts` for development until Supabase is wired
6. **Accessibility**: Include proper ARIA labels and semantic HTML
7. **Performance**: Use Next.js App Router features (Server Components, streaming)
