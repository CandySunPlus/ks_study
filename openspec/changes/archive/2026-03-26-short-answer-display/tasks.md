## 1. Add Type 3 Question Detection and State Management

- [x] 1.1 Add `state.type3Revealed` object to track reveal state per questionId
- [x] 1.2 Modify `initializeQuestionStatuses()` to handle "viewed" status for type 3 questions
- [x] 1.3 Add helper function `isType3Question(question)` to detect short-answer questions
- [x] 1.4 Update `AnsweredQuestions.get()` to return "viewed" status for type 3 questions

## 2. Implement Type 3 Question Rendering

- [x] 2.1 Create `renderShortAnswerQuestion(question)` function
- [x] 2.2 Implement reveal button rendering with "💡 显示答案" text
- [x] 2.3 Implement answer text display with "📖 答案：" label and formatted text
- [x] 2.4 Add click handler for reveal button to show answer and update state
- [x] 2.5 Modify `renderQuestion()` to branch based on question type

## 3. Update Navigation Controls for Question Types

- [x] 3.1 Modify navigation controls rendering to hide submit button for type 3
- [x] 3.2 Ensure two-button layout (上一题, 下一题) for type 3 questions
- [x] 3.3 Keep three-button layout (上一题, 提交, 下一题) for type 0/1 questions
- [x] 3.4 Update `submitAnswer()` to skip type 3 questions

## 4. Implement Reveal State Persistence

- [x] 4.1 Create `revealAnswer(questionId)` function to handle reveal action
- [x] 4.2 Update `state.type3Revealed` when answer is revealed
- [x] 4.3 Save "viewed" status to AnsweredQuestions when navigating away from revealed type 3
- [x] 4.4 Load viewed status from AnsweredQuestions on page load
- [x] 4.5 Re-render question to show answer if already revealed

## 5. Update Navigation Panel for Type 3

- [x] 5.1 Add CSS class `.question-box.viewed` for blue background
- [x] 5.2 Modify `renderNavigationPanel()` to apply "viewed" class for type 3 questions
- [x] 5.3 Update `updateQuestionStatus()` to handle "viewed" status
- [x] 5.4 Ensure navigation panel shows blue for type 3, green/red for type 0/1

## 6. Exclude Type 3 from Review Mode

- [x] 6.1 Modify `startReview()` to filter out type 3 questions from review set
- [x] 6.2 Ensure only type 0/1 wrong answers appear in review mode
- [x] 6.3 Test review mode with mixed question types

## 7. Add Keyboard Shortcuts for Type 3

- [x] 7.1 Modify keyboard event listener to detect Enter/Space on unrevealed type 3
- [x] 7.2 Call `revealAnswer()` when Enter or Space pressed on type 3
- [x] 7.3 Ensure existing shortcuts (P, N, Escape) still work for type 3
- [x] 7.4 Prevent submit action (Enter) from triggering on type 3

## 8. Optimize Mobile Header Layout

- [x] 8.1 Restructure header HTML to use flexbox with three sections (left, center, right)
- [x] 8.2 Update header CSS for single-row layout with space-between
- [x] 8.3 Add icon-based mode indicator (📝 for practice, 🔄 for review)
- [x] 8.4 Simplify counter display: "练习 1/100" or "复习 1/100"
- [x] 8.5 Update exit button to show icon only on mobile: [←]
- [x] 8.6 Update navigation toggle to show icon only: [☰]

## 9. Add Responsive Breakpoints

- [x] 9.1 Add CSS media query for desktop (> 768px) with full text labels
- [x] 9.2 Add CSS media query for mobile (≤ 768px) with icon-only labels
- [x] 9.3 Add CSS media query for small phones (< 375px) with ultra-compact spacing
- [x] 9.4 Test header layout at various screen widths

## 10. Optimize Navigation Controls Layout

- [x] 10.1 Update navigation controls CSS to use flexbox with equal-width buttons
- [x] 10.2 Add gap between buttons for better spacing
- [x] 10.3 Set min-width (80px) and max-width (150px) for buttons
- [x] 10.4 Ensure buttons never wrap to second line
- [x] 10.5 Test three-button and two-button layouts on mobile

## 11. Add Accessibility Features

- [x] 11.1 Add aria-label to back button: "返回首页"
- [x] 11.2 Add aria-label to navigation toggle: "切换导航面板"
- [x] 11.3 Add title attributes for tooltips on desktop
- [x] 11.4 Ensure minimum 44x44px touch targets for mobile buttons
- [x] 11.5 Test with screen reader to verify accessibility

## 12. Update Stats to Handle Type 3

- [x] 12.1 Modify stats calculation to count type 3 toward "completed"
- [x] 12.2 Ensure type 3 does NOT count toward "correct" or "wrong"
- [x] 12.3 Ensure accuracy percentage excludes type 3 (correct / (correct + wrong))
- [x] 12.4 Test stats display with mixed question types

## 13. Style Type 3 Answer Display

- [x] 13.1 Add CSS for `.short-answer-reveal` container (centered reveal button)
- [x] 13.2 Add CSS for `.reveal-btn` (blue background, white text, prominent)
- [x] 13.3 Add CSS for `.short-answer-content` container
- [x] 13.4 Add CSS for `.answer-label` (bold, with icon)
- [x] 13.5 Add CSS for `.answer-text` (bordered box, good line-height, pre-wrap)

## 14. Testing and Verification

- [x] 14.1 Test type 3 question rendering in practice mode
- [x] 14.2 Test reveal button click and answer display
- [x] 14.3 Test navigation away and back to revealed question
- [x] 14.4 Test persistence across page refresh
- [x] 14.5 Test navigation panel colors for all question types
- [x] 14.6 Test review mode excludes type 3 questions
- [x] 14.7 Test mobile header layout on various screen sizes
- [x] 14.8 Test navigation controls on mobile (both 2 and 3 button layouts)
- [x] 14.9 Test keyboard shortcuts (Enter, Space, P, N) for type 3
- [x] 14.10 Test stats calculation with type 3 questions
