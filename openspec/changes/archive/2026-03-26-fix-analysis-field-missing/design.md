## Context

The `QuestionLoader.parseQuestions()` function transforms raw JSON question data into the internal question object format used by the application. Currently, it extracts `questionId`, `title`, `type`, `answerOptions`, `answer`, and `score` fields, but omits the `analysis` field that exists in the source JSON data.

This causes the `renderAnalysis()` function to never display analysis content, even when questions have it defined in the JSON files.

## Fix

Add `analysis: q.analysis` to the parsed question object in `QuestionLoader.parseQuestions()`.

### Location
File: `app.js`
Function: `QuestionLoader.parseQuestions()`

### Before
```javascript
questions.push({
    questionId: q.questionId,
    title: q.title,
    type: q.type,
    answerOptions: q.answerOptions,
    answer: q.answer,
    score: q.score
});
```

### After
```javascript
questions.push({
    questionId: q.questionId,
    title: q.title,
    type: q.type,
    answerOptions: q.answerOptions,
    answer: q.answer,
    score: q.score,
    analysis: q.analysis
});
```

## Impact

- All modes (practice, review, memorize) will now correctly display analysis content
- No breaking changes to existing functionality
- No migration needed
