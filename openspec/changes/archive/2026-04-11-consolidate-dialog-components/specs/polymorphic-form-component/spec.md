## ADDED Requirements

### Requirement: Polymorphic entity form component with dependency injection
The system SHALL provide an `EntityForm` component that accepts a field descriptor array and renders a generic CRUD form for any entity type. The form SHALL support text, number, and select input types with validation via injected validator functions.

#### Scenario: Form renders with injected field descriptors
- **WHEN** `EntityForm` is rendered with `fields=[{name: "title", label: "Title", type: "text", required: true}]`
- **THEN** form renders a text input labeled "Title" with required attribute

#### Scenario: Form input change updates parent state
- **WHEN** user types in an `EntityForm` input field
- **THEN** `onValuesChange` callback is called with updated values object

#### Scenario: Form submission with validation
- **WHEN** user clicks "Save" button and field has `validate` function
- **THEN** validator is called; if it returns error string, error displays; if null, `onSubmit` executes

#### Scenario: Supporting multiple input types
- **WHEN** `EntityForm` has fields with `type: "number"` and `type: "select"`
- **THEN** form renders appropriate HTML input type and select element

#### Scenario: Select field with options
- **WHEN** field has `type: "select"` with `options: [{label: "Option A", value: "a"}]`
- **THEN** form renders select element with option elements

#### Scenario: Form mode determines title and button text
- **WHEN** `EntityForm` is rendered with `mode: "creating"` and `title: "Create Table"`
- **THEN** header displays "Create Table" and submit button shows "Create" (or "Save")
- **WHEN** `EntityForm` is rendered with `mode: "editing"` and `title: "Edit Table"`
- **THEN** header displays "Edit Table"

#### Scenario: Loading state disables inputs
- **WHEN** `isLoading=true`
- **THEN** all form inputs and submit button are disabled and submit button shows loading indicator

#### Scenario: Error message display
- **WHEN** `errorMessage="Validation failed on backend"` is provided
- **THEN** error message appears in red styling above form inputs

#### Scenario: Cancel button action
- **WHEN** user clicks "Cancel" button
- **THEN** `onCancel` callback is executed

### Requirement: EntityForm uses Beer CSS styling
The form SHALL use Beer CSS utility classes for styling (round, border, padding, grid layout, etc.) to match existing UI patterns.

#### Scenario: Form has consistent styling with existing components
- **WHEN** `EntityForm` is rendered
- **THEN** component has classes: round, border, elevate, padding, and uses grid layout
