## Why

Currently, users must navigate through questions sequentially using Next/Previous buttons. When practicing a large question set (e.g., 243 questions), there's no way to quickly jump to a specific question number or see an overview of progress. This makes it difficult to resume practice at a specific point or review specific questions efficiently.

## What Changes

- Add a question navigation panel/sidebar to the practice and review modes
- Display a grid or list of all questions with status indicators (unanswered, correct, incorrect)
- Allow users to click on any question number to jump directly to that question
- Add a toggle button to show/hide the navigation panel
- Persist the navigation panel state (open/closed) in the session

## Capabilities

### New Capabilities
- `question-navigation-panel`: A visual navigation interface showing all questions in the current practice/review session with status indicators and quick jump functionality

### Modified Capabilities
- `practice-mode`: Add navigation panel integration and question jump capability
- `review-mode`: Add navigation panel integration for wrong answer navigation

## Impact

- Affected files: `index.html` (add navigation panel HTML), `styles.css` (navigation panel styling), `app.js` (navigation logic and state management)
- No breaking changes - purely additive feature
- Enhances user experience for long question sets
- Improves accessibility for reviewing specific questions
