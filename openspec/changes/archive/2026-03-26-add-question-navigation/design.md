## Context

The current practice tool allows sequential navigation (Next/Previous) but lacks a way to jump to specific questions. Users working through 243+ question sets need better navigation for:
- Resuming practice at a specific point
- Reviewing specific questions
- Seeing overall progress at a glance

Current state: Practice/review modes show one question at a time with only sequential navigation buttons.

## Goals / Non-Goals

**Goals:**
- Add a collapsible navigation panel showing all questions in the current session
- Display question status (unanswered, correct, incorrect) with visual indicators
- Enable direct jump to any question by clicking its number
- Maintain the existing clean, distraction-free UI when panel is closed
- Persist panel open/closed state during the session

**Non-Goals:**
- Question filtering or sorting (beyond existing review mode)
- Question bookmarking or favorites
- Multi-select or bulk operations
- Search functionality within questions
- Mobile-specific swipe navigation (responsive layout is sufficient)

## Decisions

### 1. UI Layout: Collapsible Side Panel
**Decision**: Add a collapsible side panel on the right side of the practice/review view

**Rationale**:
- Right side placement keeps the main question content left-aligned (natural reading flow)
- Collapsible design preserves the existing distraction-free experience
- Side panel allows viewing navigation while reading the current question
- Doesn't require page layout restructuring

**Alternatives considered**:
- Modal overlay: Rejected - requires closing to see the question, interrupts flow
- Top bar with horizontal scroll: Rejected - difficult to see status at a glance for 200+ questions
- Bottom drawer: Rejected - takes up valuable vertical space

### 2. Question Status Visualization: Color-Coded Grid
**Decision**: Display questions as a grid of numbered boxes with color coding

**Rationale**:
- Grid layout fits many questions in limited space (e.g., 10 columns × 25 rows for 243 questions)
- Color coding provides instant visual feedback:
  - Gray: Unanswered
  - Green: Answered correctly
  - Red: Answered incorrectly
  - Blue: Current question
- Numbers make it easy to identify specific questions

**Alternatives considered**:
- List view: Rejected - requires scrolling for large sets, less scannable
- Progress bar only: Rejected - doesn't allow jumping to specific questions
- Icon-only (no numbers): Rejected - harder to reference specific questions

### 3. Panel State Management: Session Storage
**Decision**: Use sessionStorage to persist panel open/closed state

**Rationale**:
- Persists during the practice session (across page refreshes if needed)
- Clears when user closes the tab (fresh start for new sessions)
- Simpler than localStorage (no cleanup needed)
- Lightweight (just a boolean flag)

**Alternatives considered**:
- localStorage: Overkill for session-specific UI preference
- State only (no persistence): Users would have to reopen panel after navigation

### 4. Panel Toggle: Icon Button in Header
**Decision**: Add a toggle button (icon: grid or list) in the practice view header

**Rationale**:
- Visible but not intrusive
- Consistent with existing header layout (exit button already there)
- Icon communicates purpose (grid/list icon = navigation)
- Single click to toggle

**Alternatives considered**:
- Keyboard shortcut only: Not discoverable enough
- Always visible panel: Defeats the purpose of distraction-free design
- Hamburger menu: Typically used for main navigation, could be confusing

### 5. Question Jump Behavior: Preserve Answer State
**Decision**: When jumping to a different question, preserve any unsaved answer selections in memory

**Rationale**:
- Prevents accidental loss of work
- Allows users to skip around while thinking
- Consistent with existing navigation behavior (Next/Previous already preserves state)

**Alternatives considered**:
- Require submit before jumping: Too restrictive, interrupts exploration
- Discard unsubmitted answers: Risk of data loss, poor UX

## Risks / Trade-offs

**[Risk] Panel may feel cluttered with 200+ questions**
→ Mitigation: Use compact grid layout (small boxes), add scrolling within panel, consider zoom/scale controls if needed

**[Risk] Color-blind users may not distinguish red/green status**
→ Mitigation: Add icons or patterns in addition to colors (✓ for correct, ✗ for incorrect, • for unanswered)

**[Risk] Panel toggle button may not be discoverable**
→ Mitigation: Show panel open by default on first visit, add tooltip on hover, consider brief animation on first load

**[Risk] Performance with large question sets (300+ questions)**
→ Mitigation: Use CSS grid for efficient rendering, avoid re-rendering entire panel on status updates (update only changed items)

**[Trade-off] Additional screen real estate for panel**
→ Acceptable: Panel is collapsible, users can hide it when not needed

**[Trade-off] More complex UI state management**
→ Acceptable: Benefit of improved navigation outweighs implementation complexity
