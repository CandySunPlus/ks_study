## Why

Currently, answer selections are only stored in memory (`state.sessionAnswers`) and are lost when the page is refreshed. Users expect their progress to persist across sessions unless they manually clear data. This change extends the existing `AnsweredQuestions` storage to include the actual selected answers, enabling answer restoration after page reload.

## What Changes

- Extend `AnsweredQuestions` storage format to include `selected` array alongside `status`
- Maintain backward compatibility with existing data (old string format)
- Restore `sessionAnswers` from persistent storage when starting practice/review
- Update import/export to include selected answers

## Capabilities

### New Capabilities
- `persistent-answer-storage`: Store and retrieve user's selected answers from localStorage with full backward compatibility

### Modified Capabilities
- `answer-selection-restore`: Extend to read from persistent storage in addition to session memory

## Impact

- `app.js`: Modify `AnsweredQuestions` methods (get/set), `submitAnswer()`, `startPractice()`, `startReview()`, `initializeQuestionStatuses()`
- `DataManager.export/import`: Include selected answers in backup/restore
- Data migration: Old format (string status) automatically converted to new format (object with status + selected)
