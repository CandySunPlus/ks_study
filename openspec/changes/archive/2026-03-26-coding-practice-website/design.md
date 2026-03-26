## Context

The user has four JSON files containing exam questions (马克思主义基本原理, 中国近代史纲要, 习近平新时代, 中国近代史纲要_2) with structured question data including single-choice and multiple-choice questions. Each question has a title, answer options, correct answer, and scoring information. The user needs a fast, efficient tool for practicing these questions and tracking mistakes for review.

Current state: JSON files exist but no interface for practicing or tracking progress.

## Goals / Non-Goals

**Goals:**
- Build a single-page web application that runs entirely in the browser
- Fast question navigation and answer submission for efficient practice
- Persistent wrong answer tracking using browser localStorage
- Dedicated review mode for wrong answers only
- Simple, distraction-free UI optimized for speed

**Non-Goals:**
- Backend server or database (client-side only)
- User authentication or multi-user support
- Question editing or management features
- Mobile app (responsive web is sufficient)
- Spaced repetition algorithms (simple wrong answer review only)

## Decisions

### 1. Technology Stack: Vanilla JavaScript + HTML/CSS
**Decision**: Use vanilla JavaScript without frameworks (React, Vue, etc.)

**Rationale**:
- Simplicity: No build process, dependencies, or compilation needed
- Performance: Direct DOM manipulation is fast enough for this use case
- Portability: Single HTML file can be opened directly in browser
- Learning curve: Easier to maintain and modify without framework knowledge

**Alternatives considered**:
- React/Vue: Rejected due to added complexity and build requirements for a simple tool
- Static site generator: Overkill for a single-page application

### 2. Data Loading: Fetch API with relative paths
**Decision**: Load JSON files using fetch() with relative file paths

**Rationale**:
- Native browser API, no dependencies
- Asynchronous loading prevents UI blocking
- Can handle multiple JSON files dynamically

**Trade-off**: Requires running from a local web server (file:// protocol has CORS restrictions)

**Alternatives considered**:
- Inline JSON in HTML: Rejected due to maintainability (JSON files should remain separate)
- IndexedDB: Overkill for read-only question data

### 3. Storage: localStorage for wrong answers
**Decision**: Use localStorage to persist wrong answer tracking

**Rationale**:
- Simple key-value API, no setup required
- Synchronous access is fine for small datasets
- Persists across browser sessions
- Sufficient storage (~5-10MB) for question IDs and metadata

**Data structure**:
```javascript
{
  "wrongAnswers": {
    "马克思主义基本原理": [16628, 16650, ...],  // questionIds
    "中国近代史纲要": [12345, ...]
  },
  "stats": {
    "马克思主义基本原理": {
      "total": 243,
      "completed": 100,
      "correct": 85,
      "wrong": 15
    }
  }
}
```

**Alternatives considered**:
- IndexedDB: More complex API, unnecessary for simple key-value storage
- Cookies: Size limitations and sent with every request (wasteful)

### 4. UI Architecture: Single-page with view switching
**Decision**: Single HTML file with JavaScript-controlled view switching (practice mode, review mode, dashboard)

**Rationale**:
- No page reloads = faster navigation
- Maintains application state in memory
- Simple routing via hash URLs (#practice, #review, #dashboard)

**Views**:
1. **Subject Selection**: Choose which JSON file to practice
2. **Practice Mode**: Display question, capture answer, show feedback
3. **Review Mode**: Same as practice but filtered to wrong answers only
4. **Dashboard**: Statistics and progress overview

### 5. Question Navigation: Linear with keyboard shortcuts
**Decision**: Linear navigation with Next/Previous buttons + keyboard shortcuts (Enter to submit, N for next, P for previous)

**Rationale**:
- Optimized for speed (keyboard-first interaction)
- Simple mental model (no complex question trees)
- Supports both mouse and keyboard users

**Alternatives considered**:
- Random question order: Can be added as an option later
- Question list sidebar: Adds visual complexity, not needed for speed-focused tool

## Risks / Trade-offs

**[Risk] Browser compatibility issues with localStorage or fetch API**
→ Mitigation: Target modern browsers (Chrome, Firefox, Safari, Edge) with feature detection and fallback messages

**[Risk] JSON files are large and slow to load**
→ Mitigation: Load files on-demand when subject is selected, show loading indicator; cache in memory after first load

**[Risk] User clears browser data and loses wrong answer tracking**
→ Mitigation: Add export/import functionality for localStorage data (JSON download/upload)

**[Risk] CORS restrictions when opening HTML file directly**
→ Mitigation: Document requirement to run from local web server (python -m http.server or VS Code Live Server)

**[Trade-off] No backend means no cross-device sync**
→ Acceptable: User explicitly wants a simple local tool; can export/import data manually if needed

**[Trade-off] localStorage size limits (~5-10MB)**
→ Acceptable: Storing question IDs and stats will be well under 1MB even with thousands of questions
