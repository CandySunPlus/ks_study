# question-navigation-panel Specification (Delta)

## MODIFIED Requirements

### Requirement: Display question grid with status indicators
The system SHALL display a grid of all questions in the current practice/review session, with each question showing its status through color coding and icons. Status SHALL be loaded from persistent storage on initialization and SHALL differentiate between multiple-choice (correct/incorrect) and short-answer (viewed) question types.

#### Scenario: Display viewed short-answer question (type 3)
- **WHEN** a type 3 question has been revealed/viewed
- **THEN** system displays the question number in blue with a book icon (📖)
