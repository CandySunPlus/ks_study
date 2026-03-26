## ADDED Requirements

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

## MODIFIED Requirements

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
