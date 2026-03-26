# memorize-mode Specification

## Purpose
提供背题模式，允许用户直接浏览题目及其正确答案和解析，无需交互答题，帮助用户高效记忆知识点。

## Requirements

### Requirement: Access memorize mode from dashboard
The system SHALL provide an entry point on the Dashboard for users to enter memorize mode for a selected subject.

#### Scenario: Click memorize mode button
- **WHEN** user clicks the "背题模式" (Memorize Mode) button on the dashboard
- **THEN** system loads all questions for the selected subject and enters memorize mode

### Requirement: Display correct answer directly for choice questions
The system SHALL display the correct answer immediately for choice questions without requiring user interaction.

#### Scenario: Show correct answer for single-choice question
- **WHEN** user navigates to a single-choice question in memorize mode
- **THEN** system highlights the correct option in green
- **AND** marks the correct option as selected

#### Scenario: Show correct answers for multiple-choice question
- **WHEN** user navigates to a multiple-choice question in memorize mode
- **THEN** system highlights all correct options in green
- **AND** marks all correct options as selected

### Requirement: Display answer directly for short-answer questions
The system SHALL display the answer immediately for short-answer (type 3) questions without requiring a button click.

#### Scenario: Show answer for short-answer question
- **WHEN** user navigates to a short-answer question in memorize mode
- **THEN** system displays the answer content directly
- **AND** does not show the "显示答案" (Reveal Answer) button

### Requirement: Display question analysis in memorize mode
The system SHALL display the question analysis (if available) directly in memorize mode.

#### Scenario: Show analysis for question with analysis field
- **WHEN** user navigates to a question that has an analysis field
- **THEN** system displays the analysis content below the answer

#### Scenario: No analysis display for question without analysis
- **WHEN** user navigates to a question without an analysis field
- **THEN** system does not display an analysis section

### Requirement: Mark wrong questions in memorize mode
The system SHALL visually identify wrong questions in memorize mode.

#### Scenario: Show wrong question indicator in title
- **WHEN** user navigates to a question that is in the wrong answers list
- **THEN** system displays a ❌ marker before the question title

#### Scenario: Show wrong question indicator in navigation panel
- **WHEN** user views the navigation panel in memorize mode
- **THEN** wrong questions are highlighted with red background in the question grid

### Requirement: No statistics tracking in memorize mode
The system SHALL NOT track any answer statistics in memorize mode.

#### Scenario: Browse memorize mode without affecting stats
- **WHEN** user browses questions in memorize mode
- **THEN** system does not update completion count, accuracy, or wrong answers list

### Requirement: Keyboard navigation in memorize mode
The system SHALL support keyboard shortcuts for navigation in memorize mode.

#### Scenario: Previous question with P key
- **WHEN** user presses the P key
- **THEN** system navigates to the previous question

#### Scenario: Next question with N key
- **WHEN** user presses the N key
- **THEN** system navigates to the next question

#### Scenario: Exit with Escape key
- **WHEN** user presses the Escape key
- **THEN** system returns to the dashboard

#### Scenario: Disabled answer selection keys
- **WHEN** user presses A/B/C/D keys in memorize mode
- **THEN** system does not respond (answer selection is disabled)

#### Scenario: Disabled Enter key for submission
- **WHEN** user presses Enter key in memorize mode
- **THEN** system does not submit (no submission in memorize mode)
