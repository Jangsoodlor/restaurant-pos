## Purpose

The Menu Management UI provides a frontend interface for managing menu items and modifiers. Purpose: TBD.

## Requirements

### Requirement: Menu Management Page Navigation
The system SHALL provide a Menu Management page accessible via the `/menu` route. The page SHALL be integrated into the main navigation of the frontend application.

#### Scenario: User navigates to Menu Management
- **WHEN** a user clicks on a Menu navigation link or visits `/menu`
- **THEN** the Menu Management page loads and displays the Items tab as the default active tab

### Requirement: Tabbed Interface for Items and Modifiers
The Menu Management page SHALL display a tabbed interface with two tabs: "Menu Items" and "Modifiers". Users SHALL be able to switch between tabs to manage different entity types independently.

#### Scenario: User switches between tabs
- **WHEN** the user is on the Menu Items tab
- **THEN** clicking the Modifiers tab displays all modifier records and switching back shows item records

### Requirement: List Menu Items
The system SHALL fetch and display all menu items from the backend API endpoint `/menu/item/`. The items SHALL be displayed in a list format, with each item showing its name and price.

#### Scenario: Items are displayed on page load
- **WHEN** the Menu Management page loads with the Items tab active
- **THEN** the system fetches all menu items and displays them as individual card-like entries showing name and price

#### Scenario: Loading state is shown
- **WHEN** the system is fetching menu items
- **THEN** a loading message is displayed to the user

#### Scenario: Error state is handled
- **WHEN** fetching menu items fails
- **THEN** an error message is displayed to the user

### Requirement: List Menu Modifiers
The system SHALL fetch and display all menu modifiers from the backend API endpoint `/menu/modifier/`. The modifiers SHALL be displayed in the same card format as items when the Modifiers tab is active.

#### Scenario: Modifiers are displayed when tab is active
- **WHEN** the user switches to the Modifiers tab
- **THEN** the system fetches all modifiers and displays them in the same card format as items

### Requirement: Create Menu Item
Users SHALL be able to create a new menu item by clicking a "Create" button and submitting a form with required fields (name, price).

#### Scenario: User creates a menu item
- **WHEN** a user is on the Items tab and clicks "+ Create Item"
- **THEN** a form modal appears with fields for name (text) and price (number)

#### Scenario: Form validates required fields
- **WHEN** the user leaves the name field empty and tries to submit
- **THEN** an error message appears indicating that name is required

#### Scenario: New item is added after submission
- **WHEN** the user fills the form with valid data (name="Burger", price=8.99) and clicks "Submit"
- **THEN** the new item is sent to the backend and added to the item list upon success

#### Scenario: User cancels item creation
- **WHEN** a user clicks "Cancel" in the create form
- **THEN** the form closes and the item list is displayed unchanged

### Requirement: Create Menu Modifier
Users SHALL be able to create a new menu modifier by clicking a "Create" button and submitting a form with required fields (name, price). The interaction SHALL parallel the item creation flow.

#### Scenario: User creates a modifier
- **WHEN** a user is on the Modifiers tab and clicks "+ Create Modifier"
- **THEN** a form modal appears with fields for name (text) and price (number)

### Requirement: Edit Menu Item
Users SHALL be able to edit an existing menu item by clicking an edit action on the item card, modifying fields in a form, and submitting changes.

#### Scenario: User edits an item's name and price
- **WHEN** a user clicks the edit icon on a menu item card
- **THEN** a form modal appears pre-populated with the current name and price values

#### Scenario: Updated item is saved
- **WHEN** the user modifies fields and clicks "Submit"
- **THEN** the changes are sent to the backend and the item list reflects the updates

### Requirement: Edit Menu Modifier
Users SHALL be able to edit an existing menu modifier by clicking an edit action on the modifier card, modifying fields in a form, and submitting changes. The interaction SHALL parallel the item edit flow.

#### Scenario: User edits a modifier
- **WHEN** a user clicks the edit icon on a modifier card
- **THEN** a form modal appears pre-populated with current values

### Requirement: Delete Menu Item
Users SHALL be able to delete a menu item by clicking a delete action on the item card. A confirmation dialog SHALL appear before the delete is executed.

#### Scenario: User deletes an item with confirmation
- **WHEN** a user clicks the delete icon on a menu item card
- **THEN** a confirmation dialog appears asking "Are you sure you want to delete [item name]?"

#### Scenario: Item is deleted after confirmation
- **WHEN** the user confirms the deletion in the dialog
- **THEN** the item is deleted from the backend and removed from the list

#### Scenario: Deletion is cancelled
- **WHEN** the user clicks "Cancel" in the confirmation dialog
- **THEN** the dialog closes and the item list remains unchanged

### Requirement: Delete Menu Modifier
Users SHALL be able to delete a menu modifier by clicking a delete action on the modifier card. A confirmation dialog SHALL appear before the delete is executed.

#### Scenario: User deletes a modifier
- **WHEN** a user clicks the delete icon on a modifier card
- **THEN** a confirmation dialog appears for confirmation before deletion

### Requirement: Filter Menu Items by Name
Users SHALL be able to filter the menu items list by entering text in a name search field. Filtering SHALL be client-side and update the list in real-time as the user types.

#### Scenario: User filters items by partial name match
- **WHEN** a user types "burger" in the name search field
- **THEN** only items with names containing "burger" (case-insensitive) are displayed

#### Scenario: Clearing the search shows all items
- **WHEN** the user clears the name search field (empties the input)
- **THEN** all items are displayed again

### Requirement: Filter Menu Items by Price Range
Users SHALL be able to filter menu items by specifying a minimum and/or maximum price. Filtering SHALL be client-side and applied in combination with name filters (AND logic).

#### Scenario: User filters by price range
- **WHEN** a user enters minPrice=5.00 and maxPrice=12.00
- **THEN** only items with prices between 5.00 and 12.00 (inclusive) are displayed

#### Scenario: Filter by minimum price only
- **WHEN** a user enters minPrice=8.00 and leaves maxPrice empty
- **THEN** only items with price >= 8.00 are displayed

#### Scenario: Filter by maximum price only
- **WHEN** a user enters maxPrice=10.00 and leaves minPrice empty
- **THEN** only items with price <= 10.00 are displayed

#### Scenario: Filters combine with AND logic
- **WHEN** a user specifies name="Salad" AND minPrice=3.00
- **THEN** only items matching both conditions are displayed (name contains "Salad" AND price >= 3.00)

### Requirement: Filter Menu Modifiers by Name and Price
Users SHALL be able to filter menu modifiers using the same name and price range filters as menu items. Filters SHALL apply independently when the Modifiers tab is active.

#### Scenario: Modifiers tab filters work independently
- **WHEN** a user is on the Modifiers tab and applies name and price filters
- **THEN** only modifiers matching the filter criteria are displayed, and switching back to Items tab shows unfiltered items

### Requirement: Sort Menu Items
Users SHALL be able to sort the filtered menu items list in ascending or descending order. By default, no sort is applied (items appear in the backend response order). Sorting SHALL be by name.

#### Scenario: User applies ascending sort
- **WHEN** a user selects "Name (A→Z)" from the sort dropdown
- **THEN** items are sorted alphabetically by name in ascending order

#### Scenario: User applies descending sort
- **WHEN** a user selects "Name (Z→A)" from the sort dropdown
- **THEN** items are sorted alphabetically by name in descending order

#### Scenario: No sort is applied by default
- **WHEN** the page first loads
- **THEN** items appear in the order returned by the backend API (no client-side sorting applied)

### Requirement: Sort Menu Modifiers
Users SHALL be able to sort filtered modifiers using the same sort controls as items. Modifier sort state SHALL be independent of item sort state.

#### Scenario: Modifier sort is independent
- **WHEN** items are sorted (A→Z) and the user switches to the Modifiers tab
- **THEN** modifiers appear in their default backend order (no sort applied) unless the user explicitly selects a sort for modifiers

### Requirement: Visual Consistency with User Management Page
The Menu Management page layout, interaction patterns, and visual styling SHALL match the User Management page. Items and modifiers SHALL be displayed as individual card-like entries with consistent spacing and typography.

#### Scenario: Menu page layout matches User page
- **WHEN** comparing the Menu Items and User Management pages side-by-side
- **THEN** the layout structure (filter controls, create button, list of cards, action menus) is visually and functionally identical

### Requirement: Action Menu on Items and Modifiers
Each menu item and modifier card SHALL display an action menu (three-dot icon) that provides inline options to edit or delete the entity.

#### Scenario: Action menu is accessible on each card
- **WHEN** a user hovers over or interacts with a menu item card
- **THEN** an action menu icon is visible, typically in the top-right corner of the card

#### Scenario: Action menu reveals edit and delete options
- **WHEN** a user clicks the action menu icon
- **THEN** a dropdown appears with "Edit" and "Delete" options

### Requirement: API Integration for Menu Items
The system SHALL integrate with the existing menu item API endpoints: `GET /menu/item/` (list), `POST /menu/item/` (create), `PATCH /menu/item/{id}` (update), `DELETE /menu/item/{id}` (delete).

#### Scenario: CRUD operations use correct endpoints
- **WHEN** a user performs a create, read, update, or delete operation
- **THEN** the operation calls the appropriate menu item endpoint with correct HTTP method and payload

### Requirement: API Integration for Menu Modifiers
The system SHALL integrate with the existing menu modifier API endpoints: `GET /menu/modifier/` (list), `POST /menu/modifier/` (create), `PATCH /menu/modifier/{id}` (update), `DELETE /menu/modifier/{id}` (delete).

#### Scenario: CRUD operations for modifiers use correct endpoints
- **WHEN** a user performs a create, read, update, or delete operation on a modifier
- **THEN** the operation calls the appropriate modifier endpoint with correct HTTP method and payload

### Requirement: Form Validation and Error Handling
The create and edit forms SHALL validate that required fields (name, price) are provided. On validation failure, an error message SHALL be displayed. On API failure, the system SHALL display an error message to the user without clearing the form.

#### Scenario: Validation error prevents submission
- **WHEN** a user submits the form with an empty name field
- **THEN** a validation error message ("Name is required") appears and the form is not submitted

#### Scenario: API error is displayed without losing data
- **WHEN** the backend returns a failure response (e.g., 500 error)
- **THEN** an error message is displayed and the form data remains intact so the user can retry

### Requirement: Real-time UI Updates on Mutations
After a successful create, update, or delete operation, the system SHALL automatically refresh the menu items or modifiers list to reflect the change.

#### Scenario: List updates after successful creation
- **WHEN** a user successfully creates a new menu item
- **THEN** the new item immediately appears in the items list without requiring a manual page refresh

#### Scenario: List updates after successful deletion
- **WHEN** a user successfully deletes a menu item
- **THEN** the item is immediately removed from the list
