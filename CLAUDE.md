# CLAUDE.md - AI Assistant Guide

This document provides comprehensive guidance for AI assistants working with the FIFA World Cup History codebase.

## Table of Contents

- [Project Overview](#project-overview)
- [Codebase Structure](#codebase-structure)
- [Technology Stack](#technology-stack)
- [Development Workflows](#development-workflows)
- [Key Architectural Patterns](#key-architectural-patterns)
- [Code Conventions](#code-conventions)
- [Working with the Codebase](#working-with-the-codebase)
- [Testing Strategy](#testing-strategy)
- [Deployment](#deployment)
- [Common Tasks](#common-tasks)

## Project Overview

**Project**: FIFA World Cup History - Interactive Presentation
**Target Audience**: Children ages 9-10
**Architecture**: Full-stack monorepo (React + Express)
**Data Strategy**: Static JSON with API abstraction layer for future integration

### Main Features

1. **Intro Slide**: Random World Cup facts with favorites functionality
2. **Timeline Slide**: Explore tournaments by year (1986-2022)
3. **Matches Slide**: Browse and filter matches by year and stage
4. **Match Details Modal**: On-demand detailed match information
5. **Records Slide**: Computed statistics and records
6. **Favorites Slide**: Manage saved facts and matches
7. **Multi-language Support**: English, Russian, and Portuguese
8. **Reveal.js Integration**: Slide-based navigation

### Design Philosophy

- **Kid-Friendly First**: Large buttons, bright colors, simple language
- **Type-Safe**: End-to-end type safety with TypeScript + Zod
- **Data-Driven**: Centralized data layer with schema validation
- **API-Ready**: Abstraction layer prepared for real API integration
- **Accessible**: Designed for easy navigation and understanding

## Codebase Structure

```text
.
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # React components (47 UI components)
│   │   │   ├── ui/           # shadcn/ui base components
│   │   │   └── *.tsx         # Composite components
│   │   ├── data/             # Local JSON data and Zod schemas
│   │   │   ├── schemas.ts    # Type definitions + validation
│   │   │   ├── index.ts      # Data access layer
│   │   │   └── *.json        # Static data files
│   │   ├── deck/             # Reveal.js wrapper components
│   │   ├── slides/           # Slide components (6 slides + modal)
│   │   │   ├── IntroSlide.tsx
│   │   │   ├── TimelineSlide.tsx
│   │   │   ├── MatchesSlide.tsx
│   │   │   ├── MatchDetailsModal.tsx
│   │   │   ├── RecordsSlide.tsx
│   │   │   └── FavoritesSlide.tsx
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities and API layer
│   │   │   ├── api/          # API provider abstraction
│   │   │   └── utils.ts      # Helper functions
│   │   ├── pages/            # Page components
│   │   └── store/            # Zustand state management
│   │       ├── favorites.ts  # Persisted favorites
│   │       ├── slides.ts     # Current slide state
│   │       └── language.ts   # Language preference
│   ├── public/               # Static assets
│   └── index.html            # Entry HTML
├── server/                    # Backend Express server
│   ├── index.ts              # Main entry point
│   ├── routes.ts             # API routes (minimal)
│   ├── storage.ts            # Storage abstraction
│   ├── vite.ts               # Vite dev server integration
│   └── static.ts             # Static file serving
├── shared/                    # Shared client/server code
│   └── schema.ts             # Database schema (Drizzle ORM)
├── script/                    # Build scripts
│   └── build.ts              # Production build process
├── .github/workflows/         # CI/CD
│   └── ci-lint-typecheck.yml # Lint and typecheck workflow
└── attached_assets/           # Project assets
```

### Path Aliases

```typescript
"@/*"       → "./client/src/*"    // All client code
"@shared/*" → "./shared/*"        // Shared types/schemas
```

## Technology Stack

### Frontend

- **Framework**: React 18.3.1 + TypeScript 5.6.3
- **Build Tool**: Vite 7.3.0
- **Styling**: Tailwind CSS 3.4.17 with custom kid-friendly theme
- **UI Library**: Radix UI + shadcn/ui (47 components)
- **State Management**:
  - Zustand 5.0.9 (client state)
  - TanStack React Query 5.60.5 (server state)
- **Routing**: Wouter 3.3.5
- **Forms**: React Hook Form 7.55.0
- **Validation**: Zod 3.24.2
- **Animations**: Framer Motion 11.18.2
- **Presentation**: Reveal.js 5.2.1
- **Icons**: Lucide React 0.453.0
- **Date Utilities**: date-fns 3.6.0

### Backend

- **Runtime**: Node.js 20
- **Framework**: Express 4.21.2
- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM 0.39.3
- **Session**: express-session + memorystore
- **Auth**: Passport.js + passport-local
- **WebSocket**: ws 8.18.0

### Development Tools

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint 9.39.2 with typescript-eslint
- **Build**: esbuild 0.25.0 (server), Vite (client)
- **Database Tools**: Drizzle Kit 0.31.8
- **Dev Server**: tsx 4.20.5

## Development Workflows

### NPM Scripts

```bash
npm run dev          # Start development server (port 5000)
npm run build        # Production build (client + server)
npm start            # Run production server
npm run check        # Type checking
npm run typecheck    # Type checking (alias)
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues automatically
npm run db:push      # Push schema changes to database
```

### Development Server

- **Port**: 5000 (configurable via `PORT` env var)
- **Dev Mode**: Vite middleware with HMR
- **HMR Path**: `/vite-hmr`
- **Auto-restart**: Changes to server code restart the server

### Build Process

The build process (`npm run build`) performs:

1. **Clean**: Removes `dist/` directory
2. **Client Build**: Vite bundles React app → `dist/public/`
3. **Server Build**: esbuild bundles Express app → `dist/index.cjs`
   - Bundles select dependencies for faster cold starts
   - Minified CommonJS format
   - Most packages marked as external

### CI/CD Pipeline

GitHub Actions workflow runs on:
- Push to main branch
- Pull requests

Jobs:
1. **ESLint**: Code quality checks
2. **TypeScript**: Type checking

**Note**: No automated tests currently configured.

## Key Architectural Patterns

### 1. API Provider Pattern (Strategy Pattern)

Location: `client/src/lib/api/`

The application uses an abstraction layer for data fetching:

```typescript
// Environment determines provider
VITE_API_PROVIDER = "mock" | "real" | "football-data"

// All data access goes through provider interface
import { apiProvider } from "@/lib/api";
const matches = await apiProvider.getMatches();
```

**Current State**: Uses mock provider with local JSON data
**Future**: Ready for real API integration (football-data.org, TheSportsDB)

### 2. Data Layer Architecture

Location: `client/src/data/`

```text
schemas.ts    → Zod schemas (runtime validation + TypeScript types)
index.ts      → Data access layer with helper functions
*.json        → Static data files (English default)
*_ru.json     → Localized data files (Russian)
*_pt.json     → Localized data files (Portuguese, when added)
```

**Pattern**: Schema-first approach with centralized data access

### 3. State Management Strategy

#### Zustand Stores (Client State)

```typescript
// Persisted to localStorage
favorites.ts    → User's saved facts and matches
language.ts     → Language preference

// Session state
slides.ts       → Current slide tracking
```

#### TanStack Query (Server State)

```typescript
// Configuration
- Infinite stale time (data doesn't refetch)
- No window focus refetching
- Match details disabled by default (enabled on demand)
```

### 4. Component Architecture

```text
components/ui/      → Base components (atoms) from shadcn/ui
components/         → Composite components
slides/             → Feature components (organisms)
```

**Pattern**: Atomic Design influence with composition

### 5. Type Safety Strategy

1. **Schema-First**: Zod schemas define both validation and types
2. **Shared Types**: Database schema shared via `@shared/schema`
3. **Strict TypeScript**: All strict compiler options enabled
4. **Type Inference**: Heavy use of `z.infer<>` and `$inferSelect`

```typescript
// Example
export const matchSchema = z.object({
  id: z.number(),
  homeTeam: z.string(),
  // ...
});

export type Match = z.infer<typeof matchSchema>;
```

## Code Conventions

### File Naming

- **Components**: PascalCase (`IntroSlide.tsx`, `LanguageToggle.tsx`)
- **Utilities**: camelCase (`queryClient.ts`, `utils.ts`)
- **Data Files**: camelCase (`tournaments.json`, `matches_ru.json`)
- **Component Exports**: Match filename (e.g., `IntroSlide.tsx` exports `function IntroSlide()`)

### Import Patterns

```typescript
// External imports first
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Alias imports
import { Button } from "@/components/ui/button";
import { useFavoritesStore } from "@/store/favorites";

// Relative imports last
import { MatchCard } from "./MatchCard";
```

### CSS Architecture

1. **CSS Variables**: HSL-based theming in `client/src/index.css`
2. **Utility-First**: Tailwind CSS throughout
3. **Custom Utilities**:
   - Elevation system (`elevation-1` through `elevation-4`)
   - Kid-friendly font sizes (`text-kid-sm`, `text-kid-lg`, etc.)
4. **Component Variants**: Using `class-variance-authority`

### TypeScript Conventions

```typescript
// Prefer inference over explicit types
const matches = useMatches(); // Type inferred

// Use z.infer for schema types
type Match = z.infer<typeof matchSchema>;

// Use Drizzle inference for DB types
type User = typeof users.$inferSelect;

// Prefix unused params with underscore
onClick={(_event) => handleClick()}
```

### Component Patterns

```typescript
// Prefer named exports for components
export function IntroSlide() {
  // ...
}

// Use data-testid for testing hooks
<button data-testid="favorite-button">

// Destructure props inline
export function MatchCard({ match, onSelect }: MatchCardProps) {
  // ...
}
```

## Working with the Codebase

### Adding a New Slide

1. Create component in `client/src/slides/NewSlide.tsx`
2. Follow existing slide structure (use `Card` components)
3. Add to slide navigation in main App
4. Update slide store if needed
5. Add translations if using internationalized text

### Adding New Data

1. Define Zod schema in `client/src/data/schemas.ts`
2. Add JSON data file to `client/src/data/`
3. Add data access function in `client/src/data/index.ts`
4. Update API provider interface if needed
5. Add localized versions (`*_ru.json`, `*_pt.json`)

### Adding a New UI Component

1. Use shadcn/ui CLI: `npx shadcn@latest add <component>`
2. Components added to `client/src/components/ui/`
3. Customize in place (don't create separate override files)
4. Follow existing component patterns
5. Use CSS variables for theming

### Adding State Management

**For Client State** (Zustand):
```typescript
// Create store in client/src/store/newStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useNewStore = create(
  persist(
    (set) => ({
      // state and actions
    }),
    { name: "new-store" }
  )
);
```

**For Server State** (React Query):
```typescript
// Add to appropriate API provider
export const useNewData = () => {
  return useQuery({
    queryKey: ["newData"],
    queryFn: () => apiProvider.getNewData(),
  });
};
```

### Adding Translations

The project uses a file-based localization approach where data files have language-specific variants:

1. Add English content in base file: `client/src/data/<name>.json`
2. Add Russian content in: `client/src/data/<name>_ru.json`
3. Add Portuguese content in: `client/src/data/<name>_pt.json` (if applicable)
4. The language store (`client/src/store/language.ts`) manages the active language preference
5. Components load the appropriate file based on the selected language

### Database Schema Changes

1. Edit `shared/schema.ts` (Drizzle schema)
2. Run `npm run db:push` to apply changes
3. Update seed data if needed
4. Update TypeScript types (auto-inferred by Drizzle)

### Modifying Styles

**Global Styles**: Edit `client/src/index.css`
- CSS variables for theme colors
- Custom Tailwind utilities
- Base component styles

**Component Styles**: Use Tailwind classes
- Follow existing patterns (utility-first)
- Use kid-friendly font sizes (`text-kid-*`)
- Use elevation utilities for hover states

**Theme Customization**: Edit `tailwind.config.ts`
- Custom colors
- Custom font sizes
- Custom border radii
- Plugin configuration

## Testing Strategy

### Current State

⚠️ **No automated tests currently configured**

The codebase does NOT have:
- Test files (*.test.ts, *.spec.ts)
- Test framework (Jest, Vitest, etc.)
- Test scripts in package.json

### Testing Preparation

The codebase includes extensive `data-testid` attributes throughout components, indicating intention for future testing implementation.

### Recommended Testing Setup

When adding tests, consider:

1. **Unit Tests**: Vitest (integrates well with Vite)
2. **Component Tests**: React Testing Library
3. **E2E Tests**: Playwright or Cypress
4. **API Tests**: Supertest for Express endpoints

**Note**: Always add test scripts to CI workflow after implementation.

## Deployment

### Production Build

```bash
npm run build
```

Creates:
- `dist/public/` - Client bundle (static assets)
- `dist/index.cjs` - Server bundle (single file)

### Production Server

```bash
npm start
# or
NODE_ENV=production node dist/index.cjs
```

### Replit Deployment

The project is configured for Replit deployment:
- **Platform**: Autoscale
- **Build Command**: `npm run build`
- **Run Command**: `node ./dist/index.cjs`
- **Port**: 5000 (forwarded to 80)

### Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 5000)

Optional:
- `VITE_API_PROVIDER` - API provider selection (default: "mock")
- `NODE_ENV` - Environment (development/production)

## Common Tasks

### Adding a New Feature

1. **Plan**: Identify affected slides/components
2. **Data First**: Add schemas and data if needed
3. **UI Components**: Build or use existing UI components
4. **State Management**: Add stores if needed
5. **Integration**: Connect to slides
6. **Testing**: Add `data-testid` attributes
7. **Translations**: Add multi-language support
8. **Documentation**: Update this file if architectural changes

### Refactoring Components

1. **Type Safety**: Maintain or improve type definitions
2. **Data Testids**: Keep existing test hooks
3. **Backwards Compatibility**: Maintain existing APIs
4. **Performance**: Watch for unnecessary re-renders
5. **Accessibility**: Maintain kid-friendly design principles

### Debugging

**Client Issues**:
- Check browser console for errors
- Use React DevTools for component inspection
- Check Network tab for API calls
- Verify data with Zod validation errors

**Server Issues**:
- Check terminal for server logs
- Verify database connection
- Check Express routes in `server/routes.ts`
- Verify Vite middleware in development

**Build Issues**:
- Clear `dist/` and rebuild
- Check TypeScript errors with `npm run check`
- Verify import paths and aliases
- Check esbuild/Vite configuration

### Performance Optimization

**Current Optimizations**:
- React Query prevents unnecessary refetches
- Zustand with persistence for local state
- Vite code splitting and tree shaking
- esbuild for fast server builds

**Watch Out For**:
- Large JSON data files (consider pagination)
- Unnecessary re-renders (use React DevTools Profiler)
- Expensive computations (memoize with useMemo/useCallback)
- Large bundle sizes (check with Vite bundle analyzer)

### Code Quality

**Before Committing**:
```bash
npm run lint:fix    # Fix linting issues
npm run check       # Type check
```

**CI will automatically**:
- Run ESLint
- Run TypeScript type checking

### Working with GitHub

Helper scripts in root directory:
- `fetch-pr-feedback.sh` - Get PR feedback
- `fetch-workflow-runs.sh` - Get workflow run data
- `search-docs-online.sh` - Search documentation

Use GitHub CLI (gh) for PR operations:
```bash
gh pr create
gh pr view
gh pr checkout <number>
```

## Important Patterns and Practices

### Do's ✅

1. **Always validate data with Zod schemas**
2. **Use path aliases (`@/`, `@shared/`)**
3. **Follow kid-friendly design principles**
4. **Add `data-testid` to interactive elements**
5. **Maintain type safety end-to-end**
6. **Use existing UI components before creating new ones**
7. **Keep components focused and composable**
8. **Persist user preferences (favorites, language)**
9. **Support all three languages (EN, RU, PT)**
10. **Run lint and typecheck before pushing**

### Don'ts ❌

1. **Don't bypass type safety with `any`**
2. **Don't add dependencies without considering bundle size**
3. **Don't break the API provider abstraction**
4. **Don't modify shadcn/ui components' core functionality**
5. **Don't remove `data-testid` attributes**
6. **Don't hardcode strings (use translation system)**
7. **Don't add complex logic to components (use hooks/utils)**
8. **Don't commit without running lint/typecheck**
9. **Don't add adult-focused or complex UI patterns**
10. **Don't skip Zod validation for external data**

### Kid-Friendly Design Principles

When working on UI:

1. **Large Touch Targets**: Minimum 48px for interactive elements
2. **Clear Visual Feedback**: Hover and active states for all buttons
3. **Bright Colors**: High contrast, vibrant color palette
4. **Simple Language**: Age-appropriate text (9-10 years old)
5. **Generous Spacing**: Ample padding and margins
6. **Large Text**: Use `text-kid-*` utilities
7. **Clear Icons**: Lucide icons with descriptive labels
8. **Smooth Animations**: Framer Motion for delight
9. **Error Prevention**: Confirmations for destructive actions
10. **Visual Hierarchy**: Clear distinction between sections

### Performance Considerations

1. **Data Loading**: Static JSON is pre-bundled (fast)
2. **State Updates**: Zustand is performant for client state
3. **Re-renders**: React Query prevents unnecessary fetches
4. **Bundle Size**: Monitor with Vite build output
5. **Lazy Loading**: Consider for large components (not currently implemented)

---

## Quick Reference

### Project Commands
```bash
npm run dev        # Development server
npm run build      # Production build
npm start          # Production server
npm run lint:fix   # Fix linting
npm run check      # Type check
npm run db:push    # Update database schema
```

### Important Paths
```text
client/src/components/ui/    # Base UI components
client/src/slides/           # Main slide components
client/src/data/             # Data layer
client/src/store/            # State management
client/src/lib/api/          # API abstraction
shared/schema.ts             # Database schema
```

### Key Files
- `vite.config.ts` - Vite configuration
- `tailwind.config.ts` - Tailwind + theme configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration
- `client/src/index.css` - Global styles + CSS variables
- `client/src/data/schemas.ts` - Data type definitions

### Documentation Files
- `replit.md` - Project overview and setup
- `design_guidelines.md` - Design system documentation
- `GITHUB_API_GUIDE.md` - GitHub API integration guide

---

## Getting Help

When working on this codebase:

1. **Architecture Questions**: Refer to this document
2. **Design Questions**: See `design_guidelines.md`
3. **Setup Questions**: See `replit.md`
4. **Type Errors**: Check `schemas.ts` and `shared/schema.ts`
5. **Styling Questions**: Check `tailwind.config.ts` and `index.css`

For AI assistants: This document should provide sufficient context to work effectively with this codebase. Follow the established patterns, maintain type safety, and prioritize the kid-friendly user experience in all changes.

---

**Last Updated**: 2026-01-11
**Repository**: timnik82/world-cup
