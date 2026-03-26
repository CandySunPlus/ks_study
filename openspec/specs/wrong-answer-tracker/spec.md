# wrong-answer-tracker Specification

## Purpose
TBD - created by archiving change coding-practice-website. Update Purpose after archive.
## Requirements
### Requirement: Store wrong answers in localStorage
The system SHALL persist question IDs of incorrectly answered questions in browser localStorage, organized by subject.

#### Scenario: Record wrong answer
- **WHEN** user submits an incorrect answer
- **THEN** system adds the questionId to the wrong answers list for that subject in localStorage

#### Scenario: Remove from wrong answers on correct re-answer
- **WHEN** user correctly answers a question that was previously in the wrong answers list
- **THEN** system removes that questionId from the wrong answers list

#### Scenario: Avoid duplicate entries
- **WHEN** user answers the same question incorrectly multiple times
- **THEN** system ensures the questionId appears only once in the wrong answers list

### Requirement: Retrieve wrong answers by subject
The system SHALL provide a method to retrieve all wrong answer question IDs for a given subject.

#### Scenario: Get wrong answers for subject
- **WHEN** system needs to display wrong answers for "马克思主义基本原理"
- **THEN** system retrieves the array of questionIds from localStorage under that subject key

#### Scenario: No wrong answers yet
- **WHEN** user has not answered any questions incorrectly for a subject
- **THEN** system returns an empty array

### Requirement: Store practice statistics
The system SHALL track total questions, completed count, correct count, and wrong count per subject in localStorage.

#### Scenario: Update stats after answer
- **WHEN** user submits an answer
- **THEN** system increments completed count and either correct or wrong count

#### Scenario: Initialize stats for new subject
- **WHEN** user practices a subject for the first time
- **THEN** system creates a stats object with total, completed, correct, and wrong counts initialized

#### Scenario: Retrieve stats for dashboard
- **WHEN** dashboard view is displayed
- **THEN** system retrieves all stats from localStorage for all subjects

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

