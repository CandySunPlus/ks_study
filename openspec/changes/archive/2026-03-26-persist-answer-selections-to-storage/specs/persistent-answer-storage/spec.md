## ADDED Requirements

### Requirement: Persistent Answer Storage

The system MUST store user's selected answers persistently using localStorage and MUST maintain backward compatibility with existing data formats.

#### Scenario: Store answer with selection

- **GIVEN** a user submits an answer with selected options ["0", "2"]
- **WHEN** the answer is saved
- **THEN** the system MUST store `{ status: "correct|incorrect", selected: ["0", "2"] }` in localStorage
- **AND** the data MUST be associated with the subject and questionId

#### Scenario: Retrieve answer with selection

- **GIVEN** a previously answered question exists in storage
- **WHEN** the system retrieves the answer data
- **THEN** it MUST return the selected answers array
- **AND** it MUST return the status

#### Scenario: Backward compatibility with old data format

- **GIVEN** existing data stored as plain string ("correct", "incorrect", "viewed")
- **WHEN** the system reads this data
- **THEN** it MUST convert it to the new object format
- **AND** it MUST handle `selected: null` gracefully for legacy data

#### Scenario: Restore session answers on practice start

- **GIVEN** a user starts practice for a subject with existing persistent answers
- **WHEN** the practice mode initializes
- **THEN** the system MUST populate `state.sessionAnswers` from persistent storage
- **AND** previously answered questions MUST display their selected answers

#### Scenario: Data export includes selections

- **GIVEN** a user exports their data
- **WHEN** the export file is generated
- **THEN** it MUST include the selected answers for each question

#### Scenario: Data import restores selections

- **GIVEN** an import file containing answer selections
- **WHEN** the user imports the data
- **THEN** the system MUST restore both status and selected answers
- **AND** the restored answers MUST be available after page refresh

#### Scenario: Clear data removes all selections

- **GIVEN** a user clears all data via DataManager
- **WHEN** the clear operation completes
- **THEN** all answer selections MUST be removed from storage
- **AND** `state.sessionAnswers` MUST be reset
