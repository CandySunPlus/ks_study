## Context

The current `AnsweredQuestions` module stores only the status ("correct"/"incorrect"/"viewed") as a string. The actual selected answers are stored ephemerally in `state.sessionAnswers` and lost on page refresh. We need to extend the storage to include the `selected` array while maintaining backward compatibility.

## Goals / Non-Goals

**Goals:**
- Extend storage format to include selected answers
- Maintain 100% backward compatibility with existing user data
- Seamless migration from old format to new format
- Restore answers when starting practice/review mode

**Non-Goals:**
- Changing how answers are validated or scored
- Modifying the sessionStorage-based navigation panel state
- Adding encryption or compression to stored data

## Decisions

### Decision 1: Data Format Migration Strategy

**Option A:** One-time migration on app startup
**Option B:** On-demand migration when reading data
**Option C:** Maintain dual format support indefinitely

**Chosen: Option B (On-demand migration)**

Rationale:
- No startup performance impact
- Gradual migration as users access questions
- Simpler implementation, no batch processing needed
- Old data continues to work, just without selected answers restoration

Implementation:
```javascript
get(subject, questionId) {
    const value = answeredQuestions[subject]?.[questionId];
    if (typeof value === 'string') {
        // Legacy format: convert on read
        return { status: value, selected: null };
    }
    return value; // New format
}
```

### Decision 2: Storage Key Strategy

Keep using the same localStorage key `'answeredQuestions'` but change the value structure.

Rationale:
- No breaking change for existing data (we handle both formats)
- Users don't lose their progress history
- Import/export continues to work

### Decision 3: SessionAnswers Reconstruction

When `startPractice()` or `startReview()` is called:
1. Load all answered questions for the subject via `AnsweredQuestions.getAll(subject)`
2. Iterate through and populate `state.sessionAnswers[questionId] = { selected, isCorrect }`
3. Only include entries that have `selected !== null`

This ensures:
- Legacy data (status only) doesn't break, just won't have selections restored
- New data gets full restoration
- SessionAnswers format remains unchanged (code that reads it doesn't need modification)

### Decision 4: Import/Export Format

Export format should use the new structure:
```javascript
{
  "subject": {
    "questionId": { "status": "correct", "selected": ["0", "2"] }
  }
}
```

Import should handle both old and new formats for backward compatibility with older backup files.

## Migration Path

```
┌─────────────────────────────────────────────────────────┐
│                   Data Migration Flow                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Old Data Format                    New Data Format     │
│  ┌─────────────┐                   ┌─────────────────┐  │
│  │ "correct"   │  ──on write──▶   │ {               │  │
│  │ "incorrect" │                   │   status,       │  │
│  │ "viewed"    │                   │   selected      │  │
│  └─────────────┘                   │ }               │  │
│                                     └─────────────────┘  │
│                                                         │
│  - Reads automatically handle both formats              │
│  - Writes always use new format                         │
│  - Gradual migration as users revisit questions         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
