## ADDED Requirements

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

## MODIFIED Requirements

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
