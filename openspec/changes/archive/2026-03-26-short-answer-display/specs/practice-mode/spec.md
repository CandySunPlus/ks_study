# practice-mode Specification (Delta)

## ADDED Requirements

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
