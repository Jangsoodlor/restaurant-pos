## ADDED Requirements

### Requirement: OrderSummary Component Displays Line Items
The OrderSummary component SHALL display all order line items in a list format with item details and pricing.

#### Scenario: Line items render with details
- **WHEN** OrderSummary receives a populated lineItems prop
- **THEN** each line item displays the menu item name, quantity, unit price, and total price

#### Scenario: Modifiers are displayed if present
- **WHEN** a line item has selectedModifierIds
- **THEN** the modifiers are displayed below the item name

#### Scenario: Empty state displayed
- **WHEN** OrderSummary receives an empty lineItems array
- **THEN** a "No items added yet" message with dashed border is displayed

### Requirement: OrderSummary Component Displays Order Total
The OrderSummary component SHALL calculate and display the total price of all line items.

#### Scenario: Total price calculated and displayed
- **WHEN** OrderSummary receives lineItems prop with items
- **THEN** the total is calculated as sum of (quantity × unitPrice) for all items and displayed clearly

#### Scenario: Total updates when items change
- **WHEN** lineItems array is updated
- **THEN** the total is recalculated and displayed immediately

### Requirement: OrderSummary Component Edit Line Item Quantity
The OrderSummary component SHALL allow editing the quantity of individual line items.

#### Scenario: Edit button displayed on each item
- **WHEN** OrderSummary renders a line item
- **THEN** an edit button (pencil icon) is displayed when not in edit mode

#### Scenario: Click edit button enters inline edit mode
- **WHEN** user clicks the edit button on a line item
- **THEN** the quantity field becomes editable and a "Done" button appears

#### Scenario: Edit mode shows calculated prices
- **WHEN** a line item is in edit mode
- **THEN** the unit price and calculated total (quantity × unitPrice) are displayed

#### Scenario: Quantity change invokes parent callback
- **WHEN** user updates quantity in edit mode
- **THEN** the onEditQuantity callback is invoked with (lineItemTempId, newQuantity)

#### Scenario: Done button exits edit mode
- **WHEN** user clicks "Done" button in edit mode
- **THEN** edit mode is exited and the quantity displays in read-only format

### Requirement: OrderSummary Component Delete Line Item
The OrderSummary component SHALL provide a delete/remove button for each line item.

#### Scenario: Delete button displayed on each item
- **WHEN** OrderSummary renders a line item and not in edit mode
- **THEN** a delete button (close icon) is displayed

#### Scenario: Delete button invokes parent callback
- **WHEN** user clicks the delete button for a line item
- **THEN** the onDeleteItem callback is invoked with the lineItemTempId

### Requirement: OrderSummary Component Displays Section Header
The OrderSummary component SHALL display a header showing the section title and item count.

#### Scenario: Header displays with item count
- **WHEN** OrderSummary renders with line items
- **THEN** the header displays "Order items (N)" where N is the count of lineItems

#### Scenario: Header displays without count when empty
- **WHEN** OrderSummary renders with empty lineItems
- **THEN** the header displays "Order items" without a count
