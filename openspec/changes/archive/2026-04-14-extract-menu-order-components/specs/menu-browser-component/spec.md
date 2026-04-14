## ADDED Requirements

### Requirement: MenuBrowser Component Displays Menu Items
The MenuBrowser component SHALL display all available menu items in a card grid layout with item details.

#### Scenario: Menu items render as cards
- **WHEN** MenuBrowser component receives a populated menuItems prop
- **THEN** each item is displayed in a card with name, price, and optional description visible

#### Scenario: Loading state displayed
- **WHEN** MenuBrowser is loading (menuLoading prop is true)
- **THEN** a loading indicator (spinner) is displayed centered in the menu area

#### Scenario: Empty state handled
- **WHEN** MenuBrowser receives an empty menuItems array
- **THEN** a "No menu items available" message is displayed

### Requirement: MenuBrowser Component Accepts Item Quantity Input
The MenuBrowser component SHALL provide an inline quantity input for each menu item.

#### Scenario: Quantity input displays per item
- **WHEN** each menu item card is rendered
- **THEN** a quantity input field is displayed with minimum value of 1

#### Scenario: Quantity value is controlled by parent
- **WHEN** MenuBrowser receives quantityForItem prop with values
- **THEN** the quantity inputs display the values from quantityForItem keyed by menuItemId

#### Scenario: Quantity input change triggers parent callback
- **WHEN** user changes the quantity input for a menu item
- **THEN** the onQuantityChange callback is invoked with (menuItemId, newQuantity)

### Requirement: MenuBrowser Component Add to Order Button
The MenuBrowser component SHALL provide an "Add" button for each menu item to trigger adding to order.

#### Scenario: Add button displayed on each card
- **WHEN** MenuBrowser renders a menu item
- **THEN** an "Add" button is displayed next to the quantity input

#### Scenario: Add button invokes parent callback
- **WHEN** user clicks the "Add" button for a menu item
- **THEN** the onAddItem callback is invoked with the menuItemId

#### Scenario: Add button disabled during order creation
- **WHEN** the isCreating prop is true
- **THEN** the "Add" button is disabled and cannot be clicked

### Requirement: MenuBrowser Accepts Optional Props for Modifiers
The MenuBrowser component SHALL accept modifiers-related props for extensibility, even if not initially used.

#### Scenario: Component accepts modifiers prop
- **WHEN** MenuBrowser component is instantiated with a modifiersForItem prop
- **THEN** it accepts and stores the prop without error

#### Scenario: Component accepts modifier update callback
- **WHEN** MenuBrowser component is instantiated with onModifiersChange callback
- **THEN** it accepts the callback without error
