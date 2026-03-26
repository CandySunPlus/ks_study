# question-navigation-panel Specification

## Purpose
Provides a collapsible navigation panel that displays all questions in a grid layout with status indicators (unanswered, correct, incorrect), allowing users to jump directly to any question in the practice or review session.
## Requirements
### Requirement: Display question grid with status indicators
The system SHALL display a grid of all questions in the current practice/review session, with each question showing its status through color coding and icons. Status SHALL be loaded from persistent storage on initialization and SHALL differentiate between multiple-choice (correct/incorrect) and short-answer (viewed) question types.

#### Scenario: Display viewed short-answer question (type 3)
- **WHEN** a type 3 question has been revealed/viewed
- **THEN** system displays the question number in blue with a book icon (📖)

### Requirement: Enable direct question navigation
The system SHALL allow users to jump directly to any question by clicking on its number in the navigation panel.

#### Scenario: Jump to different question
- **WHEN** user clicks on a question number in the navigation panel
- **THEN** system displays that question in the main view and updates the current question indicator

#### Scenario: Preserve unsaved answer when jumping
- **WHEN** user has selected an answer but not submitted, then clicks a different question
- **THEN** system preserves the selected answer in memory and restores it if user returns to that question

#### Scenario: Jump from first to last question
- **WHEN** user clicks on the last question number while viewing the first question
- **THEN** system immediately displays the last question

### Requirement: Toggle panel visibility
The system SHALL provide a button to show or hide the navigation panel.

#### Scenario: Open panel with toggle button
- **WHEN** panel is closed and user clicks the toggle button
- **THEN** system displays the navigation panel

#### Scenario: Close panel with toggle button
- **WHEN** panel is open and user clicks the toggle button
- **THEN** system hides the navigation panel

#### Scenario: Panel state visible in button
- **WHEN** displaying the toggle button
- **THEN** system shows appropriate icon indicating current state (grid icon when closed, close icon when open)

### Requirement: Persist panel state during session
The system SHALL remember whether the navigation panel is open or closed for the duration of the practice/review session.

#### Scenario: Panel state persists across questions
- **WHEN** user opens the panel and navigates to a different question
- **THEN** system keeps the panel open

#### Scenario: Panel state persists on first load
- **WHEN** user opens the panel for the first time in a session
- **THEN** system shows the panel open by default

#### Scenario: Panel state resets on new session
- **WHEN** user starts a new practice or review session
- **THEN** system shows the panel open by default

### Requirement: Provide visual feedback for panel interaction
The system SHALL provide clear visual feedback when users interact with the navigation panel.

#### Scenario: Hover over question number
- **WHEN** user hovers over a question number
- **THEN** system displays a hover effect (e.g., background color change, scale)

#### Scenario: Show tooltip on toggle button
- **WHEN** user hovers over the toggle button
- **THEN** system displays a tooltip explaining the action (e.g., "Show navigation" or "Hide navigation")

#### Scenario: Scroll to current question in panel
- **WHEN** navigation panel is opened
- **THEN** system automatically scrolls the panel to make the current question visible

