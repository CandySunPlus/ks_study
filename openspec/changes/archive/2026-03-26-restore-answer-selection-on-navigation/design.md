## Context

The quiz app currently stores user answers in `state.sessionAnswers[questionId] = { selected, isCorrect }` when they submit an answer. However, when navigating back to previously answered questions, the `renderMultipleChoiceQuestion()` function creates fresh input elements without checking for existing answers in session storage.

## Goals / Non-Goals

**Goals:**
- Restore previously selected answers when navigating back to answered questions
- Maintain visual consistency with fresh questions (unanswered state)
- Minimal code change to existing rendering logic

**Non-Goals:**
- Persisting answers across page reloads (out of scope - sessionAnswers is already ephemeral)
- Changing how answers are stored or validated
- Modifying short-answer (type 3) question behavior

## Decisions

### Decision 1: Where to inject restore logic

**Option A:** Modify `renderMultipleChoiceQuestion()` to accept an optional `preselectedAnswers` parameter
**Option B:** Have `renderMultipleChoiceQuestion()` directly read from `state.sessionAnswers`

**Chosen: Option B**

Rationale: The function already has access to global `state` and the current `question` object. Adding a parameter would require changes to all call sites. Direct lookup keeps the change localized and follows the existing pattern in the codebase (e.g., `initializeQuestionStatuses()` reads from `state.sessionAnswers`).

### Decision 2: When to apply restored selection

The restoration should happen during the initial render of options:
1. Look up `state.sessionAnswers[question.questionId]`
2. If found, set `input.checked = true` for each selected index during element creation
3. Call `updateOptionStyles()` after creating all options to ensure visual state matches

### Decision 3: Handling submitted vs unsubmitted state

When a user returns to a previously submitted question:
- Answers should be pre-selected (checked)
- Options should remain interactive (not disabled) so they can change their answer
- The submit button should remain enabled (current behavior after submit disables it, but navigation resets this)

Implementation note: This differs from the immediate post-submit state where options are disabled. Navigation to a previously answered question should allow re-answering.
