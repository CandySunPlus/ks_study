# wrong-answer-tracker Specification (Delta)

## MODIFIED Requirements

### Requirement: Export and import data
The system SHALL allow users to export localStorage data as JSON and import it back, including the new answeredQuestions data.

#### Scenario: Export data
- **WHEN** user clicks "Export" button
- **THEN** system downloads a JSON file containing all wrong answers, stats, and answeredQuestions data

#### Scenario: Import data
- **WHEN** user uploads a previously exported JSON file
- **THEN** system merges the data into localStorage, including answeredQuestions, preserving existing data where conflicts occur

#### Scenario: Clear all data
- **WHEN** user clicks "Clear All Data" button and confirms
- **THEN** system removes all practice-related data from localStorage, including answeredQuestions

#### Scenario: Export includes backward compatibility
- **WHEN** user exports data from new version
- **THEN** system includes answeredQuestions field in addition to existing wrongAnswers and stats fields

#### Scenario: Import handles old format
- **WHEN** user imports data exported before answeredQuestions feature
- **THEN** system successfully imports wrongAnswers and stats without errors, treating missing answeredQuestions as empty
