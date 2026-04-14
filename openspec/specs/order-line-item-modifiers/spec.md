## Purpose

Add support for selecting and persisting menu modifier choices on draft order line items so they are included in the final order payload.

## ADDED Requirements

### Requirement: Menu modifier selection on draft orders
The system SHALL provide a way to select menu modifiers for newly drafted line items before the order is placed.

#### Scenario: User configures modifiers
- **WHEN** user clicks "Edit" on a draft line item causing the edit modal to appear
- **THEN** the modal shows available menu modifiers

#### Scenario: User saves configured modifiers
- **WHEN** user selects modifiers and saves the modal
- **THEN** the `OrderFormCard` retains those configured modifier IDs in its local state

#### Scenario: Final order submission includes modifiers
- **WHEN** the order is finalized and submitted
- **THEN** the `OrderLineItemBase` payload includes the mapped array of selected modifier IDs
