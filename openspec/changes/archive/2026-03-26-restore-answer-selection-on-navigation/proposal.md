## Why

Currently, when users navigate back to previously answered questions (via "上一题" or the navigation panel), their previous answer selections are not restored. The question renders with all options unselected, which is confusing and makes it hard to review what they chose. This change will restore the selected answers when viewing previously answered questions, improving the review experience.

## What Changes

- Modify `renderMultipleChoiceQuestion()` to check for existing session answers before rendering
- Pre-select answer options that were previously selected by the user
- Maintain existing behavior for unanswered questions (fresh render with no selection)

## Capabilities

### New Capabilities
- `answer-selection-restore`: When navigating to a previously answered question, automatically restore and display the user's previous answer selection

### Modified Capabilities
- `question-rendering`: Extend question rendering to support pre-selected answers from session history

## Impact

- `app.js`: Modify `renderMultipleChoiceQuestion()` function to restore previous selections from `state.sessionAnswers`
