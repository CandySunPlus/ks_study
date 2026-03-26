## ADDED Requirements

### Requirement: Load JSON question files
The system SHALL load question data from JSON files in the study directory using the Fetch API.

#### Scenario: Successful file load
- **WHEN** user selects a subject (e.g., "马克思主义基本原理")
- **THEN** system fetches the corresponding JSON file and parses it into memory

#### Scenario: File not found
- **WHEN** JSON file does not exist at the expected path
- **THEN** system displays an error message indicating the file could not be loaded

#### Scenario: Invalid JSON format
- **WHEN** JSON file contains malformed data
- **THEN** system displays an error message indicating parsing failed

### Requirement: Parse question structure
The system SHALL parse questions with the following structure: questionId, title, type (0=single-choice, 1=multiple-choice), answerOptions (array of {content, number}), answer (array of correct answer indices), and score.

#### Scenario: Parse single-choice question
- **WHEN** question type is 0
- **THEN** system recognizes it as single-choice and allows only one answer selection

#### Scenario: Parse multiple-choice question
- **WHEN** question type is 1
- **THEN** system recognizes it as multiple-choice and allows multiple answer selections

#### Scenario: Extract answer options
- **WHEN** question contains answerOptions array
- **THEN** system displays each option with its content and number (0=A, 1=B, 2=C, 3=D)

### Requirement: Cache loaded questions in memory
The system SHALL cache loaded questions in memory to avoid re-fetching during the same session.

#### Scenario: Re-select same subject
- **WHEN** user switches to a different subject and then returns to a previously loaded subject
- **THEN** system uses cached data without making another fetch request

#### Scenario: First-time subject selection
- **WHEN** user selects a subject for the first time in the session
- **THEN** system fetches and caches the question data
