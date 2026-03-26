# answered-questions-persistence Specification

## Purpose
Provides persistent storage for individual question answer status (correct/incorrect) across browser sessions using localStorage, enabling users to maintain their progress visualization even after page refresh.

## ADDED Requirements

### Requirement: Store answer status persistently
The system SHALL store each question's answer status (correct or incorrect) in localStorage, organized by subject and questionId.

#### Scenario: Store correct answer status
- **WHEN** user submits a correct answer
- **THEN** system stores the questionId with "correct" status in localStorage under the subject key

#### Scenario: Store incorrect answer status
- **WHEN** user submits an incorrect answer
- **THEN** system stores the questionId with "incorrect" status in localStorage under the subject key

#### Scenario: Update existing status
- **WHEN** user re-answers a previously answered question
- **THEN** system updates the stored status to reflect the new answer result

### Requirement: Retrieve answer status by question
The system SHALL provide a method to retrieve the answer status for a specific question by subject and questionId.

#### Scenario: Get status for answered question
- **WHEN** system needs to display status for a question that has been answered
- **THEN** system retrieves the status ("correct" or "incorrect") from localStorage

#### Scenario: Get status for unanswered question
- **WHEN** system needs to display status for a question that has not been answered
- **THEN** system returns null or undefined to indicate no status exists

### Requirement: Retrieve all answer statuses for a subject
The system SHALL provide a method to retrieve all answer statuses for a given subject.

#### Scenario: Get all statuses for subject
- **WHEN** system initializes a practice or review session
- **THEN** system retrieves all questionId-to-status mappings for that subject from localStorage

#### Scenario: No statuses exist for subject
- **WHEN** user practices a subject for the first time
- **THEN** system returns an empty object

### Requirement: Clear answer statuses
The system SHALL provide a method to clear answer statuses for a specific subject or all subjects.

#### Scenario: Clear statuses for one subject
- **WHEN** user requests to clear data for a specific subject
- **THEN** system removes all answer statuses for that subject from localStorage

#### Scenario: Clear all statuses
- **WHEN** user requests to clear all data
- **THEN** system removes answer statuses for all subjects from localStorage

### Requirement: Export and import answer statuses
The system SHALL include answer statuses in data export and restore them during data import.

#### Scenario: Export includes answer statuses
- **WHEN** user exports their data
- **THEN** system includes the answeredQuestions data structure in the exported JSON file

#### Scenario: Import restores answer statuses
- **WHEN** user imports a previously exported data file
- **THEN** system restores the answeredQuestions data to localStorage

#### Scenario: Import merges with existing data
- **WHEN** user imports data that overlaps with existing answer statuses
- **THEN** system merges the imported data, with imported data taking precedence for conflicts

### Requirement: Maintain data structure consistency
The system SHALL use a consistent data structure for storing answer statuses that is efficient and easy to query.

#### Scenario: Data structure format
- **WHEN** system stores answer statuses
- **THEN** system uses a nested object structure: `{subject: {questionId: status}}`

#### Scenario: Status values are normalized
- **WHEN** system stores or retrieves status
- **THEN** system uses only "correct" or "incorrect" as status values (no other strings)
