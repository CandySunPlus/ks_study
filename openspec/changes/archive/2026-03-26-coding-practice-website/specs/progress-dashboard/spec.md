## ADDED Requirements

### Requirement: Display subject statistics
The system SHALL display practice statistics for each available subject, including total questions, completed count, correct count, wrong count, and accuracy rate.

#### Scenario: Show subject card
- **WHEN** dashboard is displayed
- **THEN** system shows a card for each subject with its name and statistics

#### Scenario: Calculate accuracy rate
- **WHEN** displaying statistics
- **THEN** system calculates accuracy as (correct / completed * 100) and displays as percentage

#### Scenario: Show zero state
- **WHEN** user has not practiced a subject yet
- **THEN** system shows "未开始" or 0% accuracy with 0 completed

### Requirement: Provide quick access to modes
The system SHALL provide buttons to start practice mode or review mode for each subject.

#### Scenario: Start practice from dashboard
- **WHEN** user clicks "开始练习" button for a subject
- **THEN** system enters practice mode for that subject starting from first question

#### Scenario: Start review from dashboard
- **WHEN** user clicks "复习错题" button for a subject
- **THEN** system enters review mode for that subject with wrong answers only

#### Scenario: Disable review button when no wrong answers
- **WHEN** subject has zero wrong answers
- **THEN** system disables or hides the "复习错题" button

### Requirement: Display overall progress
The system SHALL show aggregate statistics across all subjects.

#### Scenario: Show total completed questions
- **WHEN** dashboard is displayed
- **THEN** system shows sum of completed questions across all subjects

#### Scenario: Show overall accuracy
- **WHEN** dashboard is displayed
- **THEN** system calculates and displays overall accuracy across all subjects

#### Scenario: Show total wrong answers
- **WHEN** dashboard is displayed
- **THEN** system shows total count of questions in wrong answer lists across all subjects

### Requirement: Provide data management options
The system SHALL provide buttons to export, import, and clear practice data.

#### Scenario: Access export function
- **WHEN** user clicks "导出数据" button
- **THEN** system triggers download of JSON file with all localStorage data

#### Scenario: Access import function
- **WHEN** user clicks "导入数据" button
- **THEN** system shows file picker to upload previously exported JSON file

#### Scenario: Access clear data function
- **WHEN** user clicks "清除数据" button
- **THEN** system shows confirmation dialog before clearing all data
