## 1. Project Setup

- [x] 1.1 Create main HTML file (index.html) with basic structure
- [x] 1.2 Create CSS file (styles.css) for UI styling
- [x] 1.3 Create JavaScript file (app.js) for application logic
- [x] 1.4 Set up local web server instructions in README

## 2. Question Loader Implementation

- [x] 2.1 Implement JSON file loading with Fetch API
- [x] 2.2 Add error handling for file not found and parse errors
- [x] 2.3 Create in-memory cache for loaded questions
- [x] 2.4 Implement question parser to extract questionId, title, type, answerOptions, answer, score
- [x] 2.5 Add subject list configuration with JSON file paths

## 3. Storage Layer Implementation

- [x] 3.1 Create localStorage wrapper functions (get, set, clear)
- [x] 3.2 Implement wrong answers storage structure by subject
- [x] 3.3 Implement statistics storage structure (total, completed, correct, wrong per subject)
- [x] 3.4 Add functions to add/remove wrong answers
- [x] 3.5 Add functions to update statistics on answer submission
- [x] 3.6 Implement data export to JSON file
- [x] 3.7 Implement data import from JSON file with merge logic

## 4. UI Components - Dashboard

- [x] 4.1 Create dashboard view HTML structure
- [x] 4.2 Implement subject card rendering with statistics
- [x] 4.3 Add accuracy calculation and display
- [x] 4.4 Create "开始练习" and "复习错题" buttons for each subject
- [x] 4.5 Implement overall statistics display (total completed, overall accuracy, total wrong)
- [x] 4.6 Add data management buttons (export, import, clear)

## 5. UI Components - Practice Mode

- [x] 5.1 Create practice mode view HTML structure
- [x] 5.2 Implement question display with title and options
- [x] 5.3 Add radio buttons for single-choice questions
- [x] 5.4 Add checkboxes for multiple-choice questions
- [x] 5.5 Display question counter (e.g., "Question 5 / 243")
- [x] 5.6 Implement answer selection with mouse clicks
- [x] 5.7 Add keyboard shortcuts (A/B/C/D for selection, Enter to submit, N for next, P for previous)
- [x] 5.8 Create submit button and answer submission logic
- [x] 5.9 Implement immediate feedback display (correct in green, incorrect in red)
- [x] 5.10 Highlight correct answers after wrong submission
- [x] 5.11 Add Next/Previous navigation buttons
- [x] 5.12 Implement navigation boundary handling (first/last question)

## 6. UI Components - Review Mode

- [x] 6.1 Create review mode view (reuse practice mode UI)
- [x] 6.2 Filter questions to wrong answers only
- [x] 6.3 Display "没有错题需要复习!" message when no wrong answers exist
- [x] 6.4 Show review progress counter (e.g., "复习 3 / 15")
- [x] 6.5 Remove question from wrong answers list when answered correctly in review
- [x] 6.6 Add exit review button and Escape key handler

## 7. Application State Management

- [x] 7.1 Create application state object (currentView, currentSubject, currentQuestionIndex, questions, wrongAnswers, stats)
- [x] 7.2 Implement view switching logic (dashboard, practice, review)
- [x] 7.3 Add hash-based routing (#dashboard, #practice, #review)
- [x] 7.4 Implement state persistence during session
- [x] 7.5 Add session answer tracking (which questions answered, correctness)

## 8. Integration and Logic

- [x] 8.1 Connect dashboard buttons to practice/review mode entry
- [x] 8.2 Integrate answer submission with wrong answer tracking
- [x] 8.3 Integrate answer submission with statistics updates
- [x] 8.4 Implement practice mode completion flow (return to dashboard)
- [x] 8.5 Implement review mode completion flow
- [x] 8.6 Add loading indicators for JSON file fetching
- [x] 8.7 Disable review button when no wrong answers exist

## 9. Styling and UX

- [x] 9.1 Style dashboard with subject cards layout
- [x] 9.2 Style practice/review mode with clean, distraction-free design
- [x] 9.3 Add visual feedback for correct/incorrect answers (colors, icons)
- [x] 9.4 Style buttons and navigation controls
- [x] 9.5 Add responsive layout for different screen sizes
- [x] 9.6 Implement keyboard focus indicators
- [x] 9.7 Add loading spinners and transition animations

## 10. Testing and Documentation

- [x] 10.1 Test with all four JSON files (马克思主义基本原理, 中国近代史纲要, 习近平新时代, 中国近代史纲要_2)
- [x] 10.2 Test single-choice and multiple-choice question handling
- [x] 10.3 Test wrong answer tracking and review mode
- [x] 10.4 Test localStorage persistence and data export/import
- [x] 10.5 Test keyboard shortcuts functionality
- [x] 10.6 Test edge cases (empty wrong answers, all questions completed, etc.)
- [x] 10.7 Write README with setup instructions and usage guide
- [x] 10.8 Document local web server requirement (python -m http.server or VS Code Live Server)
