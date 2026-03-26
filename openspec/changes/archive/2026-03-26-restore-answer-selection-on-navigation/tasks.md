## 1. Modify renderMultipleChoiceQuestion function

- [x] 1.1 Look up existing answer from `state.sessionAnswers` using `question.questionId`
- [x] 1.2 Pre-select answer options during element creation if previous answer exists
- [x] 1.3 Call `updateOptionStyles()` after rendering to sync visual state

## 2. Verify

- [x] 2.1 Test: Answer a question, click "下一题", then "上一题" - verify previous answer is selected
- [x] 2.2 Test: Answer a question, click another question in navigation panel - verify answer is selected
- [x] 2.3 Test: Navigate to unanswered question - verify no pre-selection occurs
