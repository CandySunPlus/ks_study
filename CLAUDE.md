# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chinese study/practice question application built with vanilla JavaScript, HTML, and CSS. It supports multiple learning modes (practice, review, memorize), question types (single-choice, multiple-choice, short-answer), and includes progress tracking with localStorage persistence.

## Development Commands

### Running the Application

The app must be served via HTTP due to CORS restrictions when loading JSON files:

```bash
# Python 3 (recommended)
python3 -m http.server 8000

# Node.js alternative
npx http-server -p 8000
```

Then open `http://localhost:8000` in a browser.

### Testing

No automated tests exist. Manual testing is done through the browser.

## Architecture

### Core Application Structure

- **index.html** - Single-page application with three main views:
  - Dashboard view (subject selection, stats, data management)
  - Practice/Review view (question display, answer submission)
  - Memorize view (direct answer display without interaction)

- **app.js** (~1400 lines) - All application logic in vanilla JavaScript:
  - State management via global `state` object
  - LocalStorage for persistence (`wrongAnswers`, `stats`, `answeredQuestions`)
  - SessionStorage for UI state (navigation panel)
  - Question loading from JSON files
  - Three modes: practice (normal), review (wrong answers only), memorize (read-only)

- **styles.css** - Responsive CSS with mobile-first design, 44px minimum touch targets

### Question Data Format

Questions are loaded from JSON files in the root directory:
- `马克思主义基本原理.json`
- `中国近代史纲要.json`
- `习近平新时代.json`
- `中国近代史纲要_2.json`

Each question has:
```javascript
{
  questionId: "unique-id",
  title: "question text",
  type: 0 | 1 | 3,  // 0=single-choice, 1=multiple-choice, 3=short-answer
  answerOptions: [{number: 0, content: "option text"}],
  answer: [0] | "text",  // array of indices for choices, string for short-answer
  analysis: "explanation text (optional)",
  score: 2
}
```

### State Management

The `state` object tracks:
- `currentView`: 'dashboard' | 'practice'
- `currentSubject`: subject name when practicing
- `currentQuestionIndex`: current question position
- `questions`: array of questions for current session
- `isReviewMode`: boolean for review mode
- `isMemorizeMode`: boolean for memorize mode
- `isRandomMode`: boolean for random practice mode
- `sessionAnswers`: temporary answer tracking
- `questionsCache`: loaded question data by subject
- `navigationPanelOpen`: UI state for side panel
- `questionStatuses`: per-question status (unanswered/correct/incorrect/viewed)
- `type3Revealed`: track if short-answer questions have been revealed

### LocalStorage Schema

- `wrongAnswers`: `{[subjectName]: [questionId, ...]}`
- `stats`: `{[subjectName]: {total, completed, correct, wrong}}`
- `answeredQuestions`: `{[subjectName]: {[questionId]: {status, selectedAnswers}}}`
- `practiceMode`: `{mode: 'random' | 'sequential', timestamp}`

## OpenSpec Workflow Integration

This repository uses OpenSpec for change management:

- **openspec/specs/** - Main specifications for each feature
- **openspec/changes/archive/** - Archived completed changes with:
  - `proposal.md` - Initial change proposal
  - `design.md` - Design decisions
  - `specs/` - Incremental specs for the change
  - `tasks.md` - Implementation tasks

When making changes:
1. Use `/opsx:propose` or `/opsx:new` to start a new change
2. Work through specs incrementally with `/opsx:continue`
3. Implement with `/opsx:apply`
4. Verify with `/opsx:verify`
5. Archive with `/opsx:archive`

See `.claude/skills/openspec-*` for available workflow commands.

## Key Patterns

### Question Loading
- Questions are fetched via `fetch()` and cached in `state.questionsCache`
- Review mode filters to only wrong answers
- Random mode shuffles questions using Fisher-Yates algorithm
- Loading is async with loading indicators

### Answer Submission
- Single-choice: radio buttons, keyboard A/B/C/D
- Multiple-choice: checkboxes
- Short-answer: click or Enter/Space to reveal
- Validation checks answer correctness and updates stats/wrong answers
- Results persist to localStorage immediately

### Navigation Panel
- Right sidebar showing all questions with status indicators
- Gray (•): unanswered, Green (✓): correct, Red (✗): wrong, Blue (📖): viewed (type 3)
- Direct navigation by clicking question numbers
- Collapsible with keyboard shortcut 'V'

### Data Management
- Export: downloads JSON with all localStorage data
- Import: restores from exported JSON
- Clear: resets all data with confirmation

## Code Conventions

- Use vanilla JavaScript (ES6+), no frameworks
- Use `const` for immutability where possible
- Functions are organized by category with comment headers
- Event listeners use named functions for clarity
- All user-facing text is in Chinese
- Use semantic HTML and ARIA labels for accessibility
- CSS uses kebab-case for classes
- JavaScript uses camelCase for variables/functions

## Important Notes

- The app is fully client-side with no backend
- All data is stored in browser localStorage (cleared if browser data is cleared)
- CORS restrictions require serving via HTTP server (not file://)
- Mobile-responsive with minimum 44px touch targets
- Keyboard shortcuts are extensive (see README for full list)
- Type 3 (short-answer) questions don't count toward wrong answer statistics
