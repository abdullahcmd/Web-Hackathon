# Design Guidelines: Farmer Empowerment Platform

## Design Approach

**Hybrid Approach**: Material Design principles adapted for agricultural context with emphasis on data clarity and mobile accessibility.

**Rationale**: This platform serves utility-focused needs (market data, weather, trends) for users who may have varying tech literacy and primarily access via mobile devices. Material Design provides familiar patterns, strong hierarchy, and proven accessibility, while custom adaptations ensure agricultural data is presented clearly.

**Key Principles**:
- Data clarity over decoration
- Mobile-first responsive design
- Trust through professional presentation
- Scannable information architecture
- Action-oriented interfaces

---

## Typography System

**Font Stack**: 
- Primary: Inter (Google Fonts) - excellent readability for data-heavy interfaces
- Monospace (for prices/numbers): JetBrains Mono - enhances numerical data legibility

**Type Scale**:
- Hero Headings: text-4xl md:text-5xl lg:text-6xl, font-bold
- Section Headings: text-2xl md:text-3xl, font-semibold
- Subsection Headings: text-xl md:text-2xl, font-semibold
- Card/Component Titles: text-lg md:text-xl, font-medium
- Body Text: text-base, font-normal
- Supporting/Meta Text: text-sm, font-normal
- Micro Text (labels, timestamps): text-xs, font-medium
- Data Numbers (prices, stats): text-lg md:text-2xl, font-bold, tracking-tight (use monospace)

**Line Height**: Use generous line-height for readability - leading-relaxed for body text, leading-tight for headings

---

## Layout System

**Spacing Primitives**: Limit to Tailwind units of **2, 4, 8, 12, 16, 20** for consistency
- Micro spacing (between related items): gap-2, space-x-2
- Component internal padding: p-4, p-6
- Section padding (mobile): py-12, px-4
- Section padding (desktop): py-20, px-8
- Major section gaps: gap-12, gap-16
- Container margins: mx-auto

**Grid System**:
- Max container width: max-w-7xl
- Dashboard grids: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Stats cards: grid grid-cols-2 md:grid-cols-4 gap-4
- Price table: full-width with horizontal scroll on mobile

**Breakpoints Strategy**:
- Mobile-first base styles
- md: 768px (tablet landscape)
- lg: 1024px (desktop)
- xl: 1280px (large desktop)

---

## Component Library

### Navigation & Headers

**Admin/Farmer Dashboard Header**:
- Sticky header: sticky top-0 z-50
- Height: h-16
- Contains: Logo, navigation links, user profile dropdown, role badge
- Layout: Horizontal flex with space-between
- Profile section: Avatar (h-10 w-10) + username + role badge

**Role Badge**: 
- Small pill design (px-3 py-1, text-xs, rounded-full)
- Positioned next to username
- Different visual treatment for Admin vs Farmer (use border variations, not color)

### Dashboard Components

**Stats Card** (for summaries):
- Minimum height: min-h-32
- Padding: p-6
- Border: border with subtle shadow
- Structure: Icon (top-left, h-8 w-8) + Label (text-sm) + Large Number (text-3xl, font-bold, monospace) + Trend indicator (small text with arrow)
- Layout: Vertical stack with items-start

**Price Table Card**:
- Full-width container
- Search/filter bar at top: h-12 with search icon and input
- Table structure: Striped rows for better scannability
- Columns: Vegetable/Fruit Name | Region | Current Price | Previous Price | Change % | Actions
- Price cells: Monospace font, right-aligned, font-bold
- Change indicators: Small arrows or text showing increase/decrease
- Mobile: Stack to card-based layout with key info visible

**Chart Container**:
- Aspect ratio: aspect-video or fixed height h-80
- Padding: p-6
- Title above chart: text-lg font-semibold mb-4
- Chart area: Full width with responsive scaling
- Legend: Bottom or right side, clear labels
- Comparison mode: Side-by-side on desktop, stacked on mobile

### Weather Module Components

**City Weather Card**:
- Compact card design: p-6
- Grid layout: 2x2 on mobile, 3x2 on tablet, 5x1 on desktop
- Structure: 
  - City name (text-lg font-semibold)
  - Weather icon (h-16 w-16, central placement)
  - Temperature (text-4xl font-bold, monospace)
  - Condition text (text-sm)
  - Humidity/Wind (text-xs in horizontal row)
- Visual hierarchy: Temperature is focal point

**Pakistan Map Visualization** (Bonus):
- Container: Full-width with max-height
- SVG-based map with clickable regions
- Regions indicated with different border treatments (not colors)
- Hover state: Tooltip showing detailed weather
- Mobile: Simplified version or vertical list fallback

### Form Components

**Admin Upload Form**:
- Two-column grid on desktop, single column on mobile
- Field groups: Logical spacing with mb-6
- Input fields: h-12, rounded-lg, border, px-4
- Labels: text-sm font-medium mb-2
- Helper text: text-xs below inputs
- File upload: Dashed border dropzone, h-32
- Action buttons: Right-aligned on desktop, full-width stacked on mobile

**Search & Filter Bar**:
- Horizontal layout: flex items-center gap-4
- Height: h-12
- Search input: flex-1 with icon (search icon left, clear icon right)
- Filter dropdowns: Fixed width w-40
- Apply button: Prominent, ml-auto

### Authentication Pages

**Login/Register Forms**:
- Centered card: max-w-md mx-auto
- Vertical padding: py-20
- Card padding: p-8
- Form spacing: space-y-6
- Input fields: Full width, h-12
- Button: Full width, h-12
- Role selection: Radio buttons with card-style options (horizontal on desktop)

### Data Visualization Elements

**7-Day Trend Chart**:
- Container: Border card with p-6
- Title section: Vegetable name (text-xl font-semibold) + date range (text-sm)
- Chart type: Line chart with smooth curves
- Y-axis: Price (with currency symbol)
- X-axis: Dates (abbreviated format)
- Grid lines: Subtle horizontal lines for reference
- Tooltips: Show exact price + date on hover
- Responsive: Maintain aspect ratio, scale font sizes

**Multi-Crop Comparison Chart**:
- Same container as single chart but taller (h-96)
- Legend: Top-right corner, horizontal layout
- Different line styles (solid, dashed, dotted) for each crop
- Up to 3 crops maximum for clarity

### Action Buttons

**Primary Actions**: 
- Height: h-12
- Padding: px-6
- Rounded: rounded-lg
- Font: text-base font-medium
- Examples: Upload Data, Save Changes, Add Entry

**Secondary Actions**:
- Same height, less visual weight (outline style)
- Examples: Cancel, View Details, Export

**Icon Buttons** (table actions):
- Size: h-10 w-10
- Rounded: rounded-md
- Icons: Edit, Delete, View (use Heroicons)

### Tables

**Responsive Data Table**:
- Desktop: Full table with all columns
- Tablet: Hide less critical columns
- Mobile: Transform to stacked cards
- Header: Sticky positioning, font-medium
- Rows: min-h-16, border-b
- Cell padding: px-4 py-3
- Sort indicators: Small arrows in headers
- Pagination: Bottom, centered, h-12 controls

---

## Page Layouts

### Landing/Marketing Page (if needed)
- Hero section: h-screen on desktop, min-h-96 on mobile
- Hero content: Centered, max-w-4xl
- Hero headline: text-5xl md:text-7xl, font-bold, leading-tight
- Hero supporting text: text-xl md:text-2xl, mt-6
- Hero CTA: Two buttons horizontal (Primary + Secondary), mt-8
- Features section: 3-column grid showcasing platform capabilities
- Social proof: Stats bar with 4 metrics in horizontal layout
- Footer: Multi-column (4 cols desktop, stacked mobile) with navigation, contact, social

### Admin Dashboard Layout
- Sidebar navigation: w-64 on desktop, collapsible on mobile
- Main content area: pl-64 on desktop (when sidebar open)
- Top stats row: 4 cards in grid
- Action section: Upload form in prominent card
- Recent uploads table: Full-width below
- Section spacing: space-y-8

### Farmer Dashboard Layout
- No sidebar (simpler navigation)
- Top navigation bar with tabs (Prices | Weather | Trends | Forum)
- Quick stats: 3 cards showing market highlights
- Price table: Prominent, with search prominently placed
- Weather section: Horizontal scrolling cards on mobile, grid on desktop
- Chart section: Tabs for individual crops or comparison view

---

## Images

**Hero Image** (Landing page if created):
- Large hero background: Pakistani farmland or market scene
- Treatment: Subtle overlay to ensure text readability
- Position: Full-width, behind hero content
- Image description: Vibrant Pakistani vegetable market or lush farm fields with farmers working

**Dashboard Illustrations**:
- Empty states: Simple illustrations for "No data yet" states
- Description: Minimalist line drawings of vegetables, charts, or farmers
- Size: w-48 h-48, centered in empty state containers

**Weather Icons**:
- Use icon library (Heroicons or Font Awesome weather icons)
- Size: h-16 w-16 for main display, h-8 w-8 for compact
- Position: Centered above temperature in weather cards

**Avatar Placeholders**:
- User profiles: Circular, h-10 w-10 in header, h-24 w-24 in profile pages
- Default: Initials on subtle background

**No large decorative images** needed for dashboard areas - focus on data clarity

---

## Accessibility & Responsiveness

- All interactive elements: Minimum touch target 44x44px (h-12 w-12)
- Form inputs: Consistent height h-12 across entire app
- Focus states: Clear visible outline for keyboard navigation
- Color-independent information: Use icons, patterns, or labels alongside any color coding
- Screen reader labels: All icons and actions have descriptive aria-labels
- Mobile navigation: Bottom tab bar for primary sections (for thumb-friendly access)
- Tables: Horizontal scroll with scroll indicators on mobile

---

## Animation Strategy

**Minimal, purposeful animations only**:
- Page transitions: None or subtle fade
- Loading states: Simple spinner (h-8 w-8, centered)
- Chart rendering: Smooth draw-in over 0.5s
- Dropdown menus: Slide down with 200ms duration
- Hover states: Subtle scale (scale-105) on cards, no animation on buttons
- **No** scroll-triggered animations, parallax, or decorative motion

---

This design system prioritizes **data accessibility, mobile usability, and trust** - essential for farmers making critical business decisions. The component-based structure ensures consistency across all pages while maintaining flexibility for data-heavy displays.