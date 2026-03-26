# review-mode Specification

## Purpose
TBD - created by archiving change coding-practice-website. Update Purpose after archive.
## Requirements
### Requirement: Filter questions to wrong answers only
The system SHALL display only questions that have been answered incorrectly, based on wrong answer tracking data.

#### Scenario: Load wrong answers for review
- **WHEN** user enters review mode for a subject
- **THEN** system retrieves wrong answer questionIds from localStorage and loads only those questions

#### Scenario: No wrong answers to review
- **WHEN** user enters review mode but has no wrong answers for the subject
- **THEN** system displays a message "没有错题需要复习!" and prompts to return to practice mode

#### Scenario: Update wrong answer list during review
- **WHEN** user correctly answers a question in review mode
- **THEN** system removes it from the wrong answers list and from the current review session

### Requirement: Provide same practice interface
The system SHALL use the same question display, answer capture, feedback mechanisms, and navigation panel as practice mode.

#### Scenario: Display question in review mode
- **WHEN** user is in review mode
- **THEN** system displays question with same format as practice mode (title, options, navigation, navigation panel)

#### Scenario: Submit answer in review mode
- **WHEN** user submits an answer in review mode
- **THEN** system shows immediate feedback with correct/incorrect indication

#### Scenario: Use navigation panel in review mode
- **WHEN** user opens the navigation panel in review mode
- **THEN** system displays the panel with only wrong answer questions visible

### Requirement: Show review progress
The system SHALL display current position and total count of wrong answers being reviewed.

#### Scenario: Display review counter
- **WHEN** reviewing wrong answers
- **THEN** system shows "复习 3 / 15" indicating current position out of total wrong answers

#### Scenario: Complete review session
- **WHEN** user has reviewed all wrong answers
- **THEN** system displays completion message and option to return to dashboard or practice mode

### Requirement: Allow exit from review mode
The system SHALL provide a way to exit review mode and return to the main menu or practice mode.

#### Scenario: Exit review mode
- **WHEN** user clicks "Exit Review" button or presses Escape key
- **THEN** system returns to dashboard or subject selection view

### Requirement: Display navigation panel for wrong answers
The system SHALL display a navigation panel showing only the wrong answers being reviewed with status indicators.

#### Scenario: Show navigation panel in review mode
- **WHEN** user opens the navigation panel in review mode
- **THEN** system displays a panel showing only the questions that are in the wrong answers list

#### Scenario: Panel reflects review progress
- **WHEN** displaying the navigation panel in review mode
- **THEN** system shows which wrong answer questions have been re-answered correctly in the current session

#### Scenario: Jump to wrong answer question
- **WHEN** user clicks a question number in the review mode navigation panel
- **THEN** system displays that wrong answer question

