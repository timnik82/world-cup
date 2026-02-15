# FIFA World Cup History - Interactive Presentation

## Overview
An interactive web presentation about FIFA World Cup history (1930–present) built for kids ages 9-10. Each slide is a React screen with interactive elements, featuring kid-friendly design with large buttons, bright colors, and engaging animations.

## Tech Stack
- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **Presentation**: Reveal.js (integrated inside React)
- **Animations**: Framer Motion
- **Data Fetching**: TanStack Query (React Query)
- **State Management**: Zustand
- **Data Validation**: Zod

## Project Structure
```
client/src/
├── data/           # Local JSON data and Zod schemas
│   ├── schemas.ts  # Zod validation schemas
│   ├── tournaments.json
│   ├── matches.json
│   ├── facts.json
│   └── matchDetails.json
├── deck/           # Reveal.js wrapper
│   └── Deck.tsx
├── slides/         # Individual slide components
│   ├── IntroSlide.tsx
│   ├── TimelineSlide.tsx
│   ├── MatchesSlide.tsx
│   ├── MatchDetailsModal.tsx
│   ├── RecordsSlide.tsx
│   └── FavoritesSlide.tsx
├── store/          # Zustand stores
│   ├── favorites.ts
│   └── slides.ts
├── lib/api/        # API adapter layer
│   ├── index.ts
│   ├── types.ts
│   └── mockProvider.ts
└── components/     # Reusable UI components
```

## MVP Features (6 Slides)
1. **Intro Slide**: Random fact button, add to favorites
2. **Timeline Slide**: Scrollable year buttons with prev/next navigation (1930-2022, all 22 World Cups), tournament card with champion, runner-up, final score
3. **Matches Slide**: Filters (year + stage), match list, show details button
4. **Match Details Modal**: On-demand API call (TanStack Query with enabled:false)
5. **Records Slide**: Computed stats from local data, recompute button
6. **Favorites Slide**: List saved facts and matches, remove functionality

## Data
- All data lives locally in `/client/src/data/` as JSON
- Complete data for all 22 World Cup tournaments (1930-2022)
- 15 matches with key games from each tournament
- 15 kid-friendly facts about World Cup history
- Match details for notable games (1986 Final, 2022 Final, etc.)

## API Provider System
The app uses an adapter pattern for match details API calls:
- **Mock Provider** (default): Uses local JSON data
- Ready for future real providers (football-data.org, TheSportsDB)

To switch providers, set `VITE_API_PROVIDER` in `.env`:
```
VITE_API_PROVIDER=mock  # Default
```

## Design Decisions
- **Kid-friendly**: Large buttons (min-h-14), readable fonts (kid-* sizes), bright playful colors
- **Light mode only**: Optimized for young audience
- **Favorites**: Persisted to localStorage
- **Reveal.js**: Single initialization, slide change events for state updates

## Development
```bash
npm install    # Install dependencies
npm run dev    # Start development server (port 5000)
npm run build  # Production build
```

## Recent Changes
- Added complete World Cup tournament data for all 22 editions (1930-2022)
- Redesigned Timeline Slide UI with horizontally scrollable year buttons, prev/next arrows, and dot indicator for 22 years
- Attendance stat now shows "K" for older tournaments under 1M attendance
- Initial MVP implementation with 6 slides
- Kid-friendly design with larger buttons and bright colors
- Zustand store for favorites with localStorage persistence
- API adapter layer for future provider integration
