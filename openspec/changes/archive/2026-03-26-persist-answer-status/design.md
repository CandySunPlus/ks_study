## Context

Currently, answer status is tracked in `state.sessionAnswers` (in-memory only) and only partially persisted:
- `wrongAnswers` in localStorage stores which questions were answered incorrectly
- `stats` in localStorage stores aggregate counts (total, completed, correct, wrong)
- The navigation panel relies on `sessionAnswers` to show visual status (green/red/gray)

After page refresh, `sessionAnswers` is empty, so `initializeQuestionStatuses()` cannot restore the visual status in the navigation panel. Users lose their progress visualization even though the underlying data (wrong answers, stats) is still there.

## Goals / Non-Goals

**Goals:**
- Store individual question answer status (correct/incorrect) persistently in localStorage
- Restore navigation panel visual status after page refresh
- Maintain compatibility with existing `wrongAnswers` and `stats` data
- Support data export/import for the new answered questions data

**Non-Goals:**
- Storing answer history or timestamps (just current status: correct/incorrect)
- Changing the existing `wrongAnswers` or `stats` structures (keep as-is for backward compatibility)
- Adding UI to view answer history
- Syncing across devices (still local-only)

## Decisions

### 1. Data Structure: Simple Status Map

**Decision**: Store answered questions as a simple map of questionId to status

```javascript
answeredQuestions: {
  "马克思主义基本原理": {
    "16628": "incorrect",
    "16629": "correct",
    "16630": "correct",
    ...
  },
  "中国近代史纲要": {
    ...
  }
}
```

**Rationale**:
- Simple and efficient lookup by questionId
- Minimal storage overhead (just status string)
- Easy to serialize/deserialize with JSON
- Can be extended later (e.g., add timestamp) without breaking changes

**Alternatives considered**:
- Store as array of objects `[{id, status}]`: Rejected - slower lookup, more verbose
- Store separate arrays for correct/incorrect: Rejected - harder to update, need two lookups
- Store full answer details: Rejected - unnecessary data, larger storage footprint

### 2. Module Design: AnsweredQuestions Manager

**Decision**: Create a new `AnsweredQuestions` module parallel to `WrongAnswers` and `Stats`

```javascript
const AnsweredQuestions = {
    get(subject, questionId),
    set(subject, questionId, status),
    getAll(subject),
    clear(subject)
}
```

**Rationale**:
- Consistent with existing code patterns (`WrongAnswers`, `Stats` modules)
- Encapsulates localStorage access
- Easy to test and maintain
- Clear separation of concerns

**Alternatives considered**:
- Extend `WrongAnswers` module: Rejected - different purpose, would be confusing
- Add to `Stats` module: Rejected - stats are aggregates, this is individual records
- No module, inline localStorage calls: Rejected - code duplication, harder to maintain

### 3. Integration Point: Dual Write on Submit

**Decision**: When user submits an answer, write to both `sessionAnswers` (existing) and `AnsweredQuestions` (new)

```javascript
submitAnswer() {
    // ... existing logic ...

    // Existing: in-memory tracking
    state.sessionAnswers[questionId] = { selected, isCorrect };

    // NEW: persistent tracking
    AnsweredQuestions.set(subject, questionId, isCorrect ? 'correct' : 'incorrect');

    // ... rest of logic ...
}
```

**Rationale**:
- Minimal code change
- Both data sources stay in sync
- `sessionAnswers` still useful for current session (e.g., checking if already answered)
- No breaking changes to existing code

**Alternatives considered**:
- Replace `sessionAnswers` entirely: Rejected - would require more refactoring, higher risk
- Only write to `AnsweredQuestions`: Rejected - breaks current session logic

### 4. Initialization: Fallback Chain

**Decision**: Initialize from `AnsweredQuestions` first, fall back to inference from `wrongAnswers`

```javascript
initializeQuestionStatuses() {
    state.questions.forEach((question, index) => {
        const questionId = question.questionId;

        // Try persistent storage first
        const persistedStatus = AnsweredQuestions.get(subject, questionId);
        if (persistedStatus) {
            state.questionStatuses[index] = persistedStatus;
            return;
        }

        // Fall back to session memory
        const sessionAnswer = state.sessionAnswers[questionId];
        if (sessionAnswer) {
            state.questionStatuses[index] = sessionAnswer.isCorrect ? 'correct' : 'incorrect';
            return;
        }

        // Default: unanswered
        state.questionStatuses[index] = 'unanswered';
    });
}
```

**Rationale**:
- Persistent storage is source of truth after refresh
- Session memory still works for current session
- Graceful degradation if localStorage is unavailable
- Backward compatible (existing sessions continue to work)

**Alternatives considered**:
- Only check `AnsweredQuestions`: Rejected - loses current session data before next answer
- Complex merge logic: Rejected - unnecessary complexity, session is temporary anyway

### 5. Data Export/Import: Include in Existing Functions

**Decision**: Extend `DataManager.export()` and `DataManager.import()` to include `answeredQuestions`

```javascript
export() {
    const data = {
        wrongAnswers: WrongAnswers.getAll(),
        stats: Stats.getAll(),
        answeredQuestions: Storage.get('answeredQuestions', {}),  // NEW
        exportDate: new Date().toISOString()
    };
    // ... download logic ...
}
```

**Rationale**:
- Users expect all data to be exported together
- No new UI needed (use existing export/import buttons)
- Backward compatible (old exports still import, just missing answeredQuestions)

**Alternatives considered**:
- Separate export for answered questions: Rejected - confusing UX, fragmented backups
- Don't support export: Rejected - users would lose data when switching devices

## Risks / Trade-offs

**[Risk] localStorage size limit (~5-10MB)**
→ Mitigation: For 1,000 questions with status, storage is ~50KB (well under limit). Monitor in console if needed.

**[Risk] Inconsistency between wrongAnswers and answeredQuestions**
→ Mitigation: Both are updated in same `submitAnswer()` call (atomic from user perspective). If localStorage fails, both fail together.

**[Risk] Old data from before this change**
→ Mitigation: Questions answered before this change won't have status in `answeredQuestions`, will show as unanswered in navigation panel. This is acceptable - user can re-answer or ignore. Not worth complex migration.

**[Risk] Browser clears localStorage**
→ Mitigation: Same risk as existing data (wrongAnswers, stats). User can export/import. No worse than current situation.

**[Trade-off] Redundant data (wrongAnswers is subset of answeredQuestions)**
→ Acceptable: Keep `wrongAnswers` for backward compatibility and fast "get all wrong questions" queries. Storage cost is minimal.

**[Trade-off] No answer history or timestamps**
→ Acceptable: Out of scope for this change. Can be added later by changing status string to object: `{status, timestamp}`. Current design doesn't prevent this.

## Migration Plan

**Deployment:**
1. No database migration needed (localStorage only)
2. Code change is additive (no breaking changes)
3. Users with existing data: navigation panel shows unanswered for old questions, correct status for new answers going forward
4. No rollback needed (old code simply ignores `answeredQuestions` key)

**Rollback Strategy:**
- If issues arise, revert code changes
- `answeredQuestions` data in localStorage is harmless (ignored by old code)
- Users' existing `wrongAnswers` and `stats` remain intact
