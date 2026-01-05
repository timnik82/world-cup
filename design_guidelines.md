# FIFA World Cup History App - Design Guidelines

## Design Approach
**Material Design + Sports Editorial Hybrid**: Combine Material Design's data-presentation clarity with bold sports media typography and dramatic spacing. Think ESPN meets Google's design language - clean information architecture with energetic, celebratory moments.

Reference inspirations: 
- Data visualization: Google's Material Design for clear hierarchies
- Sports energy: ESPN, FIFA.com for celebratory aesthetic
- Interaction patterns: Linear for smooth micro-interactions

## Typography System

**Font Families** (via Google Fonts CDN):
- Primary: Inter (400, 500, 600, 700) - UI elements, body text, data
- Display: Poppins (600, 700, 800) - slide titles, tournament years, scores
- Monospace: JetBrains Mono (500) - match times, numerical stats

**Type Scale**:
- Slide Titles: text-5xl to text-6xl (Poppins Bold)
- Section Headers: text-3xl to text-4xl (Poppins Semibold)
- Card Titles: text-xl to text-2xl (Inter Semibold)
- Body/Data: text-base to text-lg (Inter Regular)
- Captions/Labels: text-sm (Inter Medium)
- Stats/Scores: text-4xl to text-7xl (Poppins Bold) for emphasis

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 24 for consistent rhythm
- Component padding: p-6 to p-8
- Card spacing: gap-6 to gap-8
- Section margins: mt-12 to mt-16
- Slide padding: px-16 py-12 (desktop), px-6 py-8 (mobile)

**Grid System**:
- Matches table: 3-4 column grid on desktop, stack on mobile
- Stats/Records: 2-3 column for stat cards
- Filters: Horizontal flex layout with gap-4
- Modal content: Single column max-w-4xl centered

## Slide-by-Slide Components

### 1. Intro Slide
- Full-viewport centered layout (min-h-screen flex items-center justify-center)
- Hero section with large title (text-6xl), subtitle (text-2xl)
- Two prominent CTAs arranged horizontally (gap-4)
- Background: Subtle gradient or pattern, NOT solid
- Random fact displayed in a card (max-w-2xl) below hero with generous padding (p-8)

### 2. Timeline Slide
- Split layout: Slider control top, card display below
- Year slider: Full-width with large year display (text-5xl) beside it
- Tournament card: Elevated card (shadow-xl) with:
  - Host country (text-3xl)
  - Champion vs Runner-up (text-2xl with "vs" separator)
  - Final score (text-6xl, monospace, centered, dramatic)
  - Grid layout for metadata (year, venue, attendance)

### 3. Matches Slide
- Filter bar: Sticky top section (sticky top-0) with dropdowns side-by-side
- Match table: Striped rows, hover states, clear column headers
- Columns: Date, Teams, Score, Stage, Actions
- "Show details" button: Small, right-aligned in each row
- Responsive: Convert to cards on mobile with stacked information

### 4. Match Details Modal
- Overlay: Backdrop with backdrop-blur-sm
- Modal: max-w-3xl, centered, shadow-2xl, rounded-xl
- Header: Match teams (text-3xl) with score (text-5xl) prominently displayed
- Content grid: 2-column layout for stats (possession, shots, etc.)
- Load button: Centered, large when details not loaded
- Close button: Top-right, icon-only (use Heroicons)

### 5. Records Slide
- Stat cards grid: 3 columns desktop, 2 tablet, 1 mobile
- Each card: Large number (text-6xl), label below (text-lg), icon/trophy graphic
- Recompute button: Top-right corner, secondary style
- Cards use dramatic number display with contextual descriptions
- Highlight top records with subtle border or elevation

### 6. Favorites Slide
- Two-section layout: Facts favorites and Match favorites
- Each section: Header (text-2xl) + grid of saved items
- Item cards: Compact with remove button (icon-only, top-right)
- Empty state: Centered message with suggestion to explore other slides
- Items displayed in 2-column grid on desktop

## Component Library

**Buttons**:
- Primary: Rounded (rounded-lg), medium padding (px-6 py-3), bold text
- Secondary: Outline style, same sizing
- Icon buttons: Square (w-10 h-10), centered icon
- All buttons: Implement hover/active states with subtle scale transforms

**Cards**:
- Base: Rounded (rounded-xl), shadow (shadow-lg), padding (p-6)
- Elevated: shadow-xl with slight border
- Interactive cards: Add hover lift (hover:-translate-y-1 transition)

**Form Controls**:
- Sliders: Custom styled with large thumb, visible track
- Dropdowns: Rounded (rounded-lg), clear options, adequate padding (p-3)
- All inputs: Focus rings, clear labels above

**Navigation**:
- Reveal.js default controls styled minimally
- Progress indicator at bottom
- Slide counter: Bottom-right, subtle

## Icons
Use **Heroicons** (outline style) via CDN for:
- Trophy/award icons for records
- Star icons for favorites
- Close/remove icons for modals
- Chevrons for navigation hints
- Flag icons for countries (or use placeholder)

## Animations
Minimal and purposeful with Framer Motion:
- Slide transitions: Subtle fade + slight slide (50px)
- Card reveals: Stagger children by 50ms
- Number counters: Animate on mount for stats
- Button interactions: Scale on press
- Modal: Fade overlay + scale modal from 0.95 to 1
- Avoid: Heavy parallax, continuous animations, distracting effects

## Responsive Breakpoints
- Desktop (lg: 1024px+): Full grid layouts, side-by-side elements
- Tablet (md: 768px): 2-column grids, reduce spacing slightly
- Mobile (base): Single column, stack all elements, larger touch targets (min-h-12)

## Images
**Hero/Background Treatment**:
- Intro slide: Abstract pattern or subtle football/stadium texture (not photo-realistic)
- No large hero images - this is data-focused
- Consider: Trophy silhouettes, geometric patterns inspired by football fields
- All imagery should be understated, supporting the content rather than dominating

**Icon Usage**:
- Trophy icons for champions/records
- Flag emojis or icon representations for countries
- No photographs of players/matches (focus on data presentation)

This design prioritizes information clarity while celebrating the drama of World Cup moments through bold typography and strategic use of scale.