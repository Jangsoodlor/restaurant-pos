## MODIFIED Requirements

### Requirement: Display Added Items
The page SHALL display a list of items added to the current order, and allow users to edit them via a modal.

#### Scenario: Added items displayed below menu browser
- **WHEN** user adds items to the order
- **THEN** an "Order Items" section appears showing each added item with name, quantity, and subtotal

#### Scenario: Edit added item quantity and modifiers
- **WHEN** user clicks Edit on an added item
- **THEN** a modal opens allowing the user to edit the quantity and select/deselect menu modifiers

#### Scenario: Delete added item
- **WHEN** user clicks Delete on an added item
- **THEN** the item is removed from the order items list
