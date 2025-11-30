# GauntletFuse

GauntletFuse is a Next.js + TypeScript multi-LLM orchestration engine where multiple providers and personas debate, critique, and fuse responses.

## Quick Start

1. Install dependencies: `npm install`
2. Configure environment variables in `.env`
3. Run the dev server: `npm run dev`
4. Visit http://localhost:3000

## Documentation

For complete documentation, setup instructions, and technical details, see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md).

## Features

- Multi-LLM debate orchestration
- Provider and persona management
- Arena-based discussions
- Real-time collaboration
- Supabase integration with RLS
- TypeScript + Next.js 14

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **State**: Zustand
- **AI Providers**: OpenAI, Anthropic, BigModel, Mistral

## Deployment

Deploy to Netlify, Vercel, or any platform supporting Next.js. Configure environment variables for Supabase and AI provider keys.
