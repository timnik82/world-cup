# CLAUDE.md - AI Assistant Guide

Guide for AI assistants working with the FIFA World Cup History codebase.

## Project Overview

**Project**: FIFA World Cup History - Interactive Presentation
**Target Audience**: Children ages 9-10
**Architecture**: Full-stack monorepo (React + Express)
**Data Strategy**: Static JSON with API abstraction layer

### Main Features

- Intro, Timeline, Matches, Records, and Favorites slides
- Match Details modal with on-demand loading
- Multi-language support (English, Russian, Portuguese)
- Reveal.js slide-based navigation

### Design Philosophy

- **Kid-Friendly First**: Large buttons, bright colors, simple language
- **Type-Safe**: End-to-end TypeScript + Zod validation
- **Data-Driven**: Centralized data layer with schema validation

## Codebase Structure

```text
.
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   └── ui/           # shadcn/ui base components
│   │   ├── data/             # JSON data + Zod schemas
│   │   ├── slides/           # Slide components (6 slides + modal)
│   │   │   ├── IntroSlide.tsx
│   │   │   ├── TimelineSlide.tsx
│   │   │   ├── MatchesSlide.tsx
│   │   │   ├── MatchDetailsModal.tsx
│   │   │   ├── RecordsSlide.tsx
│   │   │   └── FavoritesSlide.tsx
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/api/          # API provider abstraction
│   │   └── store/            # Zustand stores
│   │       ├── favorites.ts  # Persisted favorites
│   │       ├── slides.ts     # Current slide state
│   │       └── language.ts   # Language preference
├── server/                    # Express backend
│   ├── index.ts, routes.ts, storage.ts
└── shared/schema.ts           # Database schema (Drizzle)
```

### Path Aliases

```typescript
"@/*"       → "./client/src/*"
"@shared/*" → "./shared/*"
```

## Technology Stack

**Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Radix UI + shadcn/ui
**State**: Zustand (client), TanStack React Query (server)
**Validation**: Zod
**Backend**: Express, PostgreSQL, Drizzle ORM
**Dev Tools**: ESLint, esbuild, tsx

## Development Commands

```bash
npm run dev          # Start dev server (port 5000)
npm run build        # Production build
npm start            # Run production server
npm run check        # Type checking
npm run lint:fix     # Fix linting issues
npm run db:push      # Push schema changes
```

**CI Pipeline**: ESLint + TypeScript checks on PRs. No automated tests configured.

## Key Patterns

### API Provider Pattern

```typescript
// client/src/lib/api/ - Strategy pattern for data fetching
import { apiProvider } from "@/lib/api";
const matches = await apiProvider.getMatches();
// Currently uses mock provider with local JSON
```

### Data Layer

```text
client/src/data/
├── schemas.ts    → Zod schemas (validation + types)
├── index.ts      → Data access functions
├── *.json        → English data files
├── *_ru.json     → Russian translations
└── *_pt.json     → Portuguese translations (when added)
```

### State Management

- **Zustand**: `favorites.ts` (persisted), `language.ts` (persisted), `slides.ts` (session)
- **React Query**: Server state with infinite stale time

### Type Safety

```typescript
// Schema-first approach
export const matchSchema = z.object({ id: z.number(), homeTeam: z.string() });
export type Match = z.infer<typeof matchSchema>;
```

## Code Conventions

### File Naming

- **Components**: PascalCase (`IntroSlide.tsx`)
- **Utilities**: camelCase (`queryClient.ts`)
- **Exports**: Match filename (`IntroSlide.tsx` → `export function IntroSlide()`)

### Import Order

```typescript
// 1. External imports
import { useState } from "react";
// 2. Alias imports
import { Button } from "@/components/ui/button";
// 3. Relative imports
import { MatchCard } from "./MatchCard";
```

### Styling

- Tailwind CSS with custom utilities: `text-kid-sm`, `text-kid-lg`, `elevation-1` to `elevation-4`
- Theme colors via CSS variables in `client/src/index.css`
- Component variants via `class-variance-authority`

## Common Tasks

### Adding a New Slide

1. Create in `client/src/slides/NewSlide.tsx`
2. Add to slide navigation in main App
3. Add translations if needed

### Adding New Data

1. Define Zod schema in `client/src/data/schemas.ts`
2. Add JSON file to `client/src/data/`
3. Add localized versions (`*_ru.json`, `*_pt.json`)

### Adding Translations

File-based localization:
1. English: `client/src/data/<name>.json`
2. Russian: `client/src/data/<name>_ru.json`
3. Language store manages active preference

### Database Changes

1. Edit `shared/schema.ts`
2. Run `npm run db:push`

## Important Rules

### Do's

- Validate data with Zod schemas
- Use path aliases (`@/`, `@shared/`)
- Add `data-testid` to interactive elements
- Run `npm run lint:fix && npm run check` before committing
- Support all three languages (EN, RU, PT)

### Don'ts

- Don't use `any` type
- Don't remove `data-testid` attributes
- Don't hardcode strings (use translation files)
- Don't skip Zod validation for external data

## Kid-Friendly Design Principles

1. **Large Touch Targets**: Minimum 48px for buttons
2. **Bright Colors**: High contrast, vibrant palette
3. **Simple Language**: Age-appropriate (9-10 years)
4. **Large Text**: Use `text-kid-*` utilities
5. **Smooth Animations**: Framer Motion for delight
6. **Error Prevention**: Confirmations for destructive actions

## Quick Reference

### Key Paths

```text
client/src/components/ui/    # Base UI components
client/src/slides/           # Main slide components
client/src/data/             # Data layer + schemas
client/src/store/            # State management
client/src/lib/api/          # API abstraction
shared/schema.ts             # Database schema
```

### Key Files

- `vite.config.ts` - Vite configuration
- `tailwind.config.ts` - Theme configuration
- `client/src/index.css` - Global styles + CSS variables
- `client/src/data/schemas.ts` - Data type definitions

### Environment Variables

- `DATABASE_URL` - PostgreSQL connection (required)
- `PORT` - Server port (default: 5000)
- `VITE_API_PROVIDER` - API provider: "mock" | "real" (default: "mock")

---

**Last Updated**: 2026-01-11
