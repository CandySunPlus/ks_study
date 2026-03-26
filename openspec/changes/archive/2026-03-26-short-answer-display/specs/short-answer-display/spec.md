# short-answer-display Specification

## Purpose
Renders type 3 (short-answer) questions with a reveal pattern, displaying reference answer text without requiring user submission, enabling users to study explanatory content.

## ADDED Requirements

### Requirement: Detect and render type 3 questions
The system SHALL detect when a question has type 3 and render it with short-answer layout instead of multiple-choice layout.

#### Scenario: Identify type 3 question
- **WHEN** loading a question with `type: 3`
- **THEN** system uses short-answer rendering instead of multiple-choice rendering

#### Scenario: Type 3 has empty options
- **WHEN** rendering a type 3 question
- **THEN** system does not attempt to render answerOptions (which is an empty array)

### Requirement: Display reveal button initially
The system SHALL show a "显示答案" button for type 3 questions that have not been revealed yet.

#### Scenario: First time viewing type 3 question
- **WHEN** user navigates to a type 3 question they haven't revealed before
- **THEN** system displays a centered "💡 显示答案" button

#### Scenario: Reveal button is prominent
- **WHEN** displaying the reveal button
- **THEN** system styles it prominently with blue background and clear icon

### Requirement: Reveal answer on button click
The system SHALL display the answer text when user clicks the reveal button.

#### Scenario: Click reveal button
- **WHEN** user clicks "显示答案" button
- **THEN** system replaces button with answer text display
- **AND** system marks question as "revealed" in session state
- **AND** system updates navigation panel to show blue status

#### Scenario: Answer text is formatted
- **WHEN** displaying revealed answer
- **THEN** system shows "📖 答案：" label followed by answer text
- **AND** system preserves line breaks and formatting from original text

### Requirement: Persist revealed state
The system SHALL remember which type 3 questions have been revealed, both in session and across page refreshes.

#### Scenario: Navigate away and back to revealed question
- **WHEN** user reveals a type 3 question, navigates away, then returns
- **THEN** system shows the answer text immediately (not the reveal button)

#### Scenario: Persist viewed status across sessions
- **WHEN** user reveals a type 3 question and refreshes the page
- **THEN** system loads viewed status from localStorage
- **AND** system shows answer text immediately in subsequent sessions

### Requirement: Hide submit button for type 3
The system SHALL not display a submit button for type 3 questions since there is no answer to submit.

#### Scenario: Type 3 navigation controls
- **WHEN** displaying a type 3 question
- **THEN** system shows only "上一题" and "下一题" buttons (no "提交" button)

#### Scenario: Type 0/1 navigation controls unchanged
- **WHEN** displaying a type 0 or type 1 question
- **THEN** system shows "上一题", "提交", and "下一题" buttons as before

### Requirement: Support keyboard shortcuts for reveal
The system SHALL allow users to reveal answers using keyboard shortcuts.

#### Scenario: Press Enter to reveal
- **WHEN** viewing an unrevealed type 3 question and user presses Enter
- **THEN** system reveals the answer (same as clicking the button)

#### Scenario: Press Space to reveal
- **WHEN** viewing an unrevealed type 3 question and user presses Space
- **THEN** system reveals the answer (same as clicking the button)

#### Scenario: Keyboard navigation works after reveal
- **WHEN** answer is revealed and user presses N or P
- **THEN** system navigates to next/previous question as expected

### Requirement: Track viewed status separately
The system SHALL track type 3 "viewed" status separately from type 0/1 "correct/incorrect" status.

#### Scenario: Store viewed status
- **WHEN** user reveals a type 3 question
- **THEN** system stores status as "viewed" (not "correct" or "incorrect")

#### Scenario: Retrieve viewed status on load
- **WHEN** initializing question statuses
- **THEN** system checks for "viewed" status for type 3 questions
- **AND** system shows blue color in navigation panel for viewed type 3

### Requirement: Exclude from review mode
The system SHALL not include type 3 questions in review mode since they are reference material, not testable questions.

#### Scenario: Start review mode
- **WHEN** user starts review mode for a subject
- **THEN** system filters out all type 3 questions from the review set

#### Scenario: Review mode only shows wrong answers
- **WHEN** filtering questions for review mode
- **THEN** system includes only type 0 and type 1 questions that were answered incorrectly
