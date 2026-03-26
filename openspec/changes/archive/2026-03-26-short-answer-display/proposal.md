## Why

Currently, the app only handles multiple-choice questions (type 0 and type 1). Short-answer questions (type 3, 简述题) have empty `answerOptions` arrays, causing them to render with no content and making them unusable. Additionally, the mobile UI suffers from poor layout optimization with multi-line headers and navigation controls that wrap awkwardly on small screens.

Users need to:
- View and study short-answer reference materials
- Have a mobile-optimized interface that works well on phones
- Navigate efficiently with compact, single-row layouts

## What Changes

- Add support for type 3 (short-answer) questions with reveal pattern
- Display answers directly with a "显示答案" button (no submission required)
- Optimize mobile UI with icon-based header: `[←] 📝 1/100 [☰]`
- Consolidate navigation controls into single row for all question types
- Track "viewed" status for type 3 questions separately from answered questions
- Update navigation panel to show blue color for viewed type 3 questions
- Exclude type 3 questions from review mode (they're reference material, not testable)

## Capabilities

### New Capabilities
- `short-answer-display`: Render type 3 questions with reveal pattern, showing answer text without requiring submission

### Modified Capabilities
- `practice-mode`: Detect question type and render appropriately (multiple-choice vs short-answer)
- `question-navigation-panel`: Show blue status for viewed type 3 questions
- `mobile-layout`: Optimize header and navigation controls for mobile devices with single-row layouts

## Impact

- Affected files: `app.js` (add type detection, reveal logic, mobile layout), `index.html` (restructure header), `styles.css` (mobile-responsive layouts)
- State management: Add `state.type3Revealed` for tracking reveal state per question
- localStorage: Store "viewed" status for type 3 questions in `answeredQuestions`
- Navigation panel: New color coding (blue) for type 3 viewed status
- Stats: Type 3 questions count toward "completed" but not toward accuracy percentage
- Review mode: Type 3 questions excluded (they're reference materials)
- Mobile UX: Significantly improved with compact layouts and single-row controls
- No breaking changes - existing multiple-choice questions work exactly as before
