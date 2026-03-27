# practice-mode Specification

## Purpose
TBD - created by archiving change coding-practice-website. Update Purpose after archive.
## Requirements
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

### Requirement: Show analysis after submission
The system SHALL display the question analysis (if available) after the user submits an answer.

#### Scenario: Show analysis after correct answer
- **WHEN** user submits a correct answer
- **AND** the question has an analysis field
- **THEN** system displays the analysis content below the feedback message

#### Scenario: Show analysis after incorrect answer
- **WHEN** user submits an incorrect answer
- **AND** the question has an analysis field
- **THEN** system displays the analysis content below the feedback message

#### Scenario: No analysis for question
- **WHEN** user submits an answer
- **AND** the question does not have an analysis field
- **THEN** system only shows the feedback message without analysis section

### Requirement: Navigate between questions
The system SHALL allow users to navigate to next/previous questions using buttons, keyboard shortcuts, or the navigation panel.

#### Scenario: Next question with N key
- **WHEN** user presses N key or clicks "Next" button
- **THEN** system advances to the next question

#### Scenario: Previous question with P key
- **WHEN** user presses P key or clicks "Previous" button
- **THEN** system returns to the previous question

#### Scenario: Jump to question via navigation panel
- **WHEN** user clicks a question number in the navigation panel
- **THEN** system displays that question immediately

#### Scenario: First question boundary
- **WHEN** user is on the first question and presses Previous
- **THEN** system does nothing or shows a message

#### Scenario: Last question boundary
- **WHEN** user is on the last question and presses Next
- **THEN** system shows completion message or returns to dashboard

### Requirement: Track answer status
The system SHALL track which questions have been answered and whether they were correct or incorrect, storing this information persistently across sessions. In random mode, the system MUST use questionId rather than question index for tracking.

#### Scenario: Mark question as answered
- **WHEN** user submits an answer
- **THEN** system marks the question as completed in both the session state and persistent storage
- **AND** system uses questionId as the storage key, not the question position index

#### Scenario: Allow re-answering
- **WHEN** user navigates back to a previously answered question
- **THEN** system allows re-selecting and re-submitting the answer
- **AND** in random mode, system correctly identifies and restores the question's answer status

#### Scenario: Persist answer status across sessions
- **WHEN** user answers questions and then closes the browser
- **THEN** system stores the answer status in localStorage
- **AND** storage uses questionId as key, ensuring random order does not affect status tracking

#### Scenario: Restore answer status on session start
- **WHEN** user starts a new practice session after previously answering questions
- **THEN** system loads the answer statuses from localStorage and initializes the session state
- **AND** in random mode, system correctly restores each question's status based on questionId

#### Scenario: Update persistent storage on re-answer
- **WHEN** user re-answers a previously answered question
- **THEN** system updates both the session state and the persistent storage with the new status
- **AND** update operation is based on questionId, unaffected by question order

### Requirement: Display navigation panel
The system SHALL display a collapsible navigation panel showing all questions with status indicators.

#### Scenario: Show navigation panel
- **WHEN** user opens the navigation panel
- **THEN** system displays a panel on the right side showing all questions in a grid layout

#### Scenario: Hide navigation panel
- **WHEN** user closes the navigation panel
- **THEN** system hides the panel and expands the question area to full width

#### Scenario: Panel shows question status
- **WHEN** displaying the navigation panel
- **THEN** system shows each question with appropriate status indicator (unanswered, correct, incorrect, current)

### Requirement: Support direct question navigation
The system SHALL allow users to jump to any question by clicking its number in the navigation panel.

#### Scenario: Jump to specific question
- **WHEN** user clicks a question number in the navigation panel
- **THEN** system displays that question and updates the current question indicator

#### Scenario: Preserve navigation panel state when jumping
- **WHEN** user jumps to a different question using the navigation panel
- **THEN** system keeps the navigation panel open

### Requirement: Render questions based on type
The system SHALL detect question type and render using appropriate layout (multiple-choice or short-answer).

#### Scenario: Render type 0 question (single-choice)
- **WHEN** displaying a question with type 0
- **THEN** system renders radio button options with submit button

#### Scenario: Render type 1 question (multiple-choice)
- **WHEN** displaying a question with type 1
- **THEN** system renders checkbox options with submit button

#### Scenario: Render type 3 question (short-answer)
- **WHEN** displaying a question with type 3
- **THEN** system renders reveal button or answer text (no submit button)

### Requirement: Track answer status by type
The system SHALL track different status types for different question types (correct/incorrect for type 0/1, viewed for type 3).

#### Scenario: Store answer status for type 0/1
- **WHEN** user submits answer for type 0 or type 1 question
- **THEN** system stores status as "correct" or "incorrect"

#### Scenario: Store viewed status for type 3
- **WHEN** user reveals answer for type 3 question
- **THEN** system stores status as "viewed"

#### Scenario: Initialize question statuses on load
- **WHEN** starting a practice session
- **THEN** system loads both answered statuses (correct/incorrect) and viewed statuses from localStorage
- **AND** system displays appropriate colors in navigation panel for each type

### Requirement: Support random question order
The system MUST support randomly shuffling question order, deciding question presentation order based on user's selected practice mode.

#### Scenario: Load questions in sequential mode
- **WHEN** user selects "Sequential Practice" mode to enter practice
- **THEN** system presents questions in their original order from the JSON file
- **AND** question numbers in the navigation panel correspond to original positions

#### Scenario: Shuffle questions in random mode
- **WHEN** user selects "Random Practice" mode to enter practice
- **THEN** system randomly shuffles question order using Fisher-Yates shuffle algorithm
- **AND** question numbers in the navigation panel correspond to shuffled positions

#### Scenario: Re-shuffle on each entry in random mode
- **WHEN** user selects "Random Practice" mode to enter practice
- **AND** user has previously entered this subject in random mode
- **THEN** system generates a new random order (does not reuse previous random order)

#### Scenario: Random mode does not save random seed
- **WHEN** user enters practice in random mode
- **THEN** system does not save the random order to localStorage or sessionStorage
- **AND** next entry will generate a different random order

### Requirement: Display current practice mode
The system MUST clearly display the current practice mode being used on the practice page.

#### Scenario: Sequential mode display
- **WHEN** user enters practice in sequential mode
- **THEN** practice page title displays "📝 练习模式"
- **AND** no additional mode identifier is shown

#### Scenario: Random mode display
- **WHEN** user enters practice in random mode
- **THEN** practice page title displays "📝 练习模式 🔀"
- **AND** 🔀 emoji clearly identifies current as random mode

### Requirement: Maintain existing functionality
Random question order MUST NOT affect answer status tracking, wrong answer recording, and other existing features.

#### Scenario: Answer status based on questionId
- **WHEN** user answers questions in random mode
- **THEN** system uses questionId rather than question position index to track answer status
- **AND** answer status is correctly saved to localStorage

#### Scenario: Wrong answer recording unaffected
- **WHEN** user answers a question incorrectly in random mode
- **THEN** system correctly records the question's questionId to the wrong answers list
- **AND** review mode can correctly load this wrong answer

#### Scenario: Navigation panel status displays correctly
- **WHEN** user answers questions in random mode
- **THEN** question number status (✓✗) in navigation panel correctly reflects answer results
- **AND** clicking navigation panel question numbers correctly jumps to corresponding questions

#### Scenario: Answer selection restore functions normally
- **WHEN** user returns to a previously answered question after answering in random mode
- **THEN** system correctly restores user's previous answer selection
- **AND** displays previous answer results and feedback

