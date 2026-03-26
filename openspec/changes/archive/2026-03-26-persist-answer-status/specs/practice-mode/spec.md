# practice-mode Specification (Delta)

## MODIFIED Requirements

### Requirement: Track answer status
The system SHALL track which questions have been answered and whether they were correct or incorrect, storing this information persistently across sessions.

#### Scenario: Mark question as answered
- **WHEN** user submits an answer
- **THEN** system marks the question as completed in both the session state and persistent storage

#### Scenario: Allow re-answering
- **WHEN** user navigates back to a previously answered question
- **THEN** system allows re-selecting and re-submitting the answer

#### Scenario: Persist answer status across sessions
- **WHEN** user answers questions and then closes the browser
- **THEN** system stores the answer status in localStorage

#### Scenario: Restore answer status on session start
- **WHEN** user starts a new practice session after previously answering questions
- **THEN** system loads the answer statuses from localStorage and initializes the session state

#### Scenario: Update persistent storage on re-answer
- **WHEN** user re-answers a previously answered question
- **THEN** system updates both the session state and the persistent storage with the new status
