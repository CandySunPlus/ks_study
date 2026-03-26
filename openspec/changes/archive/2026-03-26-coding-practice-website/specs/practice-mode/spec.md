## ADDED Requirements

### Requirement: Display question with answer options
The system SHALL display the current question title and all answer options with labels (A, B, C, D).

#### Scenario: Show single-choice question
- **WHEN** question type is single-choice
- **THEN** system displays radio buttons for answer selection

#### Scenario: Show multiple-choice question
- **WHEN** question type is multiple-choice
- **THEN** system displays checkboxes for answer selection

#### Scenario: Display question number
- **WHEN** displaying a question
- **THEN** system shows current question index and total count (e.g., "Question 5 / 243")

### Requirement: Capture user answer
The system SHALL allow users to select answers using mouse clicks or keyboard input.

#### Scenario: Select single answer
- **WHEN** user clicks a radio button or presses A/B/C/D key
- **THEN** system marks that option as selected

#### Scenario: Select multiple answers
- **WHEN** question is multiple-choice and user clicks checkboxes or presses A/B/C/D keys
- **THEN** system toggles each selected option

#### Scenario: Submit answer with Enter key
- **WHEN** user presses Enter key
- **THEN** system submits the current answer and shows feedback

### Requirement: Show immediate feedback
The system SHALL display whether the answer is correct or incorrect immediately after submission.

#### Scenario: Correct answer
- **WHEN** user submits correct answer
- **THEN** system displays "正确!" in green and highlights correct options

#### Scenario: Incorrect answer
- **WHEN** user submits incorrect answer
- **THEN** system displays "错误!" in red, highlights user's wrong selections, and shows correct answers

#### Scenario: Show correct answer after wrong submission
- **WHEN** user answers incorrectly
- **THEN** system displays which options are correct with visual indicators

### Requirement: Navigate between questions
The system SHALL allow users to navigate to next/previous questions using buttons or keyboard shortcuts.

#### Scenario: Next question with N key
- **WHEN** user presses N key or clicks "Next" button
- **THEN** system advances to the next question

#### Scenario: Previous question with P key
- **WHEN** user presses P key or clicks "Previous" button
- **THEN** system returns to the previous question

#### Scenario: First question boundary
- **WHEN** user is on the first question and presses Previous
- **THEN** system does nothing or shows a message

#### Scenario: Last question boundary
- **WHEN** user is on the last question and presses Next
- **THEN** system shows completion message or returns to dashboard

### Requirement: Track answer status
The system SHALL track which questions have been answered and whether they were correct or incorrect.

#### Scenario: Mark question as answered
- **WHEN** user submits an answer
- **THEN** system marks the question as completed in the session state

#### Scenario: Allow re-answering
- **WHEN** user navigates back to a previously answered question
- **THEN** system allows re-selecting and re-submitting the answer
