# mobile-layout Specification

## Purpose
Optimizes the practice/review interface for mobile devices with compact, single-row layouts for header and navigation controls, maximizing content area and improving usability on small screens.

## ADDED Requirements

### Requirement: Icon-based compact header
The system SHALL display practice/review header in a single row using icons and abbreviations for mobile optimization.

#### Scenario: Desktop header layout
- **WHEN** viewing on desktop (width > 768px)
- **THEN** system displays `[← 返回] 📝 练习 1/100 [☰ 导航]` in single row

#### Scenario: Mobile header layout
- **WHEN** viewing on mobile (width ≤ 768px)
- **THEN** system displays `[←] 📝 1/100 [☰]` in single row with minimal spacing

#### Scenario: Ultra-compact header
- **WHEN** viewing on small phone (width < 375px)
- **THEN** system displays `[←] 📝1/100 [☰]` with no spaces between elements

### Requirement: Mode indicator with icons
The system SHALL use icons to distinguish practice mode from review mode in the header.

#### Scenario: Practice mode indicator
- **WHEN** in practice mode
- **THEN** system displays 📝 icon before counter

#### Scenario: Review mode indicator
- **WHEN** in review mode
- **THEN** system displays 🔄 icon before counter

### Requirement: Single-row navigation controls
The system SHALL display navigation controls (上一题, 提交, 下一题) in a single row that never wraps on any screen size.

#### Scenario: Three-button layout for type 0/1
- **WHEN** displaying type 0 or type 1 question
- **THEN** system displays three buttons in equal-width flexbox layout
- **AND** buttons do not wrap to second line on any screen size

#### Scenario: Two-button layout for type 3
- **WHEN** displaying type 3 question
- **THEN** system displays two buttons (上一题, 下一题) with space between
- **AND** buttons are sized appropriately for two-button layout

#### Scenario: Buttons are touch-friendly
- **WHEN** displaying navigation controls on mobile
- **THEN** system ensures buttons have minimum 44px height for easy tapping

### Requirement: Responsive header flexbox
The system SHALL use flexbox layout for header to distribute space efficiently across screen sizes.

#### Scenario: Left-aligned back button
- **WHEN** displaying header
- **THEN** system aligns back button to the left edge

#### Scenario: Center-aligned counter
- **WHEN** displaying header
- **THEN** system centers the question counter with mode icon
- **AND** counter takes up flexible space between left and right elements

#### Scenario: Right-aligned navigation toggle
- **WHEN** displaying header
- **THEN** system aligns navigation panel toggle to the right edge

### Requirement: Adaptive text sizing
The system SHALL adjust text size and spacing based on available screen width.

#### Scenario: Desktop text sizing
- **WHEN** viewing on desktop (width > 768px)
- **THEN** system uses full text labels ("返回", "导航")
- **AND** system uses comfortable spacing between elements

#### Scenario: Mobile text sizing
- **WHEN** viewing on mobile (width ≤ 768px)
- **THEN** system uses icon-only buttons
- **AND** system reduces spacing to fit content

#### Scenario: Question title sizing
- **WHEN** displaying question title on mobile
- **THEN** system uses responsive font size (16-18px) for readability

### Requirement: Maximize content area
The system SHALL minimize header and control heights to maximize space for question content on mobile.

#### Scenario: Compact header height
- **WHEN** displaying header on mobile
- **THEN** system uses minimal padding (8-12px vertical)
- **AND** header takes no more than 48px height

#### Scenario: Compact navigation controls
- **WHEN** displaying navigation controls on mobile
- **THEN** system uses minimal padding while maintaining touch-friendly size
- **AND** controls take no more than 56px height

### Requirement: Maintain accessibility
The system SHALL ensure icon-based interface remains accessible with proper labels and tooltips.

#### Scenario: Icon buttons have aria-labels
- **WHEN** displaying icon-only buttons
- **THEN** system includes aria-label attributes with full text ("返回", "切换导航面板")

#### Scenario: Tooltips on hover (desktop)
- **WHEN** user hovers over icon button on desktop
- **THEN** system displays tooltip with full text label

#### Scenario: Touch targets are adequate
- **WHEN** displaying interactive elements on mobile
- **THEN** system ensures minimum 44x44px touch target size
