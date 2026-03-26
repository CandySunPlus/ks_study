## 1. Modify AnsweredQuestions Module

- [x] 1.1 Update `AnsweredQuestions.set()` to store object `{status, selected}` instead of string
- [x] 1.2 Update `AnsweredQuestions.get()` to handle both old (string) and new (object) formats
- [x] 1.3 Update `AnsweredQuestions.getAll()` to return normalized data

## 2. Update Answer Submission

- [x] 2.1 Modify `submitAnswer()` to pass `selected` array to `AnsweredQuestions.set()`

## 3. Restore Session Answers on Practice/Review Start

- [x] 3.1 Modify `startPractice()` to restore `state.sessionAnswers` from persistent storage
- [x] 3.2 Modify `startReview()` to restore `state.sessionAnswers` from persistent storage
- [x] 3.3 Create helper function to convert stored data to sessionAnswers format

## 4. Update Data Import/Export

- [x] 4.1 Update `DataManager.export()` to include selected answers in new format
- [x] 4.2 Update `DataManager.import()` to handle both old and new formats

## 5. Update initializeQuestionStatuses (if needed)

- [x] 5.1 Verify `initializeQuestionStatuses()` works with new format or update accordingly

## 6. Verify

- [ ] 6.1 Test: Answer questions, refresh page, navigate back - verify selections restored
- [ ] 6.2 Test: Export data, clear, import - verify selections restored
- [ ] 6.3 Test: Old data format (status only) - verify app doesn't break
- [ ] 6.4 Test: Clear data - verify all selections removed
