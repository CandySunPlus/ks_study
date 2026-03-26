## ADDED Requirements

### Requirement: Restore Previous Answer Selection

When a user navigates to a question they have already answered in the current session, the system MUST restore and display their previous answer selection.

#### Scenario: Navigate to previously answered question via Previous button

- **WHEN** the user clicks "上一题" to navigate to a question they already answered
- **THEN** the question renders with their previously selected options pre-selected
- **AND** the visual selection state (checkbox/radio checked) reflects their previous answer

#### Scenario: Navigate to previously answered question via navigation panel

- **WHEN** the user clicks a question number in the navigation panel for a question they already answered
- **THEN** the question renders with their previously selected options pre-selected
- **AND** the visual selection state (checkbox/radio checked) reflects their previous answer

#### Scenario: Navigate to unanswered question

- **WHEN** the user navigates to a question they have NOT yet answered
- **THEN** the question renders with NO options pre-selected
- **AND** the behavior matches the current fresh question rendering

#### Scenario: Answer restored matches submitted answer

- **GIVEN** a user previously answered a question with options ["A", "C"]
- **WHEN** they navigate back to that question
- **THEN** options A and C are selected
- **AND** the internal state matches what was stored in `sessionAnswers`
