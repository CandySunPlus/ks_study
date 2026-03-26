## Context

The app currently handles two question types:
- Type 0: Single-choice (radio buttons)
- Type 1: Multiple-choice (checkboxes)

Type 3 questions (简述题 - short answer) exist in the data but are not rendered because they have empty `answerOptions` arrays. The answer text is stored in `question.answer[0]`.

Additionally, the mobile experience is poor due to:
- Multi-line header that wastes vertical space
- Navigation controls that wrap on small screens
- Text-heavy labels that don't fit well on mobile

## Goals / Non-Goals

**Goals:**
- Render type 3 questions with answer text visible
- Use reveal pattern (user clicks to show answer)
- Track viewed status for type 3 questions
- Optimize mobile UI with compact, icon-based layouts
- Maintain single-row layouts for header and navigation controls
- Support keyboard shortcuts for reveal action

**Non-Goals:**
- Making type 3 questions testable (they're reference material)
- Adding text input for user answers
- Including type 3 in review mode
- Changing existing multiple-choice question behavior
- Adding answer history or timestamps

## Decisions

### 1. Question Type Rendering Strategy

**Decision**: Use type detection in `renderQuestion()` to branch to specialized renderers

```javascript
function renderQuestion() {
    const question = state.questions[state.currentQuestionIndex];

    if (question.type === 3) {
        renderShortAnswerQuestion(question);
    } else {
        renderMultipleChoiceQuestion(question);
    }
}
```

**Rationale**:
- Clean separation of concerns
- Easy to extend for future question types
- Each renderer handles its own layout and controls
- No complex conditional logic in single function

**Alternatives considered**:
- Single renderer with conditionals: Rejected - too complex, hard to maintain
- Separate components/classes: Rejected - overkill for this simple app

### 2. Reveal Pattern for Type 3

**Decision**: Show "显示答案" button initially, replace with answer text on click

```
Before:              After:
┌──────────────┐    ┌──────────────────────┐
│ Question     │    │ Question             │
│              │    │                      │
│ [显示答案]   │ →  │ 📖 答案：            │
│              │    │ [Answer text...]     │
│ [上一题][下一题]│  │ [上一题][下一题]     │
└──────────────┘    └──────────────────────┘
```

**Rationale**:
- Encourages thinking before looking
- Clear user control over when to view
- Can track viewed vs not-viewed status
- Simple state management (boolean per question)

**Alternatives considered**:
- Auto-show answer: Rejected - no way to track if user actually read it
- Collapsible toggle: Rejected - unnecessary complexity, once revealed is enough
- Modal popup: Rejected - interrupts flow, poor mobile UX

### 3. Mobile Header Layout: Icon-Based

**Decision**: Use icons and abbreviations for compact single-row header

```
Desktop:  [← 返回]     📝 练习 1/100     [☰ 导航]
Mobile:   [←]  📝 1/100  [☰]
```

**Rationale**:
- Icons are universal and space-efficient
- 📝 (practice) vs 🔄 (review) clearly distinguishes modes
- Single row saves precious vertical space on mobile
- Numbers (1/100) are self-explanatory

**Alternatives considered**:
- Keep full text on mobile: Rejected - wraps to multiple lines, wastes space
- Use abbreviations only: Rejected - icons are clearer and more visual
- Remove mode indicator: Rejected - user needs to know practice vs review

### 4. Navigation Controls Layout

**Decision**: Always single-row flex layout, hide submit button for type 3

```
Type 0/1:  [上一题] [提交] [下一题]
Type 3:    [上一题]        [下一题]
```

**Rationale**:
- Consistent layout across all question types
- No wrapping on narrow screens
- Equal-width buttons for easy tapping on mobile
- Submit button irrelevant for type 3 (no answer to submit)

**Alternatives considered**:
- Keep 3-button layout with disabled submit: Rejected - confusing, wastes space
- Stack buttons vertically on mobile: Rejected - wastes vertical space
- Use icon-only buttons: Rejected - less clear for Chinese users

### 5. Status Tracking for Type 3

**Decision**: Use "viewed" status (not "correct"/"incorrect")

```javascript
AnsweredQuestions storage:
{
  "马克思主义基本原理": {
    "16628": "correct",      // Type 0/1
    "16629": "incorrect",    // Type 0/1
    "16675": "viewed"        // Type 3
  }
}
```

**Rationale**:
- Type 3 has no correct/incorrect (it's reference material)
- "viewed" clearly indicates user has seen the content
- Consistent with existing AnsweredQuestions module
- Easy to filter in stats and review mode

**Alternatives considered**:
- Separate storage for type 3: Rejected - unnecessary duplication
- Use "correct" for all viewed: Rejected - misleading, affects accuracy stats
- Don't track at all: Rejected - users want to see progress

### 6. Navigation Panel Colors

**Decision**: Use blue for viewed type 3 questions

```
Type 0/1:  Gray (unanswered) → Green (correct) → Red (incorrect)
Type 3:    Gray (not viewed) → Blue (viewed)
```

**Rationale**:
- Blue is neutral (not right/wrong)
- Distinguishes type 3 from type 0/1
- Consistent with "info" color convention
- Already using blue for current question highlight

**Alternatives considered**:
- Use green for viewed: Rejected - implies "correct", misleading
- Use purple/orange: Rejected - adds visual complexity
- No color change: Rejected - users can't see progress

### 7. Review Mode Behavior

**Decision**: Exclude type 3 questions from review mode entirely

**Rationale**:
- Review mode is for practicing wrong answers
- Type 3 has no right/wrong (it's reference material)
- Users review type 3 during normal practice mode
- Simpler logic, no special cases

**Alternatives considered**:
- Include unviewed type 3 in review: Rejected - confuses purpose of review mode
- Add separate "review materials" mode: Rejected - unnecessary complexity

### 8. Stats Impact

**Decision**: Count type 3 toward "completed" but not toward accuracy

```javascript
Stats calculation:
{
  completed: total_type01_answered + total_type3_viewed,
  correct: type01_correct_only,
  wrong: type01_wrong_only,
  accuracy: correct / (correct + wrong)  // Excludes type 3
}
```

**Rationale**:
- Users want to see overall progress (completed includes type 3)
- Accuracy should only reflect testable questions
- Clear separation between reference material and test questions

**Alternatives considered**:
- Separate "materials reviewed" stat: Rejected - clutters dashboard
- Exclude type 3 from all stats: Rejected - users want to track progress
- Include type 3 in accuracy as "correct": Rejected - misleading

## Risks / Trade-offs

**[Risk] Users may skip reading by just clicking reveal**
→ Mitigation: This is acceptable - the goal is to make content accessible, not to enforce learning. Users who want to learn will read, others can skim.

**[Risk] Icon-based header may be unclear to some users**
→ Mitigation: Icons chosen are universal (arrow, pencil, hamburger menu). Testing with users can validate. Can add tooltips if needed.

**[Risk] Type 3 questions inflate "completed" count**
→ Mitigation: This is intentional - viewing reference material is a form of completion. Accuracy percentage remains accurate (excludes type 3).

**[Trade-off] Once revealed, answer stays visible**
→ Acceptable: Users can navigate away and back if they want to test themselves. Most use case is reference/study, not self-testing.

**[Trade-off] No "hide answer" toggle**
→ Acceptable: Keeps UI simple. If user wants to re-test themselves, they can navigate away and back (answer will be hidden until revealed again).

**[Trade-off] Mobile header loses some context**
→ Acceptable: Space savings outweigh the lost context. Users know what mode they're in from their action (clicked "练习" vs "复习").

## Migration Plan

**Deployment:**
1. No data migration needed (type 3 questions already exist in JSON files)
2. Code changes are additive (new rendering path for type 3)
3. Existing localStorage data compatible (new "viewed" status added)
4. Users will see type 3 questions become usable immediately
5. Mobile users will see improved layout on next page load

**Rollback Strategy:**
- If issues arise, revert code changes
- Type 3 questions will return to being unusable (current state)
- No data loss (localStorage remains intact)
- Mobile layout reverts to current multi-line design
