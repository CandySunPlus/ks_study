# question-navigation-panel Specification (Delta)

## MODIFIED Requirements

### Requirement: Display question grid with status indicators
The system SHALL display a grid of all questions in the current practice/review session, with each question showing its status through color coding and icons. Status SHALL be loaded from persistent storage on initialization.

#### Scenario: Display unanswered question
- **WHEN** a question has not been answered
- **THEN** system displays the question number in gray with a bullet icon (•)

#### Scenario: Display correctly answered question
- **WHEN** a question has been answered correctly
- **THEN** system displays the question number in green with a checkmark icon (✓)

#### Scenario: Display incorrectly answered question
- **WHEN** a question has been answered incorrectly
- **THEN** system displays the question number in red with an X icon (✗)

#### Scenario: Highlight current question
- **WHEN** displaying the navigation panel
- **THEN** system highlights the currently displayed question with a blue border or background

#### Scenario: Restore status after page refresh
- **WHEN** user refreshes the page and starts a practice session
- **THEN** system loads answer statuses from localStorage and displays them in the navigation panel

#### Scenario: Show status from previous session
- **WHEN** user answers questions in one session, closes browser, and returns later
- **THEN** system displays the previously answered questions with their correct/incorrect status
